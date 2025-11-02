import React from 'react';
import { IconDefinition } from 'lucide-react';

export interface Contact {
  id: string; // Added for Supabase UUID
  name: string;
  phone: string;
  avatar: string;
  tags: string[];
  lastSeen: string;
  customFields: { [key: string]: string };
  filter?: { tag?: string }; // Added for dynamic filtering in contact list
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'customer';
  timestamp: string;
}

export type MessageThread = {
  [contactId: string]: Message[];
};

export interface ConBotMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface Campaign {
  id: string;
  name: string;
  message: string;
  status: 'Sent' | 'Scheduled' | 'Draft';
  sentTo: number;
  sentDate: string | null;
  scheduledDate?: string | null;
  templateId?: string; // Link to the template this campaign originated from
}

export interface TemplateAttachment {
    name: string;
    type: string;
    size: number;
}

export interface CampaignTemplate {
  id: string;
  name: string;
  message: string;
  attachments?: TemplateAttachment[];
  quickReplies?: string[];
  status: 'Draft' | 'Active' | 'Used'; // New status field for templates
}

export interface Group {
  id: string;
  name: string;
  description: string;
  contactIds: string[];
}

export interface FolderAsset {
    id: string;
    type: 'folder';
    name: string;
    parentId: string | null;
    createdAt: string;
}

export interface FileAsset {
    id: string;
    type: 'file';
    name: string;
    url: string;
    size: number;
    fileType: string;
    parentId: string | null;
    createdAt: string;
}

export type Asset = FolderAsset | FileAsset;

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Agent' | 'Manager';
  status: 'Active' | 'Inactive';
}

export interface SocialPost {
    id: string;
    platforms: ('facebook' | 'instagram')[];
    text: string;
    mediaUrl?: string;
    postedAt: string;
}

export interface CustomFieldDefinition {
    id: string;
    name: string;
}

export interface ApiSettings {
  phoneId: string;
  isConnected: boolean;
  wahaSettings: {
      sessionName: string;
      sessionNumber: string;
      apiToken: string;
      baseUrl: string;
  };
  licenseKey: string;
  coexistenceEnabled: boolean;
  companyProfile: {
      name: string;
      address: string;
      website: string;
      logoUrl: string;
  }
}

// New Integration interface for consistency
export interface Integration {
    name: string;
    description: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    isConnected: boolean;
}