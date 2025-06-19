import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Send, Mic, Paperclip, Bot, User, ChevronRight, Square, Trash2, File as FileIcon, X, History, Plus } from 'lucide-react';
import { mockHistory } from '../../data/mockHistory';

// --- Types and Mock Data ---
interface Plan { name: string; description: string; link: string; }
interface Message { id: number; sender: 'user' | 'bot'; type: 'text' | 'plans' | 'follow-up' | 'file' | 'audio'; content: any; fileName?: string; }

const getInitialMessages = (userName: string): Message[] => [
  { id: 1, sender: 'bot', type: 'text', content: `Hello ${userName}! I'm your HealthHalo AI Assistant. How can I help you today?` },
  { id: 2, sender: 'bot', type: 'follow-up', content: ["Suggest insurance plans", "Give me a health tip"] },
];

// This is the intelligent mock AI response logic
const getMockAIResponse = (userMessage: string): Message => {
  const msgLower = userMessage.toLowerCase();
  if (msgLower.includes('insurance') || msgLower.includes('plans')) {
    return { id: Date.now(), sender: 'bot', type: 'plans', content: { intro: "Based on your profile, here are some plans I recommend:", plans: [{ name: 'Axa Mansard', description: 'Comprehensive coverage for families.', link: '#' }, { name: 'Reliance HMO', description: 'Affordable plans with telemedicine.', link: '#' }] } };
  }
  if (msgLower.includes('health') || msgLower.includes('tip')) {
    return { id: Date.now(), sender: 'bot', type: 'text', content: "Of course! A great health tip is to drink a glass of water first thing every morning to rehydrate your body and kickstart your metabolism." };
  }
  return { id: Date.now(), sender: 'bot', type: 'text', content: "That's an interesting question. While I'm still learning, I can help with insurance plans or health tips. What would you like to explore?" };
};

// --- The Main Chatbot Component ---
const ChatbotLayout = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  type InputMode = 'text' | 'recording' | 'filePreview' | 'audioPreview';
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => { startNewChat(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isBotTyping]);
  
  const startNewChat = () => { /* ... This function is correct ... */ };
  const loadMockChat = (chatId: number) => { /* ... This function is correct ... */ };

  // --- RESTORED AND FULLY FUNCTIONAL HANDLERS ---

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

  const handleStartRecording = async () => { /* ... This function is correct ... */ };
  const handleStopRecording = () => { /* ... This function is correct ... */ };
  
  const renderInputArea = () => {
    switch (inputMode) {
      case 'filePreview': return ( <div className="flex items-center justify-between p-3 bg-slate-100 rounded-full border-2 border-emerald-300"> <div className="flex items-center gap-2"> <FileIcon className="h-5 w-5 text-slate-500" /> <span className="text-sm text-slate-700 truncate">{attachedFile?.name}</span> </div> <div className="flex items-center gap-2"> <button onClick={() => handleSendMessage(`Attached file: ${attachedFile?.name}`, 'file', attachedFile?.name)} className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700"><Send className="h-5 w-5" /></button> <button onClick={resetInput} className="p-3 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300"><X className="h-5 w-5" /></button> </div> </div> );
      case 'recording': return ( <div className="flex items-center justify-between p-3 bg-red-100 rounded-full border-2 border-red-300"> <div className="flex items-center gap-3"> <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div> <span className="text-sm font-mono text-red-700">Recording... {new Date(recordingTime * 1000).toISOString().substr(14, 5)}</span> </div> <button onClick={handleStopRecording} className="p-3 bg-red-500 text-white rounded-full shadow-lg"><Square className="h-5 w-5" /></button> </div> );
      case 'audioPreview': return ( <div className="flex items-center justify-between p-3 bg-slate-100 rounded-full border-2 border-emerald-300"> <audio src={audioBlob ? URL.createObjectURL(audioBlob) : ''} controls className="h-10"></audio> <div className="flex items-center gap-2"> <button onClick={() => handleSendMessage('Sent an audio recording', 'audio')} className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700"><Send className="h-5 w-5" /></button> <button onClick={resetInput} className="p-3 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300"><Trash2 className="h-5 w-5" /></button> </div> </div> );
      case 'text':
      default:
        return (
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} className="relative">
            <div className="flex items-center w-full p-2 rounded-full border-2 bg-white transition-all duration-300 border-slate-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20">
              <div className="flex items-center pl-2 pr-2 space-x-2 text-slate-500">
                <button type="button" onClick={handleStartRecording} className="p-1 rounded-full hover:bg-slate-100 transition-colors" title="Record Audio"><Mic className="h-5 w-5" /></button>
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1 rounded-full hover:bg-slate-100 transition-colors" title="Attach File"><Paperclip className="h-5 w-5" /></button>
              </div>
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ask me anything..." className="flex-1 w-full h-10 bg-transparent text-base placeholder-slate-500 focus:outline-none"/>
              <button type="submit" className="p-3 bg-slate-200 text-slate-500 rounded-full hover:bg-emerald-600 hover:text-white transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed" disabled={!inputValue || isBotTyping}><Send className="h-5 w-5" /></button>
            </div>
          </form>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden animate-fadeInUp">
      {/* Header and History Dropdown (Correct) */}
      <div className="relative p-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
        {/* ... */}
      </div>

      {/* Message Display Area */}
      <div className="flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-thumb-rounded-full">
        {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"><Bot className="h-5 w-5 text-slate-500" /></div>}
                <div className={`max-w-lg animate-[fadeInUp_0.3s_ease-in-out] ${msg.sender === 'user' ? 'bg-emerald-600 text-white p-3.5 rounded-xl rounded-br-lg shadow-md' : 'bg-slate-100 text-slate-800 p-3.5 rounded-xl rounded-bl-lg shadow-sm'}`}>
                    {msg.type === 'text' && <p className="leading-relaxed">{msg.content}</p>}
                    {/* ... other message types */}
                    {msg.type === 'follow-up' && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {/* The onClick here now works because handleSendMessage is fixed */}
                            {msg.content.map((question: string, index: number) => (
                                <button key={index} onClick={() => handleSendMessage(question)} className="bg-emerald-50/80 text-emerald-700 text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-200/80">
                                    {question}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                {msg.sender === 'user' && <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"><User className="h-5 w-5 text-white" /></div>}
            </div>
        ))}
        {isBotTyping && (  <div className="flex items-start gap-3.5 justify-start">{/* ... typing indicator ... */}</div> )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200 flex-shrink-0">
        {renderInputArea()}
      </div>
    </div>
  );
};

export default ChatbotLayout;