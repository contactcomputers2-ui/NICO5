
import React, { useState } from 'react';
import { Group, Contact } from '../types';
import Modal from './Modal';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';
import ContactsIcon from './icons/ContactsIcon';

interface GroupsPageProps {
  groups: Group[];
  contacts: Contact[];
  onAddGroup: (group: Omit<Group, 'id'>) => void;
  onUpdateGroup: (group: Group) => void;
  onDeleteGroup: (groupId: string) => void;
}

const GroupForm: React.FC<{
  group?: Group | null;
  onSave: (group: Omit<Group, 'id' | 'contactIds'> | Group) => void;
  onCancel: () => void;
}> = ({ group, onSave, onCancel }) => {
  const [name, setName] = useState(group?.name || '');
  const [description, setDescription] = useState(group?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      onSave({ ...group, id: group?.id || '', name, description });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="group-name" className="block text-sm font-medium text-gray-700">Group Name</label>
        <input type="text" id="group-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
      </div>
       <div>
        <label htmlFor="group-description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="group-description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Save Group</button>
      </div>
    </form>
  );
};

const ManageMembersModal: React.FC<{
    group: Group;
    allContacts: Contact[];
    onUpdateGroup: (group: Group) => void;
    onClose: () => void;
}> = ({ group, allContacts, onUpdateGroup, onClose }) => {
    const [selectedContactIds, setSelectedContactIds] = useState(group.contactIds);

    const handleToggleContact = (contactId: string) => {
        setSelectedContactIds(prev => 
            prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]
        );
    };

    const handleSave = () => {
        onUpdateGroup({ ...group, contactIds: selectedContactIds });
        onClose();
    };
    
    return (
        <Modal isOpen={true} onClose={onClose} title={`Manage Members for "${group.name}"`}>
           <div className="space-y-4">
               <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-2">
                   {allContacts.map(contact => (
                       <div key={contact.id} className="flex items-center p-1 rounded-md hover:bg-gray-100">
                           <input
                               id={`contact-member-${contact.id}`}
                               type="checkbox"
                               checked={selectedContactIds.includes(contact.id)}
                               onChange={() => handleToggleContact(contact.id)}
                               className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                           />
                            <label htmlFor={`contact-member-${contact.id}`} className="ml-3 flex items-center cursor-pointer">
                                <img src={contact.avatar} alt={contact.name} className="w-8 h-8 rounded-full mr-3"/>
                                <span className="text-sm text-gray-700">{contact.name}</span>
                            </label>
                       </div>
                   ))}
               </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300">Cancel</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Save Changes</button>
                </div>
           </div>
        </Modal>
    );
};

const GroupsPage: React.FC<GroupsPageProps> = ({ groups, contacts, onAddGroup, onUpdateGroup, onDeleteGroup }) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [managingMembersGroup, setManagingMembersGroup] = useState<Group | null>(null);

  const handleOpenModalForCreate = () => {
    setEditingGroup(null);
    setIsFormModalOpen(true);
  };

  const handleOpenModalForEdit = (group: Group) => {
    setEditingGroup(group);
    setIsFormModalOpen(true);
  };

  const handleSaveGroup = (groupData: Omit<Group, 'id' | 'contactIds'> | Group) => {
    if ('id' in groupData && groupData.id) {
        onUpdateGroup(groupData as Group);
    } else {
        onAddGroup({ ...groupData, contactIds: []});
    }
    setIsFormModalOpen(false);
  };
  
  const handleDeleteGroup = (groupId: string) => {
      if (window.confirm('Are you sure you want to delete this group? Contacts will not be deleted.')) {
          onDeleteGroup(groupId);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Groups & Communities</h1>
        <button
          onClick={handleOpenModalForCreate}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
              <div key={group.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{group.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 h-10">{group.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-4">
                       <ContactsIcon className="w-4 h-4 mr-2" />
                       {group.contactIds.length} members
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                     <button onClick={() => setManagingMembersGroup(group)} className="text-sm font-medium text-blue-600 hover:text-blue-800">Manage Members</button>
                     <button onClick={() => handleOpenModalForEdit(group)} className="p-1 text-gray-500 hover:text-blue-600"><EditIcon className="w-5 h-5" /></button>
                     <button onClick={() => handleDeleteGroup(group.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                  </div>
              </div>
          ))}
      </div>

      {isFormModalOpen && (
        <Modal 
            isOpen={isFormModalOpen} 
            onClose={() => setIsFormModalOpen(false)} 
            title={editingGroup ? "Edit Group" : "Create New Group"}
        >
            <GroupForm 
                group={editingGroup} 
                onSave={handleSaveGroup} 
                onCancel={() => setIsFormModalOpen(false)} 
            />
        </Modal>
      )}

      {managingMembersGroup && (
          <ManageMembersModal
            group={managingMembersGroup}
            allContacts={contacts}
            onUpdateGroup={onUpdateGroup}
            onClose={() => setManagingMembersGroup(null)}
          />
      )}
    </div>
  );
};

export default GroupsPage;