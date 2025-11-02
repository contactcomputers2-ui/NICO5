
import React, { useState, useEffect } from 'react';
import { Campaign, Contact, CampaignTemplate } from '../types';
import Modal from './Modal';
import { generateCampaignMessage } from '../services/geminiService';
import PlusIcon from './icons/PlusIcon';
import SparklesIcon from './icons/SparklesIcon';
import SaveIcon from './icons/SaveIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';


interface CampaignsPageProps {
  campaigns: Campaign[];
  contacts: Contact[];
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void; // Updated type
  updateCampaign: (campaign: Campaign) => void;
  deleteCampaign: (campaignId: string) => void;
  campaignTemplates: CampaignTemplate[];
  addCampaignTemplate: (template: Omit<CampaignTemplate, 'id'>) => void;
  updateCampaignTemplateStatus: (templateId: string, status: CampaignTemplate['status']) => void; // New prop
}

const CampaignForm: React.FC<{ 
  campaign?: Campaign | null;
  onSave: (campaign: Omit<Campaign, 'id'> | Campaign) => void;
  onCancel: () => void;
  templates: CampaignTemplate[];
  onSaveTemplate: (template: { name: string, message: string, status?: CampaignTemplate['status'] }) => void; // Added status
}> = ({ campaign, onSave, onCancel, templates, onSaveTemplate }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(undefined); // Track selected template

  const getDefaultScheduleTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for local timezone for input
    now.setHours(now.getHours() + 1); // Default to one hour from now
    return now.toISOString().slice(0, 16);
  };
  const [scheduledDateTime, setScheduledDateTime] = useState(getDefaultScheduleTime());

  useEffect(() => {
    if (campaign) {
      setName(campaign.name);
      setMessage(campaign.message);
      setIsScheduled(campaign.status === 'Scheduled');
      if (campaign.scheduledDate) {
        const d = new Date(campaign.scheduledDate);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        setScheduledDateTime(d.toISOString().slice(0, 16));
      } else {
        setScheduledDateTime(getDefaultScheduleTime());
      }
      setSelectedTemplateId(campaign.templateId); // Load templateId if editing
    } else {
      setName('');
      setMessage('');
      setPrompt('');
      setIsScheduled(false);
      setScheduledDateTime(getDefaultScheduleTime());
      setSelectedTemplateId(undefined);
    }
  }, [campaign]);

  const handleGenerateMessage = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    const generatedMessage = await generateCampaignMessage(prompt);
    setMessage(generatedMessage);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && message) {
      const status: Campaign['status'] = isScheduled ? 'Scheduled' : 'Draft';
      const campaignData: Omit<Campaign, 'id'> = { // Use Omit for new campaigns
        name,
        message,
        status,
        scheduledDate: isScheduled ? new Date(scheduledDateTime).toISOString() : null,
        sentTo: campaign?.sentTo || 0, // Preserve sentTo for existing campaigns, default 0 for new
        sentDate: campaign?.sentDate || null, // Preserve sentDate for existing campaigns, default null for new
        templateId: selectedTemplateId, // Include templateId
      };

      if (campaign) {
        // When updating an existing campaign, ensure 'id' is present
        onSave({ ...campaign, ...campaignData, id: campaign.id });
      } else {
        onSave(campaignData); // Directly pass Omit<Campaign, 'id'>
      }
    }
  };

  const handleLoadTemplate = (templateId: string) => {
      setSelectedTemplateId(templateId === '' ? undefined : templateId); // Store selected templateId
      if (!templateId) {
          setName('');
          setMessage('');
          return;
      }
      const template = templates.find(t => t.id === templateId);
      if (template) {
          setName(template.name);
          setMessage(template.message);
      }
  };

  const handleSaveAsTemplate = () => {
      if (name && message) {
          onSaveTemplate({ name, message, status: 'Active' }); // Default new template to Active
          alert(`Template "${name}" saved!`);
      }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <div>
        <label htmlFor="load-template" className="block text-sm font-medium text-gray-700">Load Template</label>
        <select
            id="load-template"
            value={selectedTemplateId || ''} // Control select with state
            onChange={(e) => handleLoadTemplate(e.target.value)}
            className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
            <option value="">-- Select a template --</option>
            {templates.filter(t => t.status !== 'Draft').map(template => ( // Only show active/used templates
                <option key={template.id} value={template.id}>{template.name}</option>
            ))}
        </select>
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Campaign Name</label>
        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
      </div>
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">AI Prompt for Message</label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input type="text" id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g., A flash sale for 25% off" className="flex-1 block w-full rounded-none rounded-l-md bg-gray-50 border border-gray-300 py-2 px-3 text-gray-800 focus:ring-blue-500 focus:border-blue-500" />
          <button type="button" onClick={handleGenerateMessage} disabled={isGenerating} className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50">
            <SparklesIcon className="w-5 h-5" />
            <span className="ml-2 text-sm font-medium">{isGenerating ? 'Generating...' : 'Generate'}</span>
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
        <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={4} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
      </div>
      
      <div className="pt-2 space-y-2">
        <div className="flex items-center">
            <input 
                id="schedule" 
                type="checkbox" 
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="schedule" className="ml-2 block text-sm font-medium text-gray-700">Schedule for later</label>
        </div>
        {isScheduled && (
            <div>
                 <label htmlFor="scheduledDateTime" className="sr-only">Schedule Date and Time</label>
                 <input 
                    type="datetime-local" 
                    id="scheduledDateTime"
                    value={scheduledDateTime}
                    onChange={(e) => setScheduledDateTime(e.target.value)}
                    className="block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300">Cancel</button>
        <button type="button" onClick={handleSaveAsTemplate} className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200">
           <SaveIcon className="w-4 h-4 mr-2"/> Save as Template
        </button>
        <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          {campaign ? 'Save Changes' : (isScheduled ? 'Schedule Campaign' : 'Save as Draft')}
        </button>
      </div>
    </form>
  );
};


const CampaignsPage: React.FC<CampaignsPageProps> = ({ 
  campaigns, contacts, addCampaign, updateCampaign, deleteCampaign, 
  campaignTemplates, addCampaignTemplate, updateCampaignTemplateStatus 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const handleOpenModalForCreate = () => {
    setEditingCampaign(null);
    setIsModalOpen(true);
  };
  
  const handleOpenModalForEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCampaign(null);
  };
  
  const handleSaveCampaign = (campaignData: Omit<Campaign, 'id'> | Campaign) => {
    if ('id' in campaignData && campaignData.id) {
      updateCampaign(campaignData as Campaign);
    } else {
      // addCampaign already generates ID, just pass the Omit<Campaign, 'id'> object
      addCampaign(campaignData as Omit<Campaign, 'id'>); 
    }
    handleCloseModal();
  };
  
  const handleDeleteCampaign = (campaignId: string) => {
    if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      deleteCampaign(campaignId);
    }
  };

  const handleSendCampaign = (campaign: Campaign) => {
    if (campaign.status === 'Sent') {
      alert('This campaign has already been sent.');
      return;
    }

    const sentCampaign: Campaign = {
        ...campaign,
        status: 'Sent',
        sentTo: contacts.length, // Mock sending to all contacts
        sentDate: new Date().toISOString().split('T')[0],
        scheduledDate: null,
    };
    updateCampaign(sentCampaign);

    // If campaign originated from a template, mark the template as 'Used'
    if (campaign.templateId) {
      updateCampaignTemplateStatus(campaign.templateId, 'Used');
    }
  };

  const handleUnscheduleCampaign = (campaign: Campaign) => {
    const unscheduledCampaign: Campaign = {
        ...campaign,
        status: 'Draft',
        scheduledDate: null,
    };
    updateCampaign(unscheduledCampaign);
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'Sent': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Draft':
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Campaigns</h1>
        <button
        onClick={handleOpenModalForCreate}
        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
        <PlusIcon className="w-5 h-5 mr-2" />
        New Campaign
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {campaigns.map(campaign => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{campaign.message}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.sentTo > 0 ? campaign.sentTo.toLocaleString() : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.status === 'Sent' && campaign.sentDate}
                    {campaign.status === 'Scheduled' && campaign.scheduledDate ? new Date(campaign.scheduledDate).toLocaleString() : null}
                    {campaign.status === 'Draft' && '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3 items-center">
                        {campaign.status === 'Draft' && (
                            <button onClick={() => handleSendCampaign(campaign)} className="text-blue-600 hover:text-blue-800">Send</button>
                        )}
                        {campaign.status === 'Scheduled' && (
                            <>
                                <button onClick={() => handleSendCampaign(campaign)} className="text-blue-600 hover:text-blue-800">Send Now</button>
                                <button onClick={() => handleUnscheduleCampaign(campaign)} className="text-gray-500 hover:text-gray-700">Unschedule</button>
                            </>
                        )}
                        {(campaign.status === 'Draft' || campaign.status === 'Scheduled') && (
                            <button onClick={() => handleOpenModalForEdit(campaign)} className="p-1 text-gray-500 hover:text-blue-600" title="Edit campaign">
                                <EditIcon className="w-5 h-5" />
                            </button>
                        )}
                        <button onClick={() => handleDeleteCampaign(campaign.id)} className="p-1 text-gray-500 hover:text-red-600" title="Delete campaign">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}>
        <CampaignForm 
            campaign={editingCampaign}
            onSave={handleSaveCampaign} 
            onCancel={handleCloseModal} 
            templates={campaignTemplates}
            onSaveTemplate={addCampaignTemplate}
        />
      </Modal>

    </div>
  );
};

export default CampaignsPage;
