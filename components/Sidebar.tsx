import React, { useState } from 'react';
import DashboardIcon from './icons/DashboardIcon';
import ContactsIcon from './icons/ContactsIcon';
import ChatIcon from './icons/ChatIcon';
import CampaignsIcon from './icons/CampaignsIcon';
import SettingsIcon from './icons/SettingsIcon';
import TemplateIcon from './icons/TemplateIcon';
import BroadcastIcon from './icons/BroadcastIcon';
import IntegrationsIcon from './icons/IntegrationsIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import SegmentsIcon from './icons/SegmentsIcon';
import GroupsIcon from './icons/GroupsIcon';
// Removed: AudienceIcon is replaced by the custom logo
import FolderIcon from './icons/FolderIcon';
import UserManagementIcon from './icons/UserManagementIcon';
import PhotoIcon from './icons/PhotoIcon';
import ReportsIcon from './icons/ReportsIcon'; // New import for Reports icon

type NavItem = {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

const mainNavItems: NavItem[] = [
  { name: 'Dashboard', icon: DashboardIcon },
  { name: 'Chat', icon: ChatIcon },
  { name: 'Reports', icon: ReportsIcon }, // Added Reports to main nav
];

const audienceNavItems: NavItem[] = [
  { name: 'Contacts', icon: ContactsIcon },
  { name: 'Segments', icon: SegmentsIcon },
  { name: 'Groups', icon: GroupsIcon },
];

const marketingNavItems: NavItem[] = [
    { name: 'Campaigns', icon: CampaignsIcon },
    { name: 'WhatsApp Broadcasting', icon: BroadcastIcon },
    { name: 'Social Posting', icon: PhotoIcon },
    { name: 'Templates', icon: TemplateIcon },
    { name: 'Assets', icon: FolderIcon },
];

const settingsNavItems: NavItem[] = [
    { name: 'Users', icon: UserManagementIcon },
    { name: 'Integrations', icon: IntegrationsIcon },
    { name: 'Settings', icon: SettingsIcon },
]

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string, payload?: any) => void;
}

const NavLink: React.FC<{
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => (
  <li className="relative">
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 my-1 rounded-md transition-colors duration-200 group ${
        isActive
          ? 'bg-blue-600/20 text-white'
          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {isActive && (
        <span className="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-tr-lg rounded-br-lg" aria-hidden="true"></span>
      )}
      <item.icon className={`w-6 h-6 transition-colors ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
      <span className="ml-4 font-medium">{item.name}</span>
    </a>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const [isAudienceOpen, setIsAudienceOpen] = useState(true);
  const [isMarketingOpen, setIsMarketingOpen] = useState(true);

  // Removed the large base64 logo string. It will be handled by companyProfile.logoUrl in App.tsx settings.
  // const logoBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."; 

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-white shadow-xl h-screen py-4 overflow-y-auto">
      <div className="flex items-center justify-center h-16 px-4 mb-6">
        {/* Placeholder for actual logo from companyProfile.logoUrl */}
        <span className="text-xl font-bold text-gray-100">CRM App</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <ul className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.name}
              item={item}
              isActive={activeView === item.name}
              onClick={() => setActiveView(item.name)}
            />
          ))}
        </ul>

        {/* Audience Section */}
        <div className="border-t border-gray-700 pt-4 mt-4">
          <button
            onClick={() => setIsAudienceOpen(!isAudienceOpen)}
            className="flex items-center justify-between w-full p-3 my-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <span className="font-medium">Audience</span>
            <ChevronDownIcon className={`w-5 h-5 transition-transform ${isAudienceOpen ? 'rotate-0' : '-rotate-90'}`} />
          </button>
          {isAudienceOpen && (
            <ul className="ml-4 space-y-1">
              {audienceNavItems.map((item) => (
                <NavLink
                  key={item.name}
                  item={item}
                  isActive={activeView === item.name}
                  onClick={() => setActiveView(item.name)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Marketing Section */}
        <div className="border-t border-gray-700 pt-4 mt-4">
          <button
            onClick={() => setIsMarketingOpen(!isMarketingOpen)}
            className="flex items-center justify-between w-full p-3 my-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <span className="font-medium">Marketing</span>
            <ChevronDownIcon className={`w-5 h-5 transition-transform ${isMarketingOpen ? 'rotate-0' : '-rotate-90'}`} />
          </button>
          {isMarketingOpen && (
            <ul className="ml-4 space-y-1">
              {marketingNavItems.map((item) => (
                <NavLink
                  key={item.name}
                  item={item}
                  isActive={activeView === item.name}
                  onClick={() => setActiveView(item.name)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Settings Section */}
        <div className="border-t border-gray-700 pt-4 mt-4">
          <ul className="space-y-1">
            {settingsNavItems.map((item) => (
              <NavLink
                key={item.name}
                item={item}
                isActive={activeView === item.name}
                onClick={() => setActiveView(item.name)}
              />
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
};