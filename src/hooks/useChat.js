import { useState, useEffect, useCallback } from 'react';
import { askMistral } from '../services/hf';

const CHAT_CACHE_KEY = 'dashboard_chat_history';

export function useChat(issData, newsData) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(CHAT_CACHE_KEY);
    return saved ? JSON.parse(saved) : [{ role: 'assistant', text: 'Hello! I am your dashboard assistant. Ask me about the ISS, astronauts, or latest space news.' }];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(CHAT_CACHE_KEY, JSON.stringify(messages));
  }, [messages]);

  const clearChat = () => {
    setMessages([{ role: 'assistant', text: 'Chat cleared. How can I help you?' }]);
  };

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim()) return;

    const newMessages = [...messages, { role: 'user', text: userText }];
    if (newMessages.length > 30) newMessages.splice(1, newMessages.length - 30);
    setMessages(newMessages);
    setLoading(true);

    const { currentPos, currentSpeed, nearestPlace } = issData || {};
    const { astronauts } = issData || { astronauts: [] };
    const { articles } = newsData || { articles: [] };

    let contextString = `[DASHBOARD CONTEXT]
ISS Location: ${currentPos ? `${currentPos.lat.toFixed(4)}, ${currentPos.lng.toFixed(4)}` : 'Unknown'}
ISS Nearest Place: ${nearestPlace || 'Unknown'}
ISS Speed: ${currentSpeed ? Math.round(currentSpeed) + ' km/h' : 'Unknown'}
Astronauts in space: ${astronauts ? astronauts.length : 0}
Total News Articles available: ${articles ? articles.length : 0}
`;

    if (articles && articles.length > 0) {
      contextString += `\nLatest News Headlines:\n`;
      articles.slice(0, 3).forEach((a, i) => {
        contextString += `${i+1}. ${a.title} (Source: ${a.news_site})\n`;
      });
    }

    const systemPrompt = `You are the dashboard assistant. Your ONLY knowledge is the following context:
${contextString}

You MUST answer the user's question using ONLY the context provided above.
Do NOT guess, do NOT hallucinate, and do NOT use outside knowledge. 
If the answer is not in the context, you MUST reply EXACTLY: "I can only answer questions based on the current dashboard data."`;

    try {
      const apiKey = import.meta.env.VITE_HF_API_KEY;
      const response = await askMistral(systemPrompt, userText, apiKey);
      
      setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: `Error: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  }, [messages, issData, newsData]);

  return { messages, loading, sendMessage, clearChat };
}
