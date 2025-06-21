// src/components/ChatBot.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { addMessage, getAllMessages, clearMessages } from '../db.js';
import { SendHorizonal, Lightbulb, ShieldAlert } from 'lucide-react';

function ChatBot() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Refs for scrolling
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // On mount: load saved messages
  useEffect(() => {
    const loadMessages = async () => {
      const stored = await getAllMessages();
      setMessages(stored);
      
      if (stored.length === 0) {
        const greeting = {
          role: 'bot',
          text: 'Hello! I can help you analyze security logs and protect your systems. Ask me anything!',
          suggestions: [
            "Show recent critical security alerts",
            "Analyze failed login patterns",
            "Check for SQL injection attempts"
          ]
        };
        setMessages([greeting]);
        await addMessage(greeting);
      }
    };
    
    loadMessages();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages, loading, thinkingSteps]);

  // Simulate thinking process with security analysis steps
  const simulateThinking = (promptText) => {
    const steps = [];
    
    if (promptText.toLowerCase().includes('log')) {
      steps.push("Parsing security logs...");
      steps.push("Identifying threat patterns...");
      steps.push("Cross-referencing with CVE database...");
    } 
    else if (promptText.toLowerCase().includes('vulnerability')) {
      steps.push("Scanning installed packages...");
      steps.push("Checking for known vulnerabilities...");
      steps.push("Prioritizing based on severity...");
    }
    else {
      steps.push("Analyzing your query...");
      steps.push("Consulting security knowledge base...");
      steps.push("Generating protection strategies...");
    }
    
    return steps;
  };

  // Send prompt to API
  const handleResponse = async (input = null) => {
    const userInput = input || prompt;
    if (!userInput.trim() || loading) return;

    // Add user message
    const userMsg = { role: 'user', text: userInput };
    setMessages(prev => [...prev, userMsg]);
    await addMessage(userMsg);

    setLoading(true);
    if (!input) setPrompt('');
    
    // Simulate thinking process
    const steps = simulateThinking(userInput);
    setThinkingSteps(steps);
    
    try {
      // Send to backend with Gemini integration
      const { data } = await axios.post(
        'http://127.0.0.1:5000/api/chat',
        { 
          question: userInput,
          context: messages.slice(-3).map(m => m.text).join('\n')
        },
        { timeout: 30000 }
      );

      // Add bot response with suggestions
      const botMsg = { 
        role: 'bot', 
        text: data.answer || "I need more information to analyze this properly.",
        suggestions: data.suggestions || [
          "Can you provide more log details?",
          "Would you like me to check recent vulnerabilities?",
          "Should I analyze attack patterns?"
        ],
        isAdvice: data.isAdvice || false
      };
      
      setMessages(prev => [...prev, botMsg]);
      await addMessage(botMsg);
      setShowSuggestions(true);

    } catch (error) {
      console.error('API Error:', error);
      
      let errorText = 'Error processing your request. Please try again.';
      if (error.code === 'ECONNABORTED') errorText = 'Request timed out. Please try again.';
      else if (error.response?.data?.answer) errorText = error.response.data.answer;
      else if (error.request) errorText = 'Unable to connect to security service.';

      const errMsg = { 
        role: 'bot', 
        text: errorText,
        isCritical: true
      };
      
      setMessages(prev => [...prev, errMsg]);
      await addMessage(errMsg);

    } finally {
      setLoading(false);
      setThinkingSteps([]);
    }
  };

  // Handle suggestion click - now triggers immediate response
  const handleSuggestionClick = (suggestion) => {
    // Immediately process the suggestion without updating the input field
    handleResponse(suggestion);
  };

  // Enter key handler
  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleResponse();
    }
  };

  // Clear chat history
  const handleClear = async () => {
    await clearMessages();
    const greeting = {
      role: 'bot',
      text: 'Hello! I can help you analyze security logs and protect your systems. Ask me anything!',
      suggestions: [
        "Show recent critical alerts",
        "Analyze failed login patterns",
        "Check for SQL injection attempts"
      ]
    };
    setMessages([greeting]);
    await addMessage(greeting);
    setShowSuggestions(true);
  };

  // Toggle suggestions visibility
  const toggleSuggestions = () => setShowSuggestions(!showSuggestions);

  return (
    <div className="max-w-[960px] mx-auto border border-blue-500 mt-10 rounded-lg p-4 bg-gray-900">
      <h1 className="text-center text-3xl text-blue-400 font-bold mb-6">
        <ShieldAlert className="inline mr-2" size={28} />
        Security Analyst Assistant
        <span className="block text-sm text-blue-300 mt-1 font-normal">Powered by Gemini AI</span>
      </h1>

      <div
        ref={containerRef}
        className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto mb-4 flex flex-col p-2 bg-gray-800 rounded-lg"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl w-fit max-w-[80%] relative ${
              msg.role === 'user' 
                ? 'bg-blue-600 self-end' 
                : msg.isCritical
                  ? 'bg-red-700 self-start border border-red-400'
                  : 'bg-[#26008f] self-start'
            }`}
          >
            <p className="text-gray-200 whitespace-pre-wrap">{msg.text}</p>
            
            {msg.suggestions && showSuggestions && (
              <div className="mt-3 pt-2 border-t border-gray-400 border-dashed">
                <p className="text-gray-300 text-sm flex items-center mb-1">
                  <Lightbulb size={14} className="mr-1" /> Suggestions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {msg.suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-transform hover:scale-105"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Enhanced thinking animation */}
        {loading && (
          <div className="bg-gray-700 p-3 rounded-xl w-fit max-w-[80%] self-start">
            <div className="flex items-center">
              {/* Animated typing dots */}
              <div className="flex space-x-1 mr-3">
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              
              <span className="text-blue-300">Analyzing security data...</span>
            </div>
            
            {thinkingSteps.length > 0 && (
              <div className="mt-3 pt-2 border-t border-gray-600">
                <ul className="space-y-2">
                  {thinkingSteps.map((step, i) => (
                    <li key={i} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 flex items-center justify-center mr-2 mt-0.5">
                        <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse"></div>
                      </div>
                      <span className="text-gray-400 text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion toggle */}
      <div className="flex justify-center mb-3">
        <button 
          onClick={toggleSuggestions}
          className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-full flex items-center"
        >
          <Lightbulb size={12} className="mr-1" />
          {showSuggestions ? 'Hide Suggestions' : 'Show Suggestions'}
        </button>
      </div>

      {/* Input area */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="Ask about security logs, vulnerabilities, or threats..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-3 rounded-xl border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          onClick={() => handleResponse()}
          disabled={loading || !prompt.trim()}
          className="bg-blue-600 hover:bg-blue-700 font-semibold px-4 py-3 rounded-xl disabled:opacity-50 flex items-center"
        >
          <SendHorizonal size={20} />
        </button>
      </div>

      <div className="flex justify-between">
        <p className="text-gray-500 text-sm">
          Ask about: <span className="text-blue-400">logs</span> • <span className="text-blue-400">threats</span> • <span className="text-blue-400">vulnerabilities</span>
        </p>
        <button
          onClick={handleClear}
          className="text-sm bg-red-700 hover:bg-red-800 p-2 text-white rounded-xl transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Clear History
        </button>
      </div>
    </div>
  );
}

export default ChatBot;