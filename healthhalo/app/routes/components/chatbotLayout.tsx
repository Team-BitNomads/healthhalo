import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for API calls
import {
  Send,
  Mic,
  Paperclip,
  Bot,
  User,
  ChevronRight,
  Square,
  Trash2,
  File as FileIcon,
  X,
  History,
  Plus,
  ExternalLink,
} from "lucide-react";
import { mockHistory } from "../../data/mockHistory";

// --- API Configuration ---
const API_BASE_URL = "https://healthhalo.onrender.com";
const CHATBOT_ENDPOINT = "/api/chatbot/";

// --- Types for Clarity ---
interface Plan {
  name: string;
  description: string;
  link: string;
}
interface Message {
  id: number;
  sender: "user" | "bot";
  type: "text" | "plans" | "file" | "audio";
  content: string; // The main text content
  links?: string[]; // Optional array of links from the API
  fileName?: string;
}

const getInitialMessages = (userName: string): Message[] => [
  {
    id: 1,
    sender: "bot",
    type: "text",
    content: `Hello ${userName}! I'm your HealthHalo AI Assistant. How can I help you today?`,
  },
];

const ChatbotLayout = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  type InputMode = "text" | "recording" | "filePreview" | "audioPreview";
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    startNewChat();
  }, []);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  const startNewChat = () => {
    const savedProfile = localStorage.getItem("userProfile");
    const userName = savedProfile
      ? JSON.parse(savedProfile).fullName?.split(" ")[0] || "there"
      : "there";
    setMessages(getInitialMessages(userName));
    setActiveChatId(null);
    setIsHistoryOpen(false);
  };

  const loadMockChat = (chatId: number) => {
    setActiveChatId(chatId);
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        type: "text",
        content: `This is the history for conversation #${chatId}. Ask me to continue!`,
      },
    ]);
    setIsHistoryOpen(false);
  };

  const resetInput = () => {
    setInputValue("");
    setAttachedFile(null);
    setAudioBlob(null);
    setInputMode("text");
  };

  // --- THE NEW, REAL handleSendMessage FUNCTION ---
  const handleSendMessage = async (
    text: string,
    type: Message["type"] = "text"
  ) => {
    if (!text.trim() && !attachedFile && !audioBlob) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Authentication error. Please log in again.");
      return;
    }

    // Add the user's message to the UI immediately
    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      type,
      content: text,
      fileName: attachedFile?.name,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Create a FormData object for the multipart request
    const formData = new FormData();
    if (type === "text") formData.append("prompt", text);
    if (type === "file" && attachedFile) formData.append("image", attachedFile);
    if (type === "audio" && audioBlob)
      formData.append("audio", audioBlob, "recording.webm");

    resetInput();
    setIsBotTyping(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}${CHATBOT_ENDPOINT}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const botResponseData = response.data;
      const botMessage: Message = {
        id: Date.now(),
        sender: "bot",
        type: "text",
        content: botResponseData.text,
        links: botResponseData.links || [],
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot API error:", error);
      const errorMessage: Message = {
        id: Date.now(),
        sender: "bot",
        type: "text",
        content: "I'm sorry, I encountered an error. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
      setInputMode("filePreview");
    }
  };
  const handleStartRecording = async () => {
    /* ... (Your working audio logic) ... */
  };
  const handleStopRecording = () => {
    /* ... (Your working audio logic) ... */
  };

  const renderInputArea = () => {
    switch (inputMode) {
      case "filePreview":
        return (
          <div className="flex items-center justify-between p-3 bg-slate-100 rounded-full border-2 border-emerald-300">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <FileIcon className="h-5 w-5 text-slate-500" />{" "}
              <span className="text-sm text-slate-700 truncate">
                {attachedFile?.name}
              </span>{" "}
            </div>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <button
                onClick={() =>
                  handleSendMessage(
                    `Attached file: ${attachedFile?.name}`,
                    "file"
                  )
                }
                className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700"
              >
                <Send className="h-5 w-5" />
              </button>{" "}
              <button
                onClick={resetInput}
                className="p-3 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300"
              >
                <X className="h-5 w-5" />
              </button>{" "}
            </div>{" "}
          </div>
        );
      case "recording":
        return (
          <div className="flex items-center justify-between p-3 bg-red-100 rounded-full border-2 border-red-300">
            {" "}
            <div className="flex items-center gap-3">
              {" "}
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>{" "}
              <span className="text-sm font-mono text-red-700">
                Recording...{" "}
                {new Date(recordingTime * 1000).toISOString().substr(14, 5)}
              </span>{" "}
            </div>{" "}
            <button
              onClick={handleStopRecording}
              className="p-3 bg-red-500 text-white rounded-full shadow-lg"
            >
              <Square className="h-5 w-5" />
            </button>{" "}
          </div>
        );
      case "audioPreview":
        return (
          <div className="flex items-center justify-between p-3 bg-slate-100 rounded-full border-2 border-emerald-300">
            {" "}
            <audio
              src={audioBlob ? URL.createObjectURL(audioBlob) : ""}
              controls
              className="h-10"
            ></audio>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <button
                onClick={() =>
                  handleSendMessage("Sent an audio recording", "audio")
                }
                className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700"
              >
                <Send className="h-5 w-5" />
              </button>{" "}
              <button
                onClick={resetInput}
                className="p-3 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300"
              >
                <Trash2 className="h-5 w-5" />
              </button>{" "}
            </div>{" "}
          </div>
        );
      case "text":
      default:
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="relative"
          >
            <div className="flex items-center w-full p-2 rounded-full border-2 bg-white transition-all duration-300 border-slate-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20">
              <div className="flex items-center pl-2 pr-2 space-x-2 text-slate-500">
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                  title="Record Audio"
                >
                  <Mic className="h-5 w-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                  title="Attach File"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 w-full h-10 bg-transparent text-base placeholder-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                className="p-3 bg-slate-200 text-slate-500 rounded-full hover:bg-emerald-600 hover:text-white transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                disabled={!inputValue || isBotTyping}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden animate-fadeInUp">
      <div className="relative p-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg">
            <Bot className="h-7 w-7 text-white" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-800">
              HealthHalo AI Assistant
            </h2>
            <p className="text-sm text-slate-500">Online & ready to help</p>
          </div>
        </div>
        <button
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className="flex items-center p-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200"
        >
          <History className="mr-2 h-4 w-4" /> History
        </button>
        {isHistoryOpen && (
          <div className="absolute top-full right-4 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 z-30 p-4 animate-[fadeInUp_0.2s_ease-in-out]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-700">
                Chat History
              </h3>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={startNewChat}
              className="flex items-center w-full p-2 mb-2 text-sm font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600"
            >
              <Plus className="mr-2 h-4 w-4" /> New Chat
            </button>
            <div className="space-y-1">
              {mockHistory.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => loadMockChat(chat.id)}
                  className={`p-2 rounded-lg cursor-pointer ${
                    activeChatId === chat.id
                      ? "bg-emerald-100"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <p className="font-semibold text-sm text-slate-800 truncate">
                    {chat.title}
                  </p>
                  <p className="text-xs text-slate-500">{chat.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-full">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3.5 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bot className="h-5 w-5 text-slate-500" />
              </div>
            )}
            <div
              className={`max-w-lg animate-[fadeInUp_0.3s_ease-in-out] ${
                msg.sender === "user"
                  ? "bg-emerald-600 text-white p-3.5 rounded-xl rounded-br-lg shadow-md"
                  : "bg-slate-100 text-slate-800 p-3.5 rounded-xl rounded-bl-lg shadow-sm"
              }`}
            >
              <p className="leading-relaxed">{msg.content}</p>
              {msg.sender === "bot" && msg.links && msg.links.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                  <p className="text-xs font-bold text-slate-500">
                    Helpful Links:
                  </p>
                  {msg.links.map((link, index) => (
                    <a
                      href={link}
                      key={index}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      <span className="truncate">{link}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
            {msg.sender === "user" && (
              <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {isBotTyping && (
          <div className="flex items-start gap-3.5 justify-start">
            <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot className="h-5 w-5 text-slate-500" />
            </div>
            <div className="bg-slate-100 p-4 rounded-xl rounded-bl-lg flex items-center space-x-1.5 shadow-sm">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200 flex-shrink-0">
        {renderInputArea()}
      </div>
    </div>
  );
};

export default ChatbotLayout;
