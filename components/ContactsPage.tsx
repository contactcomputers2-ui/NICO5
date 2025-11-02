


import React, { useState, useEffect, useMemo } from 'react';
import { Contact, Group, CustomFieldDefinition } from '../types';
import Modal from './Modal';
import ContactForm from './ContactForm';
import ContactDetailPanel from './ContactDetailPanel';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import ChatIcon from './icons/ChatIcon';
import FilterIcon from './icons/FilterIcon';
import SearchIcon from './icons/SearchIcon';
import ImportIcon from './icons/ImportIcon'; // Assuming there's an ImportIcon

interface ContactsPageProps {
  contacts: Contact[];
  groups: Group[]; // All groups to show which ones a contact belongs to
  customFieldDefinitions: CustomFieldDefinition[];
  onAdd: (contact: Omit<Contact, 'id' | 'avatar' | 'lastSeen'>) => Promise<void>;
  onUpdate: (contact: Contact) => Promise<void>;
  onDelete: (contactId: string) => Promise<void>;
  onGoToChat: (contactId: string) => void;
  onToggleContactInGroup: (contactId: string, groupId: string) => void;
  setNavigationView: (view: string, payload: any) => void;
  contactsLoading: boolean; // Removed usage, kept for prop compatibility
  contactsError: string | null; // Removed usage, kept for prop compatibility
}

const ContactsPage: React.FC<ContactsPageProps> = ({
  contacts,
  groups,
  customFieldDefinitions,
  onAdd,
  onUpdate,
  onDelete,
  onGoToChat,
  setNavigationView,
  contactsLoading, // No longer used for rendering logic
  contactsError, // No longer used for rendering logic
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState<string | null>(null);

  // Derived state for available tags for filtering
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    contacts.forEach(contact => {
      contact.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [contacts]);

  // Handle initial filter from navigation (e.g., from SegmentsPage)
  useEffect(() => {
    if (contacts[0]?.filter?.tag) { // Assuming filter comes from initial load or prop
      setFilterTag(contacts[0].filter.tag);
      // Remove the filter property from the contact if it's just for initial navigation
      // This is a bit of a hack, ideal would be to pass filter directly as a prop
      // For now, if we update the contact, the filter will naturally disappear.
    }
  }, [contacts]);


  const filteredContacts = useMemo(() => {
    let currentContacts = contacts;

    if (filterTag) {
      currentContacts = currentContacts.filter(contact => contact.tags.includes(filterTag));
    }

    if (searchTerm) {
      return currentContacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm) ||
        contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return currentContacts;
  }, [contacts, searchTerm, filterTag]);

  const handleOpenModalForCreate = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleCloseDetailPanel = () => {
    setSelectedContact(null);
  };

  const handleSaveContact = async (contactData: Omit<Contact, 'avatar' | 'lastSeen'> | Contact) => {
    if ('id' in contactData && contactData.id) {
      await onUpdate(contactData as Contact);
    } else {
      await onAdd(contactData as Omit<Contact, 'id' | 'avatar' | 'lastSeen'>);
    }
    handleCloseModal();
  };

  const handleDeleteContact = async (contactId: string) => {
    if (window.confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      await onDelete(contactId);
      if (selectedContact?.id === contactId) {
        handleCloseDetailPanel();
      }
    }
  };

  const handleGoToChatFromDetails = (contactId: string) => {
    onGoToChat(contactId);
    handleCloseDetailPanel(); // Close the detail panel when navigating to chat
  };

  const getContactGroups = (contactId: string) => {
    return groups.filter(group => group.contactIds.includes(contactId));
  };

  // Removed loading and error display as data is now managed internally
  // if (contactsLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-full text-gray-500">
  //       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  //         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
  //         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  //       </svg>
  //       Loading contacts...
  //     </div>
  //   );
  // }

  // if (contactsError) {
  //   return (
  //     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
  //       <strong className="font-bold">Error!</strong>
  //       <span className="block sm:inline"> {contactsError}</span>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Contacts</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => alert('Import functionality not implemented.')}
            className="flex items-center bg-white hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-lg border border-gray-300 transition-colors"
          >
            <ImportIcon className="w-5 h-5 mr-2" />
            Import
          </button>
          <button
            onClick={handleOpenModalForCreate}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Contact
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, phone, or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="relative">
              <select
                value={filterTag || ''}
                onChange={(e) => setFilterTag(e.target.value === '' ? null : e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none bg-white"
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag} className="capitalize">{tag}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FilterIcon className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map(contact => (
                    <tr key={contact.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetails(contact)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={contact.avatar} alt={contact.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{contact.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.map(tag => (
                            <span key={tag} className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(contact.lastSeen).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 items-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleOpenModalForEdit(contact); }}
                            className="p-1 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100"
                            title="Edit contact"
                          >
                            <EditIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteContact(contact.id); }}
                            className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                            title="Delete contact"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onGoToChat(contact.id); }}
                            className="p-1 text-gray-500 hover:text-green-600 rounded-full hover:bg-gray-100"
                            title="Chat with contact"
                          >
                            <ChatIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      No contacts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingContact ? 'Edit Contact' : 'Add New Contact'}>
        <ContactForm
          contact={editingContact}
          onSave={handleSaveContact}
          onCancel={handleCloseModal}
          availableGroups={groups}
          customFieldDefinitions={customFieldDefinitions}
        />
      </Modal>

      {selectedContact && (
        <ContactDetailPanel
          contact={selectedContact}
          groups={getContactGroups(selectedContact.id)}
          messages={[]} // Assuming messages are fetched separately or not needed here
          onClose={handleCloseDetailPanel}
          onEdit={handleOpenModalForEdit}
          onGoToChat={handleGoToChatFromDetails}
        />
      )}
    </div>
  );
};

export default ContactsPage;