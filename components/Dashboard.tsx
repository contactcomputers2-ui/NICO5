import React from 'react';
import { Contact, Campaign, User, Integration } from '../types';
import StatCard from './StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ContactsIcon from './icons/ContactsIcon';
import BroadcastIcon from './icons/BroadcastIcon';
import TemplateIcon from './icons/TemplateIcon';
import UserManagementIcon from './icons/UserManagementIcon';
import UserCircleIcon from './icons/UserCircleIcon';
import IntegrationsIcon from './icons/IntegrationsIcon';
import FacebookIcon from './icons/FacebookIcon';
import InstagramIcon from './icons/InstagramIcon';
import WhatsappIcon from './icons/WhatsappIcon'; // New import for WhatsApp Icon
import Card from './Card'; // Import the new Card component
import CloseIcon from './icons/CloseIcon'; // Import CloseIcon for dismiss button

interface DashboardProps {
  contacts: Contact[];
  campaigns: Campaign[];
  users: User[];
  integrations: Integration[];
  facebookMessagesTotal: number;
  instagramMessagesTotal: number;
  whatsappIncomingMessagesTotal: number; // New prop
  whatsappOutgoingMessagesTotal: number; // New prop
  showWelcomeMessage: boolean; // New prop for welcome message visibility
  onDismissWelcomeMessage: () => void; // New prop to dismiss welcome message
}

const Dashboard: React.FC<DashboardProps> = ({ 
  contacts, 
  campaigns, 
  users, 
  integrations, 
  facebookMessagesTotal, 
  instagramMessagesTotal,
  whatsappIncomingMessagesTotal, // Destructure new prop
  whatsappOutgoingMessagesTotal, // Destructure new prop
  showWelcomeMessage,
  onDismissWelcomeMessage,
}) => {
  const totalContacts = contacts.length;
  const campaignsSent = campaigns.filter(c => c.status === 'Sent').length;
  const scheduledCampaigns = campaigns.filter(c => c.status === 'Scheduled').length;
  const draftCampaigns = campaigns.filter(c => c.status === 'Draft').length;
  const activeAndScheduled = campaignsSent + scheduledCampaigns;

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  
  const activeIntegrationsCount = integrations.filter(i => i.isConnected).length;
  
  const recentCampaigns = [...campaigns].sort((a, b) => new Date(b.sentDate || b.scheduledDate || b.id).getTime() - new Date(a.sentDate || a.scheduledDate || a.id).getTime()).slice(0, 5);
  const recentContacts = [...contacts].sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()).slice(0, 5);
  
  const campaignStatusData = [
    { name: 'Sent', count: campaignsSent, fill: '#2563eb' },
    { name: 'Scheduled', count: scheduledCampaigns, fill: '#f59e0b' },
    { name: 'Draft', count: draftCampaigns, fill: '#6b7280' },
  ];

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'Sent': return 'bg-green-100 text-green-800';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Draft':
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back! Here's a snapshot of your CRM activity.</p>
      </div>

      {showWelcomeMessage && (
        <Card className="bg-blue-50 border-blue-200" headerActions={
          <button
            onClick={onDismissWelcomeMessage}
            className="p-1 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
            aria-label="Dismiss welcome message"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        }>
          <div className="flex items-center space-x-4">
            <UserCircleIcon className="w-10 h-10 text-blue-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-blue-800">Welcome to Contact Messaging CRM!</h2>
              <p className="text-blue-700 mt-1">
                Your powerful platform for managing contacts, campaigns, and customer conversations.
                Explore the sidebar to navigate through features like Chat, Campaigns, and Integrations.
                Need help? Click the ConBot icon at the bottom right!
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <StatCard 
            title="Total Contacts" 
            value={totalContacts.toString()} 
            change="+5 this week" 
            icon={ContactsIcon}
            accentColor="blue"
        />
        <StatCard 
            title="Active & Scheduled" 
            value={activeAndScheduled.toString()} 
            change={`${campaignsSent} Sent / ${scheduledCampaigns} Scheduled`} 
            icon={BroadcastIcon}
            accentColor="green"
        />
        <StatCard 
            title="Draft Campaigns" 
            value={draftCampaigns.toString()} 
            change="Awaiting action"
            icon={TemplateIcon}
            accentColor="amber"
        />
        <StatCard 
            title="Total Users" 
            value={totalUsers.toString()} 
            change="+1 this month" 
            icon={UserManagementIcon}
            accentColor="purple"
        />
        <StatCard 
            title="Active Users" 
            value={activeUsers.toString()} 
            change={`${activeUsers} of ${totalUsers} active`}
            icon={UserCircleIcon}
            accentColor="teal"
        />
        <StatCard
            title="Active Integrations"
            value={activeIntegrationsCount.toString()}
            change={`${integrations.length - activeIntegrationsCount} inactive`}
            icon={IntegrationsIcon}
            accentColor="purple"
        />
      </div>

      {/* New Messaging Overview Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Messaging Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Bigger WhatsApp Incoming Card */}
          <Card className="lg:col-span-1 flex flex-col items-center justify-center p-6 bg-green-50">
            <WhatsappIcon className="w-12 h-12 text-green-700 mb-3" />
            <p className="text-xl font-semibold text-green-800">WhatsApp Incoming</p>
            <p className="text-5xl font-extrabold text-green-900 mt-2">
              {whatsappIncomingMessagesTotal.toLocaleString()}
            </p>
            <p className="text-sm font-medium text-green-700 mt-1">Total incoming messages</p>
          </Card>

          {/* Bigger WhatsApp Outgoing Card */}
          <Card className="lg:col-span-1 flex flex-col items-center justify-center p-6 bg-blue-50">
            <WhatsappIcon className="w-12 h-12 text-blue-700 mb-3" />
            <p className="text-xl font-semibold text-blue-800">WhatsApp Outgoing</p>
            <p className="text-5xl font-extrabold text-blue-900 mt-2">
              {whatsappOutgoingMessagesTotal.toLocaleString()}
            </p>
            <p className="text-sm font-medium text-blue-700 mt-1">Total outgoing messages</p>
          </Card>

          {/* Facebook Messages StatCard */}
          <StatCard
            title="Facebook Messages"
            value={facebookMessagesTotal.toLocaleString()}
            change="+120 this month"
            icon={FacebookIcon}
            accentColor="blue"
            className="md:col-span-1 lg:col-span-1"
          />

          {/* Instagram Messages StatCard */}
          <StatCard
            title="Instagram Messages"
            value={instagramMessagesTotal.toLocaleString()}
            change="+80 this month"
            icon={InstagramIcon}
            accentColor="pink"
            className="md:col-span-1 lg:col-span-1"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card title="Campaign Overview" className="lg:col-span-2">
            <div className="h-80 -mt-2 -mb-2"> {/* Adjust margins to fit padding of Card component */}
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={campaignStatusData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                        <Tooltip 
                            cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }} 
                            contentStyle={{ 
                                fontSize: 12, 
                                borderRadius: '0.75rem', 
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                            }}
                        />
                        <Bar dataKey="count" barSize={35} radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
        <Card title="Newest Contacts" className="lg:col-span-1">
            <ul className="divide-y divide-gray-200 -mt-2 -mb-2"> {/* Adjust margins to fit padding of Card component */}
                {recentContacts.length > 0 ? recentContacts.map(contact => (
                <li key={contact.id} className="py-3 flex items-center hover:bg-gray-50 transition-colors">
                    <img className="h-10 w-10 rounded-full" src={contact.avatar} alt={contact.name} />
                    <div className="ml-4 overflow-hidden">
                    <p className="font-medium text-sm text-gray-900 truncate">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.phone}</p>
                    </div>
                </li>
                )) : (
                    <li className="py-4 flex items-center justify-center text-center text-gray-500">No new contacts.</li>
                )}
            </ul>
        </Card>
      </div>

      <Card title="Recent Campaigns">
        <div className="overflow-x-auto -mt-2 -mb-2"> {/* Adjust margins to fit padding of Card component */}
            <table className="min-w-full">
            <tbody className="divide-y divide-gray-200">
                {recentCampaigns.length > 0 ? recentCampaigns.map(campaign => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                        <p className="font-medium text-sm text-gray-900">{campaign.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-md">{campaign.message}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                        </span>
                    </td>
                </tr>
                )) : (
                <tr><td className="p-6 text-center text-gray-500" colSpan={2}>No recent campaigns.</td></tr>
                )}
            </tbody>
            </table>
        </div>
      </Card>

    </div>
  );
};

export default Dashboard;