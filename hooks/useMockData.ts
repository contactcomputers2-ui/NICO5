import { useState } from 'react';
import { Contact, Message, MessageThread, Campaign, CampaignTemplate, Group, Asset, User, CustomFieldDefinition, SocialPost, Integration } from '../types';
import FacebookIcon from '../components/icons/FacebookIcon';
import InstagramIcon from '../components/icons/InstagramIcon';
import WhatsappIcon from '../components/icons/WhatsappIcon';
import SageIcon from '../components/icons/SageIcon';
import RbsIcon from '../components/icons/RbsIcon';
import QuickbooksIcon from '../components/icons/QuickbooksIcon';
import AzureIcon from '../components/icons/AzureIcon';
import HealthFocusIcon from '../components/icons/HealthFocusIcon'; // New import
import HealthBridgeIcon from '../components/icons/HealthBridgeIcon'; // New import

const generateAvatar = (seed: string) => `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}`;

// Re-added MOCK_CONTACTS for internal data management
const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Alice Smith', phone: '+1234567890', avatar: generateAvatar('Alice Smith'), tags: ['vip', 'customer', 'whatsapp'], lastSeen: '2023-10-27T10:30:00Z', customFields: {'Company': 'ACME Corp', 'Support Tier': 'Premium'} },
  { id: '2', name: 'Bob Johnson', phone: '+1987654321', avatar: generateAvatar('Bob Johnson'), tags: ['lead', 'facebook'], lastSeen: '2023-10-26T14:00:00Z', customFields: {'Company': 'Globex Inc'} },
  { id: '3', name: 'Charlie Brown', phone: '+1122334455', avatar: generateAvatar('Charlie Brown'), tags: ['customer', 'instagram'], lastSeen: '2023-10-27T09:15:00Z', customFields: {'Support Tier': 'Standard'} },
  { id: '4', name: 'Diana Prince', phone: '+1555112233', avatar: generateAvatar('Diana Prince'), tags: ['vip', 'whatsapp'], lastSeen: '2023-10-25T18:45:00Z', customFields: {'Company': 'Themyscira Ltd'} },
  { id: '5', name: 'Eve Adams', phone: '+1444556677', avatar: generateAvatar('Eve Adams'), tags: ['lead', 'facebook', 'instagram'], lastSeen: '2023-10-27T11:00:00Z', customFields: {} },
];

const MOCK_MESSAGES: MessageThread = {
  '1': [
    // Fix: Removed 'platform' as it's not defined in the Message type
    { id: 'm1', text: 'Hi Alice, how are you?', sender: 'me', timestamp: '2023-10-27T10:00:00Z' },
    // Fix: Removed 'platform' as it's not defined in the Message type
    { id: 'm2', text: 'I am fine, thank you!', sender: 'customer', timestamp: '2023-10-27T10:01:00Z' },
    // Fix: Removed 'platform' as it's not defined in the Message type
    { id: 'm7', text: 'Just checking in!', sender: 'me', timestamp: '2023-10-27T10:05:00Z' },
  ],
  '2': [
     // Fix: Removed 'platform' as it's not defined in the Message type
     { id: 'm3', text: 'Hello Bob, we have an an update on your ticket.', sender: 'me', timestamp: '2023-10-27T11:00:00Z' },
  ],
  '3': [
    // Fix: Removed 'platform' as it's not defined in the Message type
    { id: 'm4', text: 'Hey Charlie, check out our new arrivals!', sender: 'me', timestamp: '2023-10-27T12:00:00Z' },
    // Fix: Removed 'platform' as it's not defined in the Message type
    { id: 'm5', text: 'Looks great, thanks!', sender: 'customer', timestamp: '2023-10-27T12:05:00Z' },
  ],
  '4': [
    // Fix: Removed 'platform' as it's not defined in the Message type
    { id: 'm6', text: 'Your VIP offer is here!', sender: 'me', timestamp: '2023-10-27T13:00:00Z' },
  ],
};

const MOCK_TEMPLATES: CampaignTemplate[] = [
    { id: 't1', name: 'Welcome Message', message: 'Hi {{1}}, welcome to our service! We are excited to have you.', status: 'Active' },
    { id: 't2', name: 'Sale Announcement', message: 'Hello! Our big sale starts now. Get up to 50% off. Shop now: {{1}}', status: 'Active' },
    { id: 't3', name: 'Draft Template', message: 'This template is still being drafted.', status: 'Draft' },
];

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'c1', name: 'Q4 Promo', message: 'Get 20% off on all products this quarter!', status: 'Sent', sentTo: 150, sentDate: '2023-10-20', templateId: 't1' },
  { id: 'c2', name: 'Black Friday Deals', message: 'Our Black Friday deals are here! Don\'t miss out.', status: 'Scheduled', sentTo: 0, sentDate: null, scheduledDate: '2023-11-24T09:00:00Z' },
  { id: 'c3', name: 'Holiday Greetings', message: 'Happy holidays from our team!', status: 'Draft', sentTo: 0, sentDate: null },
];

const MOCK_GROUPS: Group[] = [
    { id: 'g1', name: 'VIP Clients', description: 'High-value customers for special offers.', contactIds: ['1', '4'] },
    { id: 'g2', name: 'Product Testers', description: 'Users testing new product features.', contactIds: ['2'] },
];

const MOCK_ASSETS: Asset[] = [
    { id: 'folder-1', type: 'folder', name: 'Marketing Images', parentId: null, createdAt: new Date().toISOString() },
    { id: 'file-1', type: 'file', name: 'Logo.png', url: '/logo.png', size: 12000, fileType: 'image/png', parentId: null, createdAt: new Date().toISOString() },
];

const MOCK_USERS: User[] = [
    { id: 'u1', name: 'Admin User', email: 'admin@example.com', avatar: generateAvatar('Admin User'), role: 'Admin', status: 'Active' },
    { id: 'u2', name: 'Jane Agent', email: 'jane@example.com', avatar: generateAvatar('Jane Agent'), role: 'Agent', status: 'Active' },
];

const MOCK_CUSTOM_FIELDS: CustomFieldDefinition[] = [
  { id: 'cfd-1', name: 'Company' },
  { id: 'cfd-2', name: 'Support Tier' },
];

export const MOCK_INTEGRATIONS: Integration[] = [
  {
      name: 'WhatsApp Business',
      description: 'Connect your WhatsApp Business Account to manage conversations directly.',
      icon: WhatsappIcon,
      isConnected: true,
  },
  {
      name: 'Facebook Pages',
      description: 'Integrate with Facebook Pages to publish posts and manage your presence.',
      icon: FacebookIcon,
      isConnected: true,
  },
  {
      name: 'Instagram Business',
      description: 'Publish posts to Instagram and manage your social presence.',
      icon: InstagramIcon,
      isConnected: false, // Mock as not connected
  },
  {
      name: 'Sage Accounting',
      description: 'Sync customer data, invoices, and financial records automatically.',
      icon: SageIcon,
      isConnected: false,
  },
  {
      name: 'RBS Bankline',
      description: 'Integrate your business banking for seamless transaction tracking.',
      icon: RbsIcon,
      isConnected: false,
  },
  {
      name: 'QuickBooks',
      description: 'Keep your accounting up-to-date with automatic contact and sales sync.',
      icon: QuickbooksIcon,
      isConnected: false,
  },
  {
      name: 'Microsoft Azure',
      description: 'Leverage cloud services for data storage, analytics, and more.',
      icon: AzureIcon,
      isConnected: false,
  },
  { // New Integration
      name: 'Health Focus',
      description: 'Integrate health data for personalized patient communications.',
      icon: HealthFocusIcon,
      isConnected: false,
  },
  { // New Integration
      name: 'HealthBridge',
      description: 'Connect with healthcare providers and systems for streamlined operations.',
      icon: HealthBridgeIcon,
      isConnected: false,
  },
];

export const useMockData = () => {
    // Re-added contacts state
    const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS); 
    const [messages, setMessages] = useState<MessageThread>(MOCK_MESSAGES);
    const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
    const [campaignTemplates, setCampaignTemplates] = useState<CampaignTemplate[]>(MOCK_TEMPLATES);
    const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
    const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
    const [customFieldDefinitions, setCustomFieldDefinitions] = useState<CustomFieldDefinition[]>(MOCK_CUSTOM_FIELDS);

    // New mock data for social messages
    const [facebookMessagesTotal, setFacebookMessagesTotal] = useState(1240);
    const [instagramMessagesTotal, setInstagramMessagesTotal] = useState(780);
    const [whatsappIncomingMessagesTotal, setWhatsappIncomingMessagesTotal] = useState(5500);
    const [whatsappOutgoingMessagesTotal, setWhatsappOutgoingMessagesTotal] = useState(7200);

    // Re-added contact CRUD operations
    const addContact = (newContact: Omit<Contact, 'id' | 'avatar' | 'lastSeen'>) => {
        const id = String(Date.now());
        const avatar = generateAvatar(newContact.name);
        const lastSeen = new Date().toISOString();
        const contactWithId: Contact = { ...newContact, id, avatar, lastSeen };
        setContacts(prev => [...prev, contactWithId]);
        return contactWithId; // Return the added contact for immediate use
    };

    const updateContact = (updatedContact: Contact) => {
        setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
    };

    const deleteContact = (contactId: string) => {
        setContacts(prev => prev.filter(c => c.id !== contactId));
    };

    const addMessage = (contactId: string, message: Omit<Message, 'id'>) => {
        const newMessage: Message = { ...message, id: String(Date.now()) };
        setMessages(prev => ({
            ...prev,
            [contactId]: [...(prev[contactId] || []), newMessage],
        }));
    };
    
    const addCampaign = (campaign: Omit<Campaign, 'id'>) => { // Updated to accept Omit<Campaign, 'id'>
        setCampaigns(prev => [...prev, { ...campaign, id: `c${Date.now()}` }]);
    };
    
    const updateCampaign = (updatedCampaign: Campaign) => {
        setCampaigns(prev => prev.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
    };
    
    const deleteCampaign = (campaignId: string) => {
        setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    };

    const addCampaignTemplate = (template: Omit<CampaignTemplate, 'id'>) => {
        const newTemplate: CampaignTemplate = { ...template, id: `t-${Date.now()}`, status: template.status || 'Active' }; // Default status
        setCampaignTemplates(prev => [...prev, newTemplate]);
    };

    const updateCampaignTemplate = (updatedTemplate: CampaignTemplate) => {
        setCampaignTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
    };

    const deleteCampaignTemplate = (templateId: string) => {
        setCampaignTemplates(prev => prev.filter(t => t.id !== templateId));
    };

    const updateCampaignTemplateStatus = (templateId: string, status: CampaignTemplate['status']) => {
        setCampaignTemplates(prev => prev.map(t => t.id === templateId ? { ...t, status } : t));
    };

    const addGroup = (group: Omit<Group, 'id'>) => {
        const newGroup = { ...group, id: `g-${Date.now()}` };
        setGroups(prev => [...prev, newGroup]);
    };

    const updateGroup = (updatedGroup: Group) => {
        setGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
    };

    const deleteGroup = (groupId: string) => {
        setGroups(prev => prev.filter(g => g.id !== groupId));
    };
    
    const toggleContactInGroup = (contactId: string, groupId: string) => {
        setGroups(prev => prev.map(g => {
            if (g.id === groupId) {
                const contactIds = g.contactIds.includes(contactId) 
                    ? g.contactIds.filter(id => id !== contactId)
                    : [...g.contactIds, contactId];
                return { ...g, contactIds };
            }
            return g;
        }));
    };
    
    const addAsset = (asset: Asset) => {
        setAssets(prev => [...prev, asset]);
    };

    const addUser = (user: Omit<User, 'id' | 'avatar'>) => {
        const newUser: User = { ...user, id: `u-${Date.now()}`, avatar: generateAvatar(user.name) };
        setUsers(prev => [...prev, newUser]);
    };

    const updateUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const deleteUser = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
    };
    
    const addSocialPost = (post: Omit<SocialPost, 'id' | 'postedAt'>) => {
        const newPost: SocialPost = { ...post, id: `sp-${Date.now()}`, postedAt: new Date().toISOString() };
        setSocialPosts(prev => [newPost, ...prev]);
    };

    // Re-added custom field CRUD operations
    const addCustomField = (name: string) => {
        const newField: CustomFieldDefinition = { id: `cfd-${Date.now()}`, name };
        setCustomFieldDefinitions(prev => [...prev, newField]);
        return newField;
    };

    const updateCustomField = (updatedField: CustomFieldDefinition) => {
        setCustomFieldDefinitions(prev => prev.map(f => f.id === updatedField.id ? updatedField : f));
        return updatedField;
    };

    const deleteCustomField = (id: string) => {
        setCustomFieldDefinitions(prev => prev.filter(f => f.id !== id));
    };


    return {
        contacts,
        messages,
        campaigns,
        campaignTemplates,
        groups,
        assets,
        users,
        socialPosts,
        customFieldDefinitions,
        addContact,
        updateContact,
        deleteContact,
        addMessage,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        addCampaignTemplate,
        updateCampaignTemplate,
        deleteCampaignTemplate,
        updateCampaignTemplateStatus,
        addGroup,
        updateGroup,
        deleteGroup,
        toggleContactInGroup,
        addAsset,
        addUser,
        updateUser,
        deleteUser,
        addSocialPost,
        addCustomField,
        updateCustomField,
        deleteCustomField,
        MOCK_INTEGRATIONS,
        facebookMessagesTotal,
        instagramMessagesTotal,
        whatsappIncomingMessagesTotal, // Added WhatsApp incoming messages total
        whatsappOutgoingMessagesTotal, // Added WhatsApp outgoing messages total
    };
};