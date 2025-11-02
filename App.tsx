import React, { useState, useEffect, useCallback } from 'react';
import { Contact, Message, Campaign, CampaignTemplate, Group, Asset, User, CustomFieldDefinition, ApiSettings, SocialPost, Integration, ConBotMessage } from './types';
import { useMockData, MOCK_INTEGRATIONS } from './hooks/useMockData';
import { Sidebar } from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
// Fix: ChatPage is a default export
import ChatPage from './components/ChatPage';
import CampaignsPage from './components/CampaignsPage';
import TemplatesPage from './components/TemplatesPage';
import BroadcastingPage from './components/BroadcastingPage';
import SettingsPage from './components/SettingsPage';
import SegmentsPage from './components/SegmentsPage';
import GroupsPage from './components/GroupsPage';
import AssetsPage from './components/AssetsPage';
// Fix: ContactsPage is a default export
import ContactsPage from './components/ContactsPage';
import UsersPage from './components/UsersPage';
import IntegrationsPage from './components/IntegrationsPage';
import SocialPostingPage from './components/SocialPostingPage';
import ReportsPage from './components/ReportsPage';
import ConBotChat from './components/ConBotChat';
import BotIcon from './components/icons/BotIcon';


function App() {
  const {
    contacts, addContact, updateContact, deleteContact, // Now managed by useMockData
    customFieldDefinitions, addCustomField, updateCustomField, deleteCustomField, // Now managed by useMockData
    messages, addMessage,
    campaigns, addCampaign, updateCampaign, deleteCampaign,
    campaignTemplates, addCampaignTemplate, updateCampaignTemplate, deleteCampaignTemplate, updateCampaignTemplateStatus,
    groups, addGroup, updateGroup, deleteGroup, toggleContactInGroup,
    assets, addAsset,
    users, addUser, updateUser, deleteUser,
    socialPosts, addSocialPost,
    facebookMessagesTotal, instagramMessagesTotal,
    whatsappIncomingMessagesTotal, // New
    whatsappOutgoingMessagesTotal, // New
  } = useMockData();

  const [activeView, setActiveView] = useState('Dashboard');
  const [initialContactIdForChat, setInitialContactIdForChat] = useState<string | null>(null);
  const [isConBotOpen, setIsConBotOpen] = useState(false);
  const [conBotMessages, setConBotMessages] = useState<ConBotMessage[]>([]);
  const [showDashboardWelcome, setShowDashboardWelcome] = useState(true);

  // Gemini API Key from environment (Dyad compatibility)
  const geminiApiKey = process.env.API_KEY || '';

  // API Settings
  const [apiSettings, setApiSettings] = useState<ApiSettings>({
    phoneId: '1234567890',
    isConnected: false,
    wahaSettings: {
      sessionName: 'default',
      sessionNumber: '',
      apiToken: '',
      baseUrl: '',
    },
    licenseKey: 'DEMO-LICENSE-KEY',
    coexistenceEnabled: false,
    companyProfile: {
      name: 'Acme Inc.',
      address: '123 Main St, Anytown, USA',
      website: 'https://www.acme.com',
      logoUrl: 'https://www.acme.com/logo.png',
    },
  });

  const handleAddContact = async (newContact: Omit<Contact, 'id' | 'avatar' | 'lastSeen'>) => {
    try {
      addContact(newContact); // Use mock data function
    } catch (error: any) {
      console.error("Error adding contact:", error);
      alert("Failed to add contact. " + error.message);
    }
  };

  const handleUpdateContact = async (updatedContact: Contact) => {
    try {
      updateContact(updatedContact); // Use mock data function
    } catch (error: any) {
      console.error("Error updating contact:", error);
      alert("Failed to update contact. " + error.message);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      deleteContact(contactId); // Use mock data function
    } catch (error: any) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact. " + error.message);
    }
  };

  const handleAddCustomField = async (name: string) => {
    try {
      addCustomField(name); // Use mock data function
    } catch (error: any) {
      console.error("Error adding custom field:", error);
      alert("Failed to add custom field. " + error.message);
    }
  };

  const handleUpdateCustomField = async (field: CustomFieldDefinition) => {
    try {
      updateCustomField(field); // Use mock data function
    } catch (error: any) {
      console.error("Error updating custom field:", error);
      alert("Failed to update custom field. " + error.message);
    }
  };

  const handleDeleteCustomField = async (id: string) => {
    try {
      deleteCustomField(id); // Use mock data function
    } catch (error: any) {
      console.error("Error deleting custom field:", error);
      alert("Failed to delete custom field. " + error.message);
    }
  };

  const setNavigationView = (view: string, payload?: any) => {
    setActiveView(view);
    if (view === 'Chat' && payload?.contactId) {
      setInitialContactIdForChat(payload.contactId);
    } else {
      setInitialContactIdForChat(null);
    }
    // For Contacts page with a filter
    if (view === 'Contacts' && payload?.filter) {
      // This will be handled by ContactsPage internal state on prop change
    }
  };

  const handleConBotNavigation = (viewName: string) => {
    const capitalizedViewName = viewName.charAt(0).toUpperCase() + viewName.slice(1);
    const validViews = ['Dashboard', 'Chat', 'Reports', 'Contacts', 'Segments', 'Groups', 'Campaigns', 'WhatsApp Broadcasting', 'Social Posting', 'Templates', 'Assets', 'Users', 'Integrations', 'Settings'];

    if (validViews.includes(capitalizedViewName)) {
      setActiveView(capitalizedViewName);
      setConBotMessages(prev => [...prev, {
        id: String(Date.now()),
        sender: 'bot',
        text: `Navigating to the ${capitalizedViewName} page.`,
        timestamp: new Date().toISOString(),
      }]);
      setIsConBotOpen(false); // Close ConBot after navigation
      return true;
    } else {
      setConBotMessages(prev => [...prev, {
        id: String(Date.now()),
        sender: 'bot',
        text: `I can't find a page named "${viewName}". Please try one of the available options.`,
        timestamp: new Date().toISOString(),
      }]);
      return false;
    }
  };

  const addConBotMessage = (message: ConBotMessage) => {
    setConBotMessages(prev => [...prev, message]);
  };

  const integrations: Integration[] = MOCK_INTEGRATIONS; // Use mock integrations for now

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeView={activeView} setActiveView={setNavigationView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={activeView} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {activeView === 'Dashboard' && (
            <Dashboard
              contacts={contacts}
              campaigns={campaigns}
              users={users}
              integrations={integrations}
              facebookMessagesTotal={facebookMessagesTotal}
              instagramMessagesTotal={instagramMessagesTotal}
              whatsappIncomingMessagesTotal={whatsappIncomingMessagesTotal} // New prop
              whatsappOutgoingMessagesTotal={whatsappOutgoingMessagesTotal} // New prop
              showWelcomeMessage={showDashboardWelcome}
              onDismissWelcomeMessage={() => setShowDashboardWelcome(false)}
            />
          )}
          {activeView === 'Chat' && (
            <ChatPage
              contacts={contacts}
              messages={messages}
              addMessage={addMessage}
              initialContactId={initialContactIdForChat}
              onChatOpened={() => setInitialContactIdForChat(null)}
              settings={apiSettings}
              geminiApiKey={geminiApiKey} // Pass API key to ChatPage for suggestions
            />
          )}
          {activeView === 'Reports' && (
            <ReportsPage />
          )}
          {activeView === 'Contacts' && (
            <ContactsPage
              contacts={contacts}
              groups={groups}
              customFieldDefinitions={customFieldDefinitions}
              onAdd={handleAddContact}
              onUpdate={handleUpdateContact}
              onDelete={handleDeleteContact}
              onGoToChat={contactId => setNavigationView('Chat', { contactId })}
              onToggleContactInGroup={toggleContactInGroup}
              setNavigationView={setNavigationView}
              contactsLoading={false} // No longer loading from Supabase
              contactsError={null} // No longer errors from Supabase
            />
          )}
          {activeView === 'Segments' && (
            <SegmentsPage setNavigationView={setNavigationView} />
          )}
          {activeView === 'Groups' && (
            <GroupsPage
              groups={groups}
              contacts={contacts}
              onAddGroup={addGroup}
              onUpdateGroup={updateGroup}
              onDeleteGroup={deleteGroup}
            />
          )}
          {activeView === 'Campaigns' && (
            <CampaignsPage
              campaigns={campaigns}
              contacts={contacts}
              addCampaign={addCampaign}
              updateCampaign={updateCampaign}
              deleteCampaign={deleteCampaign}
              campaignTemplates={campaignTemplates}
              addCampaignTemplate={addCampaignTemplate}
              updateCampaignTemplateStatus={updateCampaignTemplateStatus}
            />
          )}
          {activeView === 'WhatsApp Broadcasting' && (
            <BroadcastingPage
              templates={campaignTemplates}
              contacts={contacts}
              addCampaign={addCampaign}
              isConnected={apiSettings.isConnected}
            />
          )}
          {activeView === 'Social Posting' && (
            <SocialPostingPage
              addSocialPost={addSocialPost}
              companyProfile={apiSettings.companyProfile}
            />
          )}
          {activeView === 'Templates' && (
            <TemplatesPage
              templates={campaignTemplates}
              onAdd={addCampaignTemplate}
              onUpdate={updateCampaignTemplate}
              onDelete={deleteCampaignTemplate}
              onUpdateStatus={updateCampaignTemplateStatus}
            />
          )}
          {activeView === 'Assets' && (
            <AssetsPage
              assets={assets}
              addAsset={addAsset}
            />
          )}
          {activeView === 'Users' && (
            <UsersPage
              users={users}
              addUser={addUser}
              updateUser={updateUser}
              deleteUser={deleteUser}
            />
          )}
          {activeView === 'Integrations' && (
            <IntegrationsPage integrations={integrations} />
          )}
          {activeView === 'Settings' && (
            <SettingsPage
              currentSettings={apiSettings}
              onSaveSettings={setApiSettings}
              customFieldDefinitions={customFieldDefinitions}
              onAddCustomField={handleAddCustomField}
              onUpdateCustomField={handleUpdateCustomField}
              onDeleteCustomField={handleDeleteCustomField}
              customFieldsLoading={false} // No longer loading from Supabase
              customFieldsError={null} // No longer errors from Supabase
            />
          )}
        </main>
      </div>

      {isConBotOpen && (
        <ConBotChat
          isOpen={isConBotOpen}
          onClose={() => setIsConBotOpen(false)}
          messages={conBotMessages}
          addMessage={addConBotMessage}
          onNavigate={handleConBotNavigation}
          geminiApiKey={geminiApiKey}
        />
      )}
      <button
        onClick={() => setIsConBotOpen(!isConBotOpen)}
        className={`fixed bottom-4 right-4 z-50 flex items-center justify-center p-3 w-16 h-16 rounded-full shadow-lg transition-all duration-300 ease-in-out
          ${isConBotOpen ? 'bg-blue-800 hover:bg-blue-900' : 'bg-blue-600 hover:bg-blue-700'}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100
          text-white text-sm font-semibold
        `}
        aria-label={isConBotOpen ? "Close ConBot Chat" : "Open ConBot Chat"}
      >
        <BotIcon className="w-8 h-8" />
        <span className="hidden md:block absolute bottom-full mb-2 p-1 px-2 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
          ConBot
        </span>
      </button>
    </div>
  );
}

export default App;