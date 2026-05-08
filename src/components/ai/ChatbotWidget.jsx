import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Trash2, Bot, User } from 'lucide-react';
import { useChat } from '../../hooks/useChat';

export function ChatbotWidget({ issData, newsData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, loading, sendMessage, clearChat } = useChat(issData, newsData);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:scale-110 transition-all duration-300 z-50 group ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageSquare size={24} className="group-hover:animate-pulse" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[550px] max-h-[85vh] bg-white/95 dark:bg-space-900/95 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-white/10 overflow-hidden transform transition-all duration-300 scale-100 origin-bottom-right">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center space-x-2">
              <Bot size={22} className="animate-pulse" />
              <h3 className="font-bold tracking-wide">Astro AI</h3>
            </div>
            <div className="flex space-x-1">
              <button onClick={clearChat} title="Clear Chat" className="p-1.5 hover:bg-white/20 rounded-md transition-colors">
                <Trash2 size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} title="Close" className="p-1.5 hover:bg-white/20 rounded-md transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50 dark:bg-space-900/50 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2 mt-1 flex-shrink-0"><Bot size={14} className="text-blue-600 dark:text-blue-400" /></div>}
                <div className={`max-w-[75%] p-3 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' 
                    : 'bg-white dark:bg-space-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-white/5 rounded-2xl rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start items-center">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2"><Bot size={14} className="text-blue-600 dark:text-blue-400" /></div>
                <div className="bg-white dark:bg-space-800 border border-gray-100 dark:border-white/5 p-4 rounded-2xl rounded-tl-sm shadow-sm flex space-x-1.5">
                  <div className="w-2 h-2 bg-blue-400 dark:bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 dark:bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 dark:bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-space-800 border-t border-gray-200 dark:border-white/10 flex items-center space-x-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Astro AI..."
              className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-space-900 border border-transparent focus:border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-sm text-gray-900 dark:text-white outline-none transition-all placeholder-gray-400"
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm"
            >
              <Send size={18} className={input.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
