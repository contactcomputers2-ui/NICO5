import React, { useState, useEffect } from 'react';
import { ApiSettings, CustomFieldDefinition } from '../types';
import ApiIcon from './icons/ApiIcon';
import WhatsappIcon from './icons/WhatsappIcon';
import KeyIcon from './icons/KeyIcon';
import SyncIcon from './icons/SyncIcon';
import CodeBracketIcon from './icons/CodeBracketIcon';
import DatabaseIcon from './icons/DatabaseIcon';
import ListBulletIcon from './icons/ListBulletIcon';
import BuildingOfficeIcon from './icons/BuildingOfficeIcon';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';

interface SettingsPageProps {
  currentSettings: ApiSettings;
  onSaveSettings: (settings: ApiSettings) => void;
  customFieldDefinitions: CustomFieldDefinition[];
  onAddCustomField: (name: string) => void;
  onUpdateCustomField: (field: CustomFieldDefinition) => void;
  onDeleteCustomField: (id: string) => void;
  customFieldsLoading: boolean; // Removed usage, kept for prop compatibility
  customFieldsError: string | null; // Removed usage, kept for prop compatibility
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  currentSettings,
  onSaveSettings,
  customFieldDefinitions,
  onAddCustomField,
  onUpdateCustomField,
  onDeleteCustomField,
  customFieldsLoading, // No longer used for rendering logic
  customFieldsError, // No longer used for rendering logic
}) => {
  const [localSettings, setLocalSettings] = useState<ApiSettings>(currentSettings);
  const [newCustomFieldName, setNewCustomFieldName] = useState('');
  const [editingCustomField, setEditingCustomField] = useState<CustomFieldDefinition | null>(null);

  useEffect(() => {
    setLocalSettings(currentSettings);
  }, [currentSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (name.startsWith('wahaSettings.')) {
      setLocalSettings(prev => ({
        ...prev,
        wahaSettings: {
          ...prev.wahaSettings,
          [name.split('.')[1]]: value,
        },
      }));
    } else if (name.startsWith('companyProfile.')) {
        setLocalSettings(prev => ({
            ...prev,
            companyProfile: {
                ...prev.companyProfile,
                [name.split('.')[1]]: value,
            },
        }));
    } else {
      setLocalSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(localSettings);
    alert('Settings saved successfully!');
  };

  const handleAddCustomField = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustomFieldName.trim()) {
      onAddCustomField(newCustomFieldName.trim());
      setNewCustomFieldName('');
    }
  };

  const handleUpdateCustomField = (id: string, newName: string) => {
    if (newName.trim() && editingCustomField && editingCustomField.id === id) {
        onUpdateCustomField({ ...editingCustomField, name: newName.trim() });
        setEditingCustomField(null);
    }
  };

  const handleToggleWahaConnection = () => {
    setLocalSettings(prev => ({
      ...prev,
      isConnected: !prev.isConnected, // Toggle connection status
    }));
  };

  return (
    <div className="space-y-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Application Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage API connections, company profile, and custom fields.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Company Profile */}
        <section>
          <div className="flex items-center space-x-3 text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
            <BuildingOfficeIcon className="w-6 h-6 text-gray-600" />
            <h2>Company Profile</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="companyProfile.name" className="block text-sm font-medium text-gray-700">Company Name</label>
              <input type="text" id="companyProfile.name" name="companyProfile.name" value={localSettings.companyProfile.name} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
            </div>
            <div>
              <label htmlFor="companyProfile.address" className="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" id="companyProfile.address" name="companyProfile.address" value={localSettings.companyProfile.address} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="companyProfile.website" className="block text-sm font-medium text-gray-700">Website</label>
              <input type="url" id="companyProfile.website" name="companyProfile.website" value={localSettings.companyProfile.website} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="companyProfile.logoUrl" className="block text-sm font-medium text-gray-700">Logo URL</label>
              <input type="url" id="companyProfile.logoUrl" name="companyProfile.logoUrl" value={localSettings.companyProfile.logoUrl} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
        </section>

        {/* WhatsApp API Settings */}
        <section>
          <div className="flex items-center space-x-3 text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
            <WhatsappIcon className="w-6 h-6 text-green-600" />
            <h2>WhatsApp API Settings (WAHA)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="wahaSettings.baseUrl" className="block text-sm font-medium text-gray-700">WAHA Base URL</label>
              <input type="url" id="wahaSettings.baseUrl" name="wahaSettings.baseUrl" value={localSettings.wahaSettings.baseUrl} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., https://your-waha-api.example.com" />
            </div>
            <div>
              <label htmlFor="wahaSettings.apiToken" className="block text-sm font-medium text-gray-700">API Token</label>
              <input type="password" id="wahaSettings.apiToken" name="wahaSettings.apiToken" value={localSettings.wahaSettings.apiToken} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="wahaSettings.sessionName" className="block text-sm font-medium text-gray-700">Session Name</label>
              <input type="text" id="wahaSettings.sessionName" name="wahaSettings.sessionName" value={localSettings.wahaSettings.sessionName} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., default" />
            </div>
            <div>
              <label htmlFor="wahaSettings.sessionNumber" className="block text-sm font-medium text-gray-700">WhatsApp Phone Number</label>
              <input type="tel" id="wahaSettings.sessionNumber" name="wahaSettings.sessionNumber" value={localSettings.wahaSettings.sessionNumber} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 15551234567" />
            </div>
          </div>
          <div className="mt-6 flex items-center space-x-4">
            <button
              type="button"
              onClick={handleToggleWahaConnection}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${localSettings.isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${localSettings.isConnected ? 'focus:ring-red-500' : 'focus:ring-green-500'}`}
            >
              <SyncIcon className="w-5 h-5 mr-2" />
              {localSettings.isConnected ? 'Disconnect WAHA' : 'Connect WAHA'}
            </button>
            <span className={`text-sm font-medium ${localSettings.isConnected ? 'text-green-700' : 'text-red-700'}`}>
              Status: {localSettings.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </section>

        {/* Removed Supabase Settings section entirely */}

        {/* Gemini API Key section removed as per Dyad compatibility guidelines */}
        {/*
        <section>
          <div className="flex items-center space-x-3 text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
            <ApiIcon className="w-6 h-6 text-purple-600" />
            <h2>Gemini API Settings</h2>
          </div>
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">Gemini API Key</label>
            <input type="password" id="apiKey" name="apiKey" value={localSettings.apiKey} onChange={handleChange} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            <p className="mt-2 text-xs text-gray-500">
              This key is used for AI-powered features like message generation and reply suggestions.
              It will be securely passed to your Deno backend functions.
            </p>
          </div>
        </section>
        */}

        {/* Custom Field Definitions */}
        <section>
          <div className="flex items-center space-x-3 text-lg font-semibold text-gray-800 border-b pb-3 mb-4">
            <ListBulletIcon className="w-6 h-6 text-teal-600" />
            <h2>Custom Field Definitions</h2>
          </div>
          {/* Removed customFieldsError check */}
          {/* Removed customFieldsLoading check */}
          <div className="space-y-3">
              {customFieldDefinitions.length === 0 && <p className="text-sm text-gray-500">No custom fields defined yet.</p>}
              {customFieldDefinitions.map(field => (
                <div key={field.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200">
                  {editingCustomField?.id === field.id ? (
                      <input
                          type="text"
                          value={editingCustomField.name}
                          onChange={(e) => setEditingCustomField(prev => prev ? { ...prev, name: e.target.value } : null)}
                          onBlur={(e) => handleUpdateCustomField(field.id, e.target.value)}
                          onKeyPress={(e) => { if (e.key === 'Enter') handleUpdateCustomField(field.id, (e.target as HTMLInputElement).value); }}
                          className="flex-1 mr-2 bg-white border border-gray-300 rounded-md py-1 px-2 text-sm text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          autoFocus
                      />
                  ) : (
                      <span className="text-sm font-medium text-gray-800">{field.name}</span>
                  )}
                  <div className="flex space-x-2">
                    <button type="button" onClick={() => setEditingCustomField(field)} className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100">
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => { if (window.confirm(`Are you sure you want to delete "${field.name}"? This will not remove data from existing contacts.`)) onDeleteCustomField(field.id); }} className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          <div className="mt-4 flex space-x-2">
            <input
              type="text"
              placeholder="New custom field name"
              value={newCustomFieldName}
              onChange={e => setNewCustomFieldName(e.target.value)}
              className="flex-1 block bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <button type="button" onClick={handleAddCustomField} className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <PlusIcon className="w-5 h-5 mr-2" /> Add Field
            </button>
          </div>
        </section>

        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;