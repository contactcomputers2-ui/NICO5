import React, { useState, useEffect, useRef } from 'react';
import { ConBotMessage } from '../types';
import { chatWithConBot } from '../services/geminiService';
import SendIcon from './icons/SendIcon';
import CloseIcon from './icons/CloseIcon';
import BotIcon from './icons/BotIcon';

interface ConBotChatProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ConBotMessage[];
  addMessage: (message: ConBotMessage) => void;
  onNavigate: (viewName: string) => boolean; // Callback to trigger navigation in App.tsx
  geminiApiKey: string;
}

const ConBotChat: React.FC<ConBotChatProps> = ({ isOpen, onClose, messages, addMessage, onNavigate, geminiApiKey }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstInteraction = useRef(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && isFirstInteraction.current && messages.length === 0) {
      isFirstInteraction.current = false;
      addMessage({
        id: String(Date.now()),
        sender: 'bot',
        text: "Hi there! I'm ConBot, your in-app assistant. How can I help you today?",
        timestamp: new Date().toISOString(),
      });
    }
  }, [isOpen, messages.length, addMessage]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const userMessage: ConBotMessage = {
      id: String(Date.now()),
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    addMessage(userMessage);
    setNewMessage('');
    setIsTyping(true);

    try {
      const historyForApi = messages.map(msg => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender,
        timestamp: msg.timestamp,
      }));
      // Add the current user message to history for the API call context
      historyForApi.push(userMessage);

      const botResponseText = await chatWithConBot(geminiApiKey, historyForApi, userMessage.text);

      const botMessage: ConBotMessage = {
        id: String(Date.now() + 1), // Ensure unique ID
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      addMessage(botMessage);

      // Check for navigation intent in bot's response
      const navigationMatches = botResponseText.match(/navigate to the ([\w\s]+) page/i) ||
                                botResponseText.match(/go to the ([\w\s]+) page/i) ||
                                botResponseText.match(/take you to the ([\w\s]+) page/i);

      if (navigationMatches && navigationMatches[1]) {
        const suggestedPage = navigationMatches[1].trim();
        const userConfirmation = await new Promise(resolve => {
            setTimeout(() => { // Small delay to allow message to render
                const confirmation = window.confirm(`ConBot suggested: "${botResponseText}"\n\nWould you like to go to the ${suggestedPage} page?`);
                resolve(confirmation);
            }, 100);
        });

        if (userConfirmation) {
          onNavigate(suggestedPage);
        }
      }

    } catch (error: any) {
      console.error("ConBot chat error:", error);
      addMessage({
        id: String(Date.now() + 1),
        text: "Oops! Something went wrong while processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 md:right-4 md:bottom-20 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50 animate-slideUp">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <BotIcon className="w-6 h-6" />
          <h2 className="text-lg font-bold">ConBot</h2>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-blue-700 transition-colors" aria-label="Close ConBot Chat">
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, index) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg py-2 px-3 shadow-sm text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg py-2 px-3 shadow-sm text-sm bg-gray-200 text-gray-800 animate-pulse">
              ConBot is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white flex items-center space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-100 border border-gray-300 rounded-full py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={isTyping}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          disabled={isTyping || newMessage.trim() === ''}
          aria-label="Send message"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ConBotChat;