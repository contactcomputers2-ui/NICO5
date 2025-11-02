import React, { useState, useMemo, useRef } from 'react';
import { Asset, FileAsset, FolderAsset } from '../types';
import Modal from './Modal';
import FolderIcon from './icons/FolderIcon';
import UploadIcon from './icons/UploadIcon';
import FileIcon from './icons/FileIcon';

interface AssetsPageProps {
  assets: Asset[];
  addAsset: (asset: Asset) => void;
}

const AssetsPage: React.FC<AssetsPageProps> = ({ assets, addAsset }) => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter assets for the current view
  const currentAssets = useMemo(() => {
    return assets.filter(asset => asset.parentId === currentFolderId).sort((a, b) => {
        if (a.type === 'folder' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
    });
  }, [assets, currentFolderId]);

  // Generate breadcrumbs for navigation
  const breadcrumbs = useMemo(() => {
    const crumbs: {id: string | null, name: string}[] = [{ id: null, name: 'Home' }];
    let parentId = currentFolderId;
    while (parentId) {
      const parent = assets.find(a => a.id === parentId && a.type === 'folder') as FolderAsset | undefined;
      if (parent) {
        crumbs.unshift({ id: parent.id, name: parent.name });
        parentId = parent.parentId;
      } else {
        break;
      }
    }
    return crumbs;
  }, [assets, currentFolderId]);

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      const newFolder: FolderAsset = {
        id: `folder-${Date.now()}`,
        type: 'folder',
        name: newFolderName.trim(),
        parentId: currentFolderId,
        createdAt: new Date().toISOString(),
      };
      addAsset(newFolder);
      setNewFolderName('');
      setIsFolderModalOpen(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of files) {
      const newFile: FileAsset = {
        id: `file-${Date.now()}-${file.name}`,
        type: 'file',
        name: file.name,
        // For images, we can generate a temporary preview URL that is valid for the session
        url: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
        size: file.size,
        fileType: file.type,
        parentId: currentFolderId,
        createdAt: new Date().toISOString(),
      };
      addAsset(newFile);
    }
    // Reset file input to allow uploading the same file again
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const renderAsset = (asset: Asset) => {
    if (asset.type === 'folder') {
      return (
        <div 
          key={asset.id} 
          className="group relative flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 hover:shadow-md transition-all"
          onDoubleClick={() => setCurrentFolderId(asset.id)}
        >
          <FolderIcon className="w-16 h-16 text-blue-500" />
          <p className="mt-2 text-sm font-medium text-gray-700 truncate w-full text-center">{asset.name}</p>
        </div>
      );
    }

    if (asset.type === 'file') {
      return (
        <div key={asset.id} className="group relative flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex-shrink-0 h-40 flex items-center justify-center bg-gray-100">
            {asset.url && asset.fileType.startsWith('image/') ? (
              <img src={asset.url} alt={asset.name} className="h-full w-full object-cover" />
            ) : (
              <FileIcon className="w-16 h-16 text-gray-400" />
            )}
          </div>
          <div className="p-3">
            <p className="text-sm font-medium text-gray-800 truncate" title={asset.name}>{asset.name}</p>
            <p className="text-xs text-gray-500">{(asset.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Assets Library</h1>
          <nav className="flex mt-2" aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-2 text-sm flex-wrap">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.id || 'home'}>
                  <div className="flex items-center">
                    {index > 0 && <span className="text-gray-400">/</span>}
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentFolderId(crumb.id);
                      }}
                      className="ml-2 font-medium text-gray-500 hover:text-gray-700"
                    >
                      {crumb.name}
                    </a>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>
        <div className="flex items-center space-x-2">
            <button
                onClick={() => setIsFolderModalOpen(true)}
                className="flex items-center bg-white hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-lg border border-gray-300 transition-colors"
            >
                <FolderIcon className="w-5 h-5 mr-2" />
                Create Folder
            </button>
            <button
                onClick={handleUploadClick}
                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                <UploadIcon className="w-5 h-5 mr-2" />
                Upload File
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {currentAssets.map(asset => renderAsset(asset))}
      </div>
      {currentAssets.length === 0 && (
          <div className="col-span-full text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
              <FolderIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">This folder is empty</h3>
              <p className="mt-1 text-sm text-gray-500">Upload a file or create a new folder.</p>
          </div>
      )}

      <Modal isOpen={isFolderModalOpen} onClose={() => setIsFolderModalOpen(false)} title="Create New Folder">
        <form onSubmit={handleCreateFolder} className="space-y-4">
            <div>
                <label htmlFor="folder-name" className="block text-sm font-medium text-gray-700">Folder Name</label>
                <input
                    type="text"
                    id="folder-name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    autoFocus
                />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => setIsFolderModalOpen(false)} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Create</button>
            </div>
        </form>
      </Modal>

    </div>
  );
};

export default AssetsPage;