
import React, { useState, useMemo, useRef } from 'react';
import { CampaignTemplate, Contact, Campaign } from '../types';
import SendIcon from './icons/SendIcon';
import LinkIcon from './icons/LinkIcon';
import PaperclipIcon from './icons/PaperclipIcon';
import TrashIcon from './icons/TrashIcon';
import UploadIcon from './icons/UploadIcon';

interface BroadcastingPageProps {
  templates: CampaignTemplate[];
  contacts: Contact[];
  addCampaign: (campaign: Campaign) => void;
  isConnected: boolean;
}

const BroadcastingPage: React.FC<BroadcastingPageProps> = ({ templates, contacts, addCampaign, isConnected }) => {
  const [messageMode, setMessageMode] = useState<'template' | 'custom'>('template');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [customCampaignName, setCustomCampaignName] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('all');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showChatLinkCreator, setShowChatLinkCreator] = useState(false);
  const [chatLinkNumber, setChatLinkNumber] = useState('');
  const [chatLinkPreFilledText, setChatLinkPreFilledText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lastBroadcastResult, setLastBroadcastResult] = useState<{ sent: number, failed: number } | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    contacts.forEach(contact => {
      contact.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [contacts]);

  const selectedTemplate = useMemo(() => {
    return templates.find(t => t.id === selectedTemplateId);
  }, [templates, selectedTemplateId]);

  const targetContacts = useMemo(() => {
    if (targetAudience === 'all') {
      return contacts;
    }
    return contacts.filter(c => c.tags.includes(targetAudience));
  }, [contacts, targetAudience]);
  
  const isMessageReady = useMemo(() => {
    if (messageMode === 'template') {
        return !!selectedTemplateId;
    }
    return customCampaignName.trim() !== '' && customMessage.trim() !== '';
  }, [messageMode, selectedTemplateId, customCampaignName, customMessage]);

  const handleSendMessage = () => {
    let campaignName = '';
    let campaignMessage = '';

    if (messageMode === 'template') {
        if (!selectedTemplate) {
            alert("Please select a template.");
            return;
        }
        campaignName = `Message: ${selectedTemplate.name}`;
        campaignMessage = selectedTemplate.message;
    } else {
        if (!customCampaignName.trim() || !customMessage.trim()) {
            alert("Please provide a campaign name and a message.");
            return;
        }
        campaignName = customCampaignName;
        campaignMessage = customMessage;
    }
    
    if (targetContacts.length === 0) {
      alert("Please select a valid target audience.");
      return;
    }

    if (!isConnected) {
        alert("Please connect to the WhatsApp API in Settings before sending a message.");
        return;
    }
    
    const totalToSend = targetContacts.length;
    // Simulate a 98% success rate for demonstration
    const sentCount = Math.floor(totalToSend * 0.98);
    const failedCount = totalToSend - sentCount;
    setLastBroadcastResult({ sent: sentCount, failed: failedCount });

    const newCampaign: Campaign = {
      id: `c${Date.now()}`,
      name: campaignName,
      message: campaignMessage,
      status: 'Sent',
      sentTo: sentCount, // Only count successful sends
      sentDate: new Date().toISOString().split('T')[0],
    };

    addCampaign(newCampaign);
    alert(`Message "${newCampaign.name}" with ${uploadedFiles.length} attachments sent to ${sentCount} contacts via WhatsApp! (${failedCount} failed)`);
    
    // Reset state
    setSelectedTemplateId('');
    setCustomCampaignName('');
    setCustomMessage('');
    setTargetAudience('all');
    setUploadedFiles([]);
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
        setUploadedFiles(prev => [...prev, ...Array.from(files)]);
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };
  
  const handleRemoveFile = (fileToRemove: File) => {
    setUploadedFiles(prev => prev.filter(file => file !== fileToRemove));
  };
  
  const handleInsertChatLink = () => {
    if (!chatLinkNumber) {
        alert('Please enter a phone number for the chat link.');
        return;
    }
    const phoneNumber = chatLinkNumber.replace(/\D/g, '');
    let link = `https://wa.me/${phoneNumber}`;
    if (chatLinkPreFilledText.trim()) {
        link += `?text=${encodeURIComponent(chatLinkPreFilledText.trim())}`;
    }
    
    setCustomMessage(prev => `${prev}\n${link}`.trim());
    setChatLinkNumber('');
    setChatLinkPreFilledText('');
    setShowChatLinkCreator(false);
  };

  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-indigo-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-yellow-500'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">WhatsApp Broadcasting</h1>
          <p className="mt-1 text-sm text-gray-500">Send a message to a selected group of your contacts.</p>
        </div>
        
        <div className="flex space-x-4 shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 text-center w-36">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">To Send</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{targetContacts.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 text-center w-36">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{lastBroadcastResult?.sent ?? 0}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 text-center w-36">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Failed</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{lastBroadcastResult?.failed ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800">1. Create Your Message</h3>
            <div className="mt-2 flex rounded-md shadow-sm">
                <button
                    type="button"
                    onClick={() => setMessageMode('template')}
                    className={`relative inline-flex items-center justify-center w-1/2 px-4 py-2 rounded-l-md border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    messageMode === 'template' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    From Template
                </button>
                <button
                    type="button"
                    onClick={() => setMessageMode('custom')}
                    className={`relative -ml-px inline-flex items-center justify-center w-1/2 px-4 py-2 rounded-r-md border text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    messageMode === 'custom' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    Write Custom Message
                </button>
            </div>
          </div>
          
          {messageMode === 'template' ? (
             <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template, index) => (
                    <button
                        key={template.id}
                        onClick={() => setSelectedTemplateId(template.id)}
                        className={`rounded-lg shadow-md overflow-hidden text-left transition-all duration-200 ease-in-out border border-gray-200 ${
                            selectedTemplateId === template.id 
                            ? 'ring-2 ring-offset-2 ring-blue-500 ring-offset-gray-100 scale-105' 
                            : 'hover:shadow-lg hover:scale-105'
                        }`}
                    >
                        <div className={`p-3 ${colors[index % colors.length]}`}>
                            <h4 className="font-bold text-white truncate text-sm">{template.name}</h4>
                        </div>
                        <div className="p-3 bg-gray-50">
                            <p className="text-xs text-gray-600" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {template.message}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
          ) : (
            <div className="space-y-4">
                <div>
                  <label htmlFor="campaign-name" className="block text-sm font-medium text-gray-700">Campaign Name</label>
                  <input 
                    type="text" 
                    id="campaign-name" 
                    value={customCampaignName}
                    onChange={(e) => setCustomCampaignName(e.target.value)}
                    className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="e.g., Q4 Product Update"
                  />
                </div>
                <div>
                  <label htmlFor="custom-message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea 
                    id="custom-message" 
                    rows={4}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type your message here..."
                  />
                </div>
                <div className="flex items-center space-x-4 pt-2">
                    <button type="button" onClick={() => setShowChatLinkCreator(!showChatLinkCreator)} className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                        <LinkIcon className="w-4 h-4 mr-1.5"/> Add Click-to-Chat Link
                    </button>
                    <button type="button" onClick={handleUploadClick} className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                        <UploadIcon className="w-4 h-4 mr-1.5"/> Attach Files
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
                </div>
                {showChatLinkCreator && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">Create Chat Link</h4>
                         <input
                            type="tel"
                            value={chatLinkNumber}
                            onChange={e => setChatLinkNumber(e.target.value)}
                            placeholder="Phone number with country code (e.g., 15551234567)"
                            className="block w-full text-sm bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                         <textarea
                            value={chatLinkPreFilledText}
                            onChange={e => setChatLinkPreFilledText(e.target.value)}
                            rows={2}
                            placeholder="Optional: Pre-filled text for user"
                            className="block w-full text-sm bg-white border border-gray-300 rounded-md py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button type="button" onClick={handleInsertChatLink} className="px-3 py-1.5 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700">Insert Link</button>
                    </div>
                )}
                {uploadedFiles.length > 0 && (
                     <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                         <h4 className="text-sm font-medium text-gray-700">Attachments ({uploadedFiles.length})</h4>
                         <ul className="space-y-2">
                            {uploadedFiles.map((file, index) => (
                                <li key={index} className="flex items-center justify-between text-sm text-gray-600 bg-white p-2 rounded-md border border-gray-200">
                                    <span className="truncate pr-2">{file.name}</span>
                                    <button onClick={() => handleRemoveFile(file)} className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100">
                                        <TrashIcon className="w-4 h-4"/>
                                    </button>
                                </li>
                            ))}
                         </ul>
                     </div>
                )}
              </div>
          )}

          {isMessageReady ? (
            <div className="space-y-6 pt-4 border-t border-gray-200">
                <div className="bg-gray-100 p-4 rounded-md border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-800">Message Preview:</h4>
                  <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                    {messageMode === 'template' ? selectedTemplate?.message : customMessage}
                  </p>
                   {messageMode === 'custom' && uploadedFiles.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                          <h5 className="flex items-center text-xs font-semibold text-gray-600">
                            <PaperclipIcon className="w-4 h-4 mr-1.5"/> ATTACHMENTS
                          </h5>
                          <ul className="text-xs text-gray-500 list-disc list-inside mt-1">
                            {uploadedFiles.map((file, i) => <li key={i}>{file.name}</li>)}
                          </ul>
                      </div>
                   )}
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-800">
                        2. Select Your Audience
                    </h3>
                    <select
                        id="audience-select"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="mt-2 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="all">All Contacts ({contacts.length})</option>
                        {allTags.map(tag => {
                             const count = contacts.filter(c => c.tags.includes(tag)).length;
                             return <option key={tag} value={tag} className="capitalize">Tag: {tag} ({count})</option>;
                        })}
                    </select>
                </div>

                <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-center">
                    <p className="text-lg font-bold text-blue-800">{targetContacts.length}</p>
                    <p className="text-sm font-medium text-blue-700">Contacts will receive this message.</p>
                </div>

                <div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!isMessageReady || targetContacts.length === 0 || !isConnected}
                        className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        <SendIcon className="w-5 h-5 mr-2" />
                        Send Message
                    </button>
                    {!isConnected && (
                        <p className="text-xs text-center text-red-600 mt-2">
                            Please connect to the WhatsApp API in the Settings page to send messages.
                        </p>
                    )}
                </div>
            </div>
          ) : (
             <div className="text-center py-8 border-t border-gray-200">
                  <p className="text-gray-500">
                    {messageMode === 'template' ? 'Please select a template above to continue.' : 'Please write a message and give it a name to continue.'}
                  </p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BroadcastingPage;