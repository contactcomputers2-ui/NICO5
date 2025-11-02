
import React from 'react';
import { Contact, Group, Message } from '../types';
import CloseIcon from './icons/CloseIcon';
import EditIcon from './icons/EditIcon';
import ChatIcon from './icons/ChatIcon';

interface ContactDetailPanelProps {
  contact: Contact;
  groups: Group[];
  messages: Message[];
  onClose: () => void;
  onEdit: (contact: Contact) => void;
  onGoToChat: (contactId: string) => void;
}

const ContactDetailPanel: React.FC<ContactDetailPanelProps> = ({ contact, groups, messages, onClose, onEdit, onGoToChat }) => {
  const customFields = contact.customFields ? Object.entries(contact.customFields).filter(([_, value]) => value) : [];
  
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity" onClick={onClose}></div>
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform translate-x-0 border-l border-gray-200">
        {/* Header */}
        <header className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Contact Details</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-200">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Contact Info */}
          <div className="flex flex-col items-center text-center">
            <img src={contact.avatar} alt={contact.name} className="w-24 h-24 rounded-full ring-4 ring-white shadow-lg" />
            <h3 className="mt-4 text-2xl font-bold text-gray-900">{contact.name}</h3>
            <p className="text-md text-gray-600">{contact.phone}</p>
            <p className="text-xs text-gray-500 mt-1">Last seen: {contact.lastSeen}</p>
          </div>
          
          {/* Custom Fields */}
          {customFields.length > 0 && (
            <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Custom Fields</h4>
                <div className="mt-2 bg-gray-50 p-3 rounded-md border border-gray-200 space-y-2">
                    {customFields.map(([key, value]) => (
                        <div key={key} className="grid grid-cols-3 gap-2 text-sm">
                            <span className="font-medium text-gray-600 col-span-1">{key}:</span>
                            <span className="text-gray-800 col-span-2">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Tags</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {contact.tags.length > 0 ? contact.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                  {tag}
                </span>
              )) : <p className="text-sm text-gray-500">No tags assigned.</p>}
            </div>
          </div>

          {/* Groups */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Groups</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {groups.length > 0 ? groups.map(group => (
                <span key={group.id} className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  {group.name}
                </span>
              )) : <p className="text-sm text-gray-500">Not a member of any group.</p>}
            </div>
          </div>
          
          {/* Message History */}
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Recent Messages</h4>
            <div className="mt-2 space-y-3 max-h-60 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200">
              {messages.length > 0 ? messages.slice(-5).map(msg => ( // Show last 5 messages
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs rounded-lg shadow-sm py-2 px-3 ${
                      msg.sender === 'me'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              )) : <p className="text-sm text-gray-500 text-center">No messages yet.</p>}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <footer className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end space-x-3">
          <button 
            onClick={() => onEdit(contact)}
            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 transition-colors"
          >
            <EditIcon className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button 
            onClick={() => onGoToChat(contact.id)}
            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <ChatIcon className="w-4 h-4 mr-2" />
            Send Message
          </button>
        </footer>
      </div>
    </>
  );
};

export default ContactDetailPanel;
