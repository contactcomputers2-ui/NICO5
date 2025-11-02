import React from 'react';
import FacebookIcon from './icons/FacebookIcon';
import InstagramIcon from './icons/InstagramIcon';
import WhatsappIcon from './icons/WhatsappIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import SageIcon from './icons/SageIcon';
import RbsIcon from './icons/RbsIcon';
import QuickbooksIcon from './icons/QuickbooksIcon';
import AzureIcon from './icons/AzureIcon';
import { Integration } from '../types'; // Import the Integration type

interface IntegrationCardProps {
    integration: Integration; // Use the Integration type
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ integration }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col">
        <div className="flex items-start">
            <div className="p-3 bg-gray-100 rounded-lg">
                <integration.icon className="w-8 h-8 text-gray-700" />
            </div>
            <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{integration.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{integration.description}</p>
            </div>
            <div className={`flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${integration.isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {integration.isConnected ? <CheckCircleIcon className="w-4 h-4 mr-1" /> : <XCircleIcon className="w-4 h-4 mr-1" />}
                {integration.isConnected ? 'Connected' : 'Not Connected'}
            </div>
        </div>
        <div className="mt-6">
            <button
                className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors ${integration.isConnected ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
                {integration.isConnected ? 'Disconnect' : 'Connect'}
            </button>
        </div>
    </div>
);

interface IntegrationsPageProps {
  integrations: Integration[]; // Accept integrations as a prop
}

const IntegrationsPage: React.FC<IntegrationsPageProps> = ({ integrations }) => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Integrations</h1>
                <p className="mt-1 text-sm text-gray-500">Connect your favorite apps to extend functionality.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map(integration => (
                    <IntegrationCard key={integration.name} integration={integration} />
                ))}
            </div>
        </div>
    );
};

export default IntegrationsPage;