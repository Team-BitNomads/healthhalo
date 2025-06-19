import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Send, Mic, Paperclip, Bot, User, ChevronRight, Square, Trash2, File as FileIcon, X } from 'lucide-react';

interface Plan {
  name: string;
  logo?: string;
  description: string;
  link: string;
}

interface Message {
  id: number;
  sender: 'user' | 'bot';
  type: 'text' | 'plans' | 'follow-up' | 'file' | 'audio';
  content: any;
  fileName?: string;
}

const getInitialMessages = (userName: string): Message[] => [
  { id: 1, sender: 'bot', type: 'text', content: `Hello ${userName}! I'm your HealthHalo AI Assistant. How can I help you today?` },
  { id: 2, sender: 'bot', type: 'follow-up', content: ["Suggest insurance plans", "Give me a health tip"] },
];

const getMockAIResponse = (userMessage: string): Message => {
  if (userMessage.toLowerCase().includes('insurance')) {
    return { id: Date.now(), sender: 'bot', type: 'plans', content: { intro: "Based on your profile, here are some plans I recommend:", plans: [{ name: 'Axa Mansard', description: 'Comprehensive coverage for families.', link: '#' }, { name: 'Reliance HMO', description: 'Affordable plans with telemedicine.', link: '#' }] } };
  }
  return { id: Date.now(), sender: 'bot', type: 'text', content: "Thank you for the information. I've noted it down. Is there anything else I can help with?" };
};

const ChatbotLayout = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  type InputMode = 'text' | 'recording' | 'filePreview' | 'audioPreview';
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const userName = savedProfile ? JSON.parse(savedProfile).fullName?.split(' ')[0] || 'there' : 'there';
    setMessages(getInitialMessages(userName));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping]);

  const resetInput = () => {
    setInputValue('');
    setAttachedFile(null);
    setAudioBlob(null);
    setInputMode('text');
  };

  const handleSendMessage = (text: string, type: Message['type'] = 'text', fileName?: string) => {
    if (!text.trim() && !attachedFile && !audioBlob) return;
    const userMessage: Message = { id: Date.now(), sender: 'user', type, content: text, fileName };
    setMessages(prev => [...prev, userMessage]);
    resetInput();
    setIsBotTyping(true);

    setTimeout(() => {
      const botResponse = getMockAIResponse(text);
      setMessages(prev => [...prev, botResponse]);
      setIsBotTyping(false);
    }, 1500);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
      setInputMode('filePreview');
    }
  };

  const handleStartRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        const audioChunks: Blob[] = [];
        mediaRecorderRef.current.ondataavailable = (event) => audioChunks.push(event.data);
        
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          setAudioBlob(audioBlob);
          setInputMode('audioPreview');
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        setInputMode('recording');
        timerIntervalRef.current = window.setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);

      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Microphone access was denied. Please allow microphone access in your browser settings.");
      }
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setRecordingTime(0);
    }
  };

  const renderInputArea = () => {
    switch (inputMode) {
      case 'filePreview':
        return (
          <div className="flex items-center justify-between p-3 bg-slate-100 rounded-full border-2 border-emerald-300">
            <div className="flex items-center gap-2">
              <FileIcon className="h-5 w-5 text-slate-500" />
              <span className="text-sm text-slate-700 truncate">{attachedFile?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleSendMessage(`Attached file: ${attachedFile?.name}`, 'file', attachedFile?.name)} className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700"><Send className="h-5 w-5" /></button>
              <button onClick={resetInput} className="p-3 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300"><X className="h-5 w-5" /></button>
            </div>
          </div>
        );
      case 'recording':
        return (
          <div className="flex items-center justify-between p-3 bg-red-100 rounded-full border-2 border-red-300">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-mono text-red-700">Recording... {new Date(recordingTime * 1000).toISOString().substr(14, 5)}</span>
            </div>
            <button onClick={handleStopRecording} className="p-3 bg-red-500 text-white rounded-full shadow-lg"><Square className="h-5 w-5" /></button>
          </div>
        );
      case 'audioPreview':
        return (
            <div className="flex items-center justify-between p-3 bg-slate-100 rounded-full border-2 border-emerald-300">
                <audio src={audioBlob ? URL.createObjectURL(audioBlob) : ''} controls className="h-10"></audio>
                <div className="flex items-center gap-2">
                    <button onClick={() => handleSendMessage('Sent an audio recording', 'audio')} className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700"><Send className="h-5 w-5" /></button>
                    <button onClick={resetInput} className="p-3 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300"><Trash2 className="h-5 w-5" /></button>
                </div>
            </div>
        );
      case 'text':
      default:
        return (
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} className="relative">
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ask me anything..." className="w-full pl-12 pr-28 py-4 text-base bg-slate-100 rounded-full border-2 border-transparent focus:border-emerald-300 focus:bg-white focus:outline-none transition-all" />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-3">
              <button type="button" onClick={handleStartRecording} className="text-slate-500 hover:text-emerald-600 transition-colors" title="Record Audio"><Mic className="h-5 w-5" /></button>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="text-slate-500 hover:text-emerald-600 transition-colors" title="Attach File"><Paperclip className="h-5 w-5" /></button>
            </div>
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-emerald-600 text-white rounded-full shadow-md hover:bg-emerald-700 transition-all disabled:bg-slate-300" disabled={!inputValue || isBotTyping}><Send className="h-5 w-5" /></button>
          </form>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden animate-[fadeIn_0.5s_ease-in-out]">
      <div className="p-4 border-b border-slate-200 flex items-center space-x-3 flex-shrink-0">
        <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-lg">
          <Bot className="h-7 w-7 text-white" />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <h2 className="font-bold text-lg text-slate-800">HealthHalo AI Assistant</h2>
          <p className="text-sm text-slate-500">Online & ready to help</p>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto space-y-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-full">
        {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"><Bot className="h-5 w-5 text-slate-500" /></div>}
                
                <div className={`max-w-lg animate-[fadeInUp_0.3s_ease-in-out] ${msg.sender === 'user' ? 'bg-emerald-600 text-white p-3.5 rounded-xl rounded-br-lg shadow-md' : 'bg-slate-100 text-slate-800 p-3.5 rounded-xl rounded-bl-lg shadow-sm'}`}>
                    {msg.type === 'text' && <p className="leading-relaxed">{msg.content}</p>}
                    {msg.type === 'file' && <div className="flex items-center gap-2"><FileIcon size={16} /> Attached: {msg.fileName}</div>}
                    {msg.type === 'audio' && <div className="flex items-center gap-2"><Mic size={16} /> Sent audio message</div>}
                    {msg.type === 'plans' && (
                        <div className="space-y-2">
                            <p className="font-medium mb-3">{msg.content.intro}</p>
                            {msg.content.plans.map((plan: Plan, index: number) => (
                                <Link to={plan.link} key={index} className="flex items-center p-3 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-emerald-300 hover:shadow-md transition-all group">
                                    <div className="w-10 h-10 bg-slate-200 rounded-md mr-3 flex-shrink-0"></div>
                                    <div className="flex-1"><p className="font-bold text-slate-800">{plan.name}</p><p className="text-xs text-slate-500">{plan.description}</p></div>
                                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                </Link>
                            ))}
                        </div>
                    )}
                    {msg.type === 'follow-up' && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {msg.content.map((question: string, index: number) => (
                                <button key={index} onClick={() => handleSendMessage(question)} className="bg-emerald-100/60 text-emerald-800 text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">{question}</button>
                            ))}
                        </div>
                    )}
                </div>
                {msg.sender === 'user' && <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"><User className="h-5 w-5 text-white" /></div>}
            </div>
        ))}
        {isBotTyping && (
             <div className="flex items-start gap-3.5 justify-start">
                <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"><Bot className="h-5 w-5 text-slate-500" /></div>
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