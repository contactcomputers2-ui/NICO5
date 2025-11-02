import React, { useState, useEffect, useRef } from 'react';
import { Contact, Message, ApiSettings } from '../types';
import { suggestReply } from '../services/geminiService';
import SendIcon from './icons/SendIcon';
import SparklesIcon from './icons/SparklesIcon';

interface ChatPageProps {
  contacts: Contact[];
  messages: { [contactId: string]: Message[] };
  addMessage: (contactId: string, message: Omit<Message, 'id'>) => void;
  initialContactId: string | null;
  onChatOpened: () => void;
  settings: ApiSettings;
  geminiApiKey: string; // Add geminiApiKey prop
}

const ChatPage: React.FC<ChatPageProps> = ({ contacts, messages, addMessage, initialContactId, onChatOpened, settings, geminiApiKey }) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialContactId) {
      const contact = contacts.find(c => c.id === initialContactId);
      if (contact) {
        setSelectedContact(contact);
        onChatOpened();
      }
    } else if (!selectedContact && contacts.length > 0) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts, initialContactId, onChatOpened, selectedContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedContact]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedContact) {
      addMessage(selectedContact.id, {
        text: newMessage,
        sender: 'me',
        timestamp: new Date().toISOString(),
      });
      setNewMessage('');
    }
  };

  const handleSuggestReply = async () => {
    if (!selectedContact || !messages[selectedContact.id]) return;
    setIsSuggesting(true);
    const conversation = messages[selectedContact.id];
    const suggestion = await suggestReply(conversation); // This currently doesn't use the API key
    setNewMessage(suggestion);
    setIsSuggesting(false);
  };
  
  const currentMessages = selectedContact ? messages[selectedContact.id] || [] : [];

  return (
    <div className="flex h-[calc(100vh-128px)] bg-white rounded-lg shadow-md border border-gray-200">
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <input type="text" placeholder="Search contacts..." className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
        <ul className="overflow-y-auto flex-1">
          {contacts.map(contact => (
            <li key={contact.id}>
              <button
                onClick={() => setSelectedContact(contact)}
                className={`w-full text-left p-4 flex items-center space-x-3 transition-colors ${selectedContact?.id === contact.id ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
              >
                <img className="w-10 h-10 rounded-full" src={contact.avatar} alt={contact.name} />
                <div>
                  <p className="font-semibold text-gray-800">{contact.name}</p>
                  <p className="text-sm text-gray-500 truncate max-w-[150px]">
                    {messages[contact.id]?.[messages[contact.id].length - 1]?.text || 'No messages yet'}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-2/3 flex flex-col">
        {selectedContact ? (
          <>
            <div className="p-4 border-b border-gray-200 flex items-center space-x-3 bg-gray-50">
              <img className="w-10 h-10 rounded-full" src={selectedContact.avatar} alt={selectedContact.name} />
              <div>
                <p className="font-bold text-gray-900">{selectedContact.name}</p>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto bg-gray-100 space-y-4">
              {currentMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md rounded-lg py-2 px-4 shadow ${msg.sender === 'me' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleSuggestReply}
                  disabled={isSuggesting || currentMessages.length === 0}
                  className="p-2 text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed rounded-full hover:bg-gray-100 transition-colors"
                  title="Suggest Reply with AI"
                >
                  <SparklesIcon className="w-6 h-6" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder={isSuggesting ? "Generating suggestion..." : "Type a message..."}
                  className="flex-1 bg-gray-100 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <SendIcon className="w-6 h-6" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a contact to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;