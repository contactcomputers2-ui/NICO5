
import React, { useState, useRef, useEffect } from 'react';
import { CampaignTemplate, TemplateAttachment } from '../types';
import Modal from './Modal';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import LinkIcon from './icons/LinkIcon';
import UploadIcon from './icons/UploadIcon';
import PaperclipIcon from './icons/PaperclipIcon';
import ReplyIcon from './icons/ReplyIcon';
import FileIcon from './icons/FileIcon';

interface TemplatesPageProps {
  templates: CampaignTemplate[];
  onAdd: (template: Omit<CampaignTemplate, 'id'>) => void;
  onUpdate: (template: CampaignTemplate) => void;
  onDelete: (templateId: string) => void;
  onUpdateStatus: (templateId: string, status: CampaignTemplate['status']) => void; // New prop
}

const TemplatePreview: React.FC<{
    message: string;
    attachments: File[];
    quickReplies: string[];
}> = ({ message, attachments, quickReplies }) => {
    return (
        <div className="bg-gray-200 p-3 rounded-lg h-full flex flex-col justify-center">
            <div className="w-full max-w-sm mx-auto bg-[#E5DDD5] border-gray-800 border-[8px] rounded-[2.5rem] h-[40rem] overflow-hidden shadow-xl">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')" }}>
                    <div className="p-3 flex flex-col h-full">
                        <div className="flex-grow"></div>
                        <div className="bg-white rounded-lg p-2.5 shadow-sm max-w-[85%] self-start flex flex-col">
                           {attachments.length > 0 && (
                                <div className="mb-2 rounded-md overflow-hidden bg-gray-200 aspect-video flex items-center justify-center">
                                    <FileIcon className="w-10 h-10 text-gray-400"/>
                                </div>
                           )}
                           <p className="text-sm text-gray-800 whitespace-pre-wrap">{message || 'Your message will appear here...'}</p>
                        </div>
                         {quickReplies.length > 0 && (
                            <div className="mt-2 flex flex-col items-center space-y-1.5">
                                {quickReplies.map((reply, i) => (
                                    <button key={i} className="w-full text-center bg-gray-100 text-blue-500 font-medium text-sm py-2 px-3 rounded-xl border border-gray-300 shadow-sm">
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


const TemplateForm: React.FC<{
  template?: CampaignTemplate | null;
  onSave: (template: Omit<CampaignTemplate, 'id'> | CampaignTemplate) => void;
  onCancel: () => void;
}> = ({ template, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [replyInput, setReplyInput] = useState('');
  const [showChatLinkCreator, setShowChatLinkCreator] = useState(false);
  const [chatLinkNumber, setChatLinkNumber] = useState('');
  const [chatLinkPreFilledText, setChatLinkPreFilledText] = useState('');
  const [status, setStatus] = useState<CampaignTemplate['status']>('Active'); // New state for status
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setMessage(template.message);
      setAttachments([]); // For editing, existing attachments are not loaded as File objects. User must re-upload.
      setQuickReplies(template.quickReplies || []);
      setStatus(template.status); // Load existing status
    } else {
      setName('');
      setMessage('');
      setAttachments([]);
      setQuickReplies([]);
      setStatus('Active'); // Default for new templates
    }
  }, [template]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && message) {
        const templateAttachments: TemplateAttachment[] = attachments.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size,
        }));

        const saveData = { 
            name, 
            message, 
            attachments: templateAttachments, 
            quickReplies,
            status, // Include status in save data
        };

        if (template) {
            onSave({ ...template, ...saveData });
        } else {
            onSave(saveData);
        }
    }
  };
  
  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAttachments(prev => [...prev, ...Array.from(event.target.files!)]);
    }
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setAttachments(prev => prev.filter(f => f !== fileToRemove));
  };
  
  const handleInsertChatLink = () => {
    if (!chatLinkNumber) return alert('Phone number is required.');
    const link = `https://wa.me/${chatLinkNumber.replace(/\D/g, '')}${chatLinkPreFilledText ? `?text=${encodeURIComponent(chatLinkPreFilledText)}` : ''}`;
    setMessage(prev => `${prev} ${link}`.trim());
    setShowChatLinkCreator(false);
    setChatLinkNumber('');
    setChatLinkPreFilledText('');
  };

  const handleAddReply = () => {
    if (replyInput && quickReplies.length < 3) {
      setQuickReplies([...quickReplies, replyInput]);
      setReplyInput('');
    }
  };
  
  const handleRemoveReply = (index: number) => {
    setQuickReplies(quickReplies.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
            <div className="flex-grow space-y-4 overflow-y-auto pr-2">
              <div>
                <label htmlFor="template-name" className="block text-sm font-medium text-gray-700">Template Name</label>
                <input type="text" id="template-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label htmlFor="template-message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea id="template-message" value={message} onChange={e => setMessage(e.target.value)} rows={5} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
              </div>

              {/* Template Status */}
              <div>
                <label htmlFor="template-status" className="block text-sm font-medium text-gray-700">Status</label>
                <select 
                    id="template-status" 
                    value={status} 
                    onChange={e => setStatus(e.target.value as CampaignTemplate['status'])} 
                    className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={template?.status === 'Used'} // Cannot change 'Used' status from here
                >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    {template?.status === 'Used' && <option value="Used">Used</option>} {/* Show 'Used' only if already used */}
                </select>
                {template?.status === 'Used' && (
                    <p className="mt-1 text-xs text-gray-500">This template has been used in a campaign and its status cannot be changed directly.</p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Interactive Elements</h4>
                <div className="flex items-center space-x-4">
                     <button type="button" onClick={() => setShowChatLinkCreator(s => !s)} className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                        <LinkIcon className="w-4 h-4 mr-1.5"/> Add Click-to-Chat Link
                    </button>
                    <button type="button" onClick={handleUploadClick} className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                        <UploadIcon className="w-4 h-4 mr-1.5"/> Attach Files
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
                </div>
                 {showChatLinkCreator && (
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                         <input type="tel" value={chatLinkNumber} onChange={e => setChatLinkNumber(e.target.value)} placeholder="Phone number (e.g., 15551234567)" className="block w-full text-sm bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500" />
                         <textarea value={chatLinkPreFilledText} onChange={e => setChatLinkPreFilledText(e.target.value)} rows={2} placeholder="Optional: Pre-filled text" className="block w-full text-sm bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500" />
                        <button type="button" onClick={handleInsertChatLink} className="px-3 py-1.5 text-xs rounded-md text-white bg-blue-600 hover:bg-blue-700">Insert Link</button>
                    </div>
                )}
              </div>
               {attachments.length > 0 && (
                 <div className="space-y-2">
                     <h4 className="text-sm font-medium text-gray-700">Attachments</h4>
                     {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-md border">
                            <span className="truncate pr-2">{file.name}</span>
                            <button type="button" onClick={() => handleRemoveFile(file)} className="p-1 text-gray-400 hover:text-red-600"><TrashIcon className="w-4 h-4"/></button>
                        </div>
                    ))}
                 </div>
              )}
               <div className="space-y-2">
                 <label className="block text-sm font-medium text-gray-700">Quick Reply Buttons</label>
                  {quickReplies.map((reply, index) => (
                    <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-md border">
                      <span>{reply}</span>
                      <button type="button" onClick={() => handleRemoveReply(index)} className="p-1 text-gray-400 hover:text-red-600"><TrashIcon className="w-4 h-4"/></button>
                    </div>
                  ))}
                 {quickReplies.length < 3 && (
                     <div className="flex space-x-2">
                         <input type="text" value={replyInput} onChange={e => setReplyInput(e.target.value)} placeholder="Button text..." className="flex-1 block w-full text-sm bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500" />
                         <button type="button" onClick={handleAddReply} className="px-4 py-2 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700">Add</button>
                     </div>
                 )}
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Save Template</button>
            </div>
        </form>
        <div className="hidden md:block">
            <TemplatePreview message={message} attachments={attachments} quickReplies={quickReplies} />
        </div>
    </div>
  );
};

const TemplatesPage: React.FC<TemplatesPageProps> = ({ templates, onAdd, onUpdate, onDelete, onUpdateStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CampaignTemplate | null>(null);

  const handleOpenModalForCreate = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (template: CampaignTemplate) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  const handleSave = (template: Omit<CampaignTemplate, 'id'> | CampaignTemplate) => {
    if ('id' in template && template.id) {
        onUpdate(template as CampaignTemplate);
    } else {
        onAdd(template);
    }
    handleCloseModal();
  };
  
  const getStatusColor = (status: CampaignTemplate['status']) => {
    switch (status) {
        case 'Draft': return 'bg-gray-100 text-gray-800';
        case 'Active': return 'bg-blue-100 text-blue-800';
        case 'Used': return 'bg-amber-100 text-amber-800';
        default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getRandomAccentColor = (index: number) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-indigo-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-yellow-500'
    ];
    return colors[index % colors.length];
  }

  const handleToggleStatus = (template: CampaignTemplate) => {
    if (template.status === 'Used') return; // Cannot change 'Used' status via this button
    const newStatus = template.status === 'Draft' ? 'Active' : 'Draft';
    onUpdateStatus(template.id, newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Campaign Templates</h1>
        <button
          onClick={handleOpenModalForCreate}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
            <div key={template.id} className="bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
                <div className={`p-4 ${getRandomAccentColor(index)} relative`}>
                    <h3 className="font-bold text-white truncate text-lg pr-16">{template.name}</h3>
                    <span className={`absolute top-3 right-3 px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(template.status)}`}>
                        {template.status}
                    </span>
                </div>
                <div className="p-4 flex-grow">
                    <p className="text-sm text-gray-600" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {template.message}
                    </p>
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <div className="flex space-x-2">
                        {template.attachments && template.attachments.length > 0 && (
                            <span title="Has attachments">
                                <PaperclipIcon className="w-4 h-4 text-gray-400" />
                            </span>
                        )}
                        {template.quickReplies && template.quickReplies.length > 0 && (
                            <span title="Has quick replies">
                                <ReplyIcon className="w-4 h-4 text-gray-400" />
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        {template.status !== 'Used' && (
                            <button 
                                onClick={() => handleToggleStatus(template)} 
                                className="px-2 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                                title={`Toggle status to ${template.status === 'Draft' ? 'Active' : 'Draft'}`}
                            >
                                {template.status === 'Draft' ? 'Mark Active' : 'Mark Draft'}
                            </button>
                        )}
                        <button onClick={() => handleOpenModalForEdit(template)} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors">
                            <EditIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => onDelete(template.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingTemplate ? "Edit Template" : "Create New Template"}
        size="4xl"
      >
        <TemplateForm 
            template={editingTemplate} 
            onSave={handleSave} 
            onCancel={handleCloseModal} 
        />
      </Modal>
    </div>
  );
};

export default TemplatesPage;
