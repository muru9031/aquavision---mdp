// src/components/MLChatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, Loader2 } from 'lucide-react';
import { askChatbot } from '../api';

export default function MLChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "👋 Hello! I am **AquaVision ML Assistant** powered by our XGBoost & LSTM models. Ask me about **aquifer depletion reasons**, **Zone A risk**, or **6-month water forecast**!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userQuery }]);
    setLoading(true);

    try {
      const res = await askChatbot(userQuery);
      setMessages(prev => [...prev, { sender: 'ai', text: res.answer }]);
    } catch (err) {
      setMessages(prev => [
        ...prev, 
        { sender: 'ai', text: "⚠️ Could not connect to Spring Boot intelligence service. Please check if backend is running on :8080." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClick = (promptText) => {
    setInput(promptText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white px-5 py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 group border-2 border-white/50"
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="font-semibold text-sm tracking-wide">AquaVision AI Assistant</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[540px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-sky-950 p-4 text-white flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-teal-300">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5 text-white">
                  AquaVision Assistant
                  <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                </h3>
                <p className="text-[11px] text-teal-300/80 font-medium">Hybrid LSTM-XGBoost + SHAP</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60 text-xs">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 border border-sky-200">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-sky-500 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200/80 rounded-bl-none shadow-sm'
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }}
                />
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
                <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                <span>Consulting ML Model & SHAP weights...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => handlePromptClick("Why is Zone A critical?")}
              className="whitespace-nowrap bg-slate-100 hover:bg-sky-50 hover:text-sky-600 px-2.5 py-1 rounded-full text-slate-600 border border-slate-200 transition"
            >
              Why is Zone A critical?
            </button>
            <button
              onClick={() => handlePromptClick("What is the 6-month forecast?")}
              className="whitespace-nowrap bg-slate-100 hover:bg-sky-50 hover:text-sky-600 px-2.5 py-1 rounded-full text-slate-600 border border-slate-200 transition"
            >
              6-Month forecast?
            </button>
            <button
              onClick={() => handlePromptClick("Why is water depleting?")}
              className="whitespace-nowrap bg-slate-100 hover:bg-sky-50 hover:text-sky-600 px-2.5 py-1 rounded-full text-slate-600 border border-slate-200 transition"
            >
              SHAP causes?
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask ML about water levels & causes..."
              className="flex-1 bg-slate-100 border-none rounded-xl px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-sky-400 transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white p-2.5 rounded-xl transition shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}

