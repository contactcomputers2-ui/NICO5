import React, { useState, useEffect } from 'react';
import { User } from '../types';
import Modal from './Modal';
import PlusIcon from './icons/PlusIcon';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';

interface UsersPageProps {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'avatar'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
}

const UserForm: React.FC<{
  user?: User | null;
  onSave: (user: Omit<User, 'id' | 'avatar'> | User) => void;
  onCancel: () => void;
}> = ({ user, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Admin' | 'Agent' | 'Manager'>('Agent');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setStatus(user.status);
    } else {
      setName('');
      setEmail('');
      setRole('Agent');
      setStatus('Active');
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
        const userData = { name, email, role, status };
        if (user) {
             onSave({ ...user, ...userData });
        } else {
            onSave(userData);
        }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="user-name" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input type="text" id="user-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
      </div>
      <div>
        <label htmlFor="user-email" className="block text-sm font-medium text-gray-700">Email Address</label>
        <input type="email" id="user-email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
      </div>
      <div>
        <label htmlFor="user-role" className="block text-sm font-medium text-gray-700">Role</label>
        <select id="user-role" value={role} onChange={e => setRole(e.target.value as User['role'])} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          <option>Admin</option>
          <option>Manager</option>
          <option>Agent</option>
        </select>
      </div>
       <div>
        <label htmlFor="user-status" className="block text-sm font-medium text-gray-700">Status</label>
        <select id="user-status" value={status} onChange={e => setStatus(e.target.value as User['status'])} className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Save User</button>
      </div>
    </form>
  );
};


const UsersPage: React.FC<UsersPageProps> = ({ users, addUser, updateUser, deleteUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleOpenModalForCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = (userData: Omit<User, 'id' | 'avatar'> | User) => {
    if ('id' in userData && userData.id) {
        updateUser(userData as User);
    } else {
        addUser(userData as Omit<User, 'id' | 'avatar'>);
    }
    handleCloseModal();
  };
  
  const handleDeleteUser = (userId: string) => {
      if (window.confirm('Are you sure you want to delete this user?')) {
          deleteUser(userId);
      }
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-200 text-gray-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={handleOpenModalForCreate}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New User
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button onClick={() => handleOpenModalForEdit(user)} className="p-1 text-gray-500 hover:text-blue-600"><EditIcon className="w-5 h-5" /></button>
                    <button onClick={() => handleDeleteUser(user.id)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-5 h-5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingUser ? "Edit User" : "Create New User"}
      >
        <UserForm 
            user={editingUser}
            onSave={handleSaveUser} 
            onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default UsersPage;
