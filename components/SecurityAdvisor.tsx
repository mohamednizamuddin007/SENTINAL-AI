import React, { useState, useRef, useEffect } from 'react';
import { askSecurityAdvisor } from '../services/geminiService';
import { Bot, Send, User, Sparkles, Zap } from 'lucide-react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: number;
}

const SecurityAdvisor: React.FC = () => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            text: "Hello. I am the SentinelAI Security Advisor, powered by Google Gemini. \n\nI can help you analyze threats, suggest remediation steps for leaked keys, or provide general cybersecurity best practices. How can I assist you today?",
            sender: 'ai',
            timestamp: Date.now()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!query.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: query,
            sender: 'user',
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setQuery('');
        setIsLoading(true);

        try {
            const response = await askSecurityAdvisor(userMsg.text);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response,
                sender: 'ai',
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSuggestion = (text: string) => {
        setQuery(text);
        textareaRef.current?.focus();
    };

    // Helper to strip markdown formatting if the model returns it despite instructions
    const cleanText = (text: string) => {
        return text
            .replace(/\*\*/g, '')      // Remove bold markers
            .replace(/\*/g, '')        // Remove italic markers
            .replace(/^#+\s/gm, '')    // Remove headers at start of lines
            .replace(/`/g, '')         // Remove code ticks
            .replace(/__/g, '');       // Remove underline markers
    };

    return (
        <div className="flex flex-col h-[650px] max-w-6xl mx-auto">
             <div className="mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                            <Bot className="text-emerald-500" size={32} />
                            AI Security Consultant
                        </h1>
                        <p className="text-slate-400 mt-2">
                            Get real-time expert advice on remediation, best practices, and threat intelligence.
                        </p>
                    </div>
                    <div className="hidden md:flex flex-col items-end">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                             <Sparkles size={14} className="text-blue-400" />
                             <span className="text-xs font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Powered by Google Gemini</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                            <Zap size={12} className="text-amber-400" />
                            <span>Fast Inference Mode</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl relative">
                
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                msg.sender === 'ai' ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-purple-500/20' : 'bg-slate-700'
                            }`}>
                                {msg.sender === 'ai' ? <Bot size={20} className="text-white" /> : <User size={20} />}
                            </div>
                            
                            <div className={`max-w-[80%] rounded-2xl p-4 shadow-md ${
                                msg.sender === 'ai' 
                                    ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700' 
                                    : 'bg-emerald-600 text-white rounded-tr-none'
                            }`}>
                                <div className="prose prose-invert prose-sm leading-relaxed whitespace-pre-wrap font-sans">
                                    {cleanText(msg.text)}
                                </div>
                                {msg.sender === 'ai' && (
                                    <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center gap-2">
                                        <Sparkles size={10} className="text-blue-400" />
                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Gemini 3 Flash</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-4">
                             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0 animate-pulse">
                                <Bot size={20} className="text-white" />
                            </div>
                            <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-2 border border-slate-700">
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-75"></span>
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></span>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef}></div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-slate-950 border-t border-slate-800">
                    <div className="relative flex gap-2">
                        <textarea
                            ref={textareaRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask Gemini about security best practices..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none h-[60px]"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={isLoading || !query.trim()}
                            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                        <button 
                            onClick={() => handleSuggestion("What should I do if I clicked a phishing link?")} 
                            className="text-xs bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 px-3 py-1.5 rounded-full whitespace-nowrap border border-slate-700 transition-all flex items-center gap-1 group"
                        >
                            <Sparkles size={10} className="text-blue-500 group-hover:text-blue-400"/> Phishing Help
                        </button>
                        <button 
                            onClick={() => handleSuggestion("How do I rotate an exposed AWS API Key?")} 
                            className="text-xs bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 px-3 py-1.5 rounded-full whitespace-nowrap border border-slate-700 transition-all flex items-center gap-1 group"
                        >
                            <Sparkles size={10} className="text-blue-500 group-hover:text-blue-400"/> Exposed Key
                        </button>
                        <button 
                            onClick={() => handleSuggestion("Explain the difference between SPF, DKIM, and DMARC")} 
                            className="text-xs bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 px-3 py-1.5 rounded-full whitespace-nowrap border border-slate-700 transition-all flex items-center gap-1 group"
                        >
                             <Sparkles size={10} className="text-blue-500 group-hover:text-blue-400"/> Email Security
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityAdvisor;