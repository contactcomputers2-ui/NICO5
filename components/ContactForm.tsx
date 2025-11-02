
import React, { useState, useEffect } from 'react';
import { Contact, Group, CustomFieldDefinition } from '../types';
import { generateAvatar } from '../utils/avatarGenerator'; // Import the utility

interface ContactFormProps {
  contact?: Contact | null;
  onSave: (contact: Omit<Contact, 'avatar' | 'lastSeen'> | Contact) => void;
  onCancel: () => void;
  availableGroups: Group[]; // Not directly used in this form, but kept for consistency if it were needed for group assignment here
  customFieldDefinitions: CustomFieldDefinition[];
}

const ContactForm: React.FC<ContactFormProps> = ({
  contact,
  onSave,
  onCancel,
  availableGroups, // eslint-disable-line @typescript-eslint/no-unused-vars
  customFieldDefinitions,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [customFields, setCustomFields] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setPhone(contact.phone);
      setTags(contact.tags || []);
      setCustomFields(contact.customFields || {});
    } else {
      setName('');
      setPhone('');
      setTags([]);
      setCustomFields({});
    }
  }, [contact]);

  const handleAddTag = () => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCustomFieldChange = (fieldName: string, value: string) => {
    setCustomFields(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      const contactData: Omit<Contact, 'avatar' | 'lastSeen'> | Contact = {
        name,
        phone,
        tags,
        customFields,
        // When adding, id, avatar, lastSeen are handled by the service/mock data.
        // When editing, they are preserved.
        ...(contact && { id: contact.id, avatar: contact.avatar, lastSeen: contact.lastSeen }),
      };
      onSave(contactData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
        <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
      </div>

      {/* Tags Input */}
      <div>
        <label htmlFor="newTag" className="block text-sm font-medium text-gray-700">Tags</label>
        <div className="mt-1 flex flex-wrap gap-2 mb-2">
          {tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
              {tag}
              <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 -mr-0.5 h-4 w-4 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200">
                &times;
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            id="newTag"
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            onKeyPress={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
            placeholder="Add a tag"
            className="flex-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button type="button" onClick={handleAddTag} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Add</button>
        </div>
      </div>

      {/* Custom Fields Input */}
      {customFieldDefinitions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Custom Fields</h3>
          {customFieldDefinitions.map(field => (
            <div key={field.id}>
              <label htmlFor={`custom-field-${field.id}`} className="block text-sm font-medium text-gray-700">
                {field.name}
              </label>
              <input
                type="text"
                id={`custom-field-${field.id}`}
                value={customFields[field.name] || ''}
                onChange={e => handleCustomFieldChange(field.name, e.target.value)}
                className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter ${field.name}`}
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Save Contact</button>
      </div>
    </form>
  );
};

export default ContactForm;
