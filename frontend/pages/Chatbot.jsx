// src/components/ChatBot.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { addMessage, getAllMessages } from '../db';  // your Dexie helpers

function ChatBot() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // On mount: load saved messages (or create greeting)
  useEffect(() => {
    (async () => {
      const stored = await getAllMessages(); 
      if (stored.length) {
        setMessages(
          stored.map(({ role, text }) => ({ role, text }))
        );
      } else {
        const greeting = {
          role: 'bot',
          text: 'Hello! I can help you query your users database. Ask me anything!',
        };
        setMessages([greeting]);
        await addMessage(greeting);
      }
    })();
  }, []);

  // Auto-scroll whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleResponse = async () => {
    if (!prompt.trim() || loading) return;

    // 1) Add user message
    const userMsg = { role: 'user', text: prompt };
    setMessages(prev => [...prev, userMsg]);
    await addMessage(userMsg);

    setLoading(true);
    setPrompt('');

    try {
      // 2) Send to backend
      const { data } = await axios.post(
        'http://127.0.0.1:5000/api/chat',
        { question: prompt },
        { timeout: 15000 }
      );

      // 3) Add bot reply
      const botMsg = {
        role: 'bot',
        text: data.answer || "I didn't understand that. Could you rephrase?",
      };
      setMessages(prev => [...prev, botMsg]);
      await addMessage(botMsg);

    } catch (error) {
      console.error('API Error:', error);

      let errorText = 'Error processing your request. Please try again.';
      if (error.code === 'ECONNABORTED') {
        errorText = 'Request timed out. Please try again.';
      } else if (error.response?.data?.answer) {
        errorText = error.response.data.answer;
      } else if (error.request) {
        errorText = 'Unable to connect to the server. Please check your connection.';
      }

      const errMsg = { role: 'bot', text: errorText };
      setMessages(prev => [...prev, errMsg]);
      await addMessage(errMsg);

    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleResponse();
    }
  };

  return (
    <div className="max-w-[960px] mx-auto border border-blue-500 mt-20 rounded-lg p-4">
      <h1 className="text-center text-3xl text-blue-500 font-semibold mb-10">
        Database Chat Assistant – built using Gemini API
      </h1>

      <div className="space-y-4 min-h-[400px] max-h-[400px] overflow-y-auto mb-4 flex flex-col">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl w-fit max-w-xl ${
              msg.role === 'user'
                ? 'bg-blue-600 self-end ml-auto'
                : 'bg-[#26008f] self-start'
            }`}
          >
            <p className="text-gray-200 whitespace-pre-wrap">{msg.text}</p>
          </div>
        ))}

        {loading && (
          <div className="bg-gray-100 p-3 rounded-xl w-fit max-w-full self-start">
            <p className="text-gray-500">Thinking...</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex text-white items-center space-x-2">
        <input
          type="text"
          placeholder="Ask about users..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          onClick={handleResponse}
          disabled={loading || !prompt.trim()}
          className="bg-blue-600 hover:bg-blue-700 font-semibold px-4 py-2 rounded-xl disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBot;
