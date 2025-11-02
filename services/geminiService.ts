import { GoogleGenAI } from '@google/genai';
import { Message, ConBotMessage } from '../types';

// Placeholder for your Deno functions base URL.
// In a real deployment, this would be your Deno Deploy URL or local Deno server address.
const DENO_FUNCTIONS_BASE_URL = 'http://localhost:8000';

export const generateCampaignMessage = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(`${DENO_FUNCTIONS_BASE_URL}/generate-campaign-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.message || "Failed to generate a message from the function.";

  } catch (error: any) {
    console.error("Error calling generate-campaign-message function:", error);
    return "Failed to generate message. Please try again. " + error.message;
  }
};


export const suggestReply = async (conversation: Message[]): Promise<string> => {
  if (conversation.length === 0) return "No conversation to analyze.";

  try {
    const response = await fetch(`${DENO_FUNCTIONS_BASE_URL}/suggest-reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.suggestion || "Could not suggest a reply from the function.";

  } catch (error: any) {
    console.error("Error calling suggest-reply function:", error);
    return "Could not suggest a reply. " + error.message;
  }
};

export const chatWithConBot = async (apiKey: string, history: ConBotMessage[], newMessage: string): Promise<string> => {
  // The API key is now guaranteed to be passed from process.env.API_KEY,
  // so the explicit check for !apiKey is removed.

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const model = 'gemini-2.5-flash';

    const systemInstruction = `You are ConBot, a friendly and helpful AI assistant for the Contact Messaging CRM application. Your purpose is to assist users with navigating the app, understanding its features, and answering questions. Keep your responses concise and directly address the user's query. If you suggest navigating to a page, offer to do so by explicitly mentioning the page name.

Available Pages: Dashboard, Chat, Reports, Contacts, Segments, Groups, Campaigns, WhatsApp Broadcasting, Social Posting, Templates, Assets, Users, Integrations, Settings.

Examples:
User: How do I add a new contact?
ConBot: You can add new contacts from the 'Contacts' page by clicking the 'Add Contact' button. Would you like me to take you to the Contacts page?

User: What's the purpose of the Reports section?
ConBot: The 'Reports' section will provide detailed analytics on campaign performance, contact engagement, and user activity. It's currently under development. Would you like to go to the Reports page?

User: Show me my campaigns.
ConBot: I can take you to the 'Campaigns' page where you can view and manage all your campaigns. Would you like me to navigate to the Campaigns page?

User: How do I connect to WhatsApp?
ConBot: You can manage your WhatsApp API connection in the 'Settings' page under 'WhatsApp API Settings (WAHA)'. Would you like me to take you to the Settings page?

User: Automate incoming messages.
ConBot: I can help conceptually with incoming message automation by routing messages, providing quick replies, or summarizing conversations to assist agents. Direct integration with message handling is a future feature.

Remember to always offer navigation when relevant.`;

    const conversationParts = history.map(msg => ({
      text: msg.sender === 'user' ? `User: ${msg.text}` : `ConBot: ${msg.text}`,
    }));

    conversationParts.push({ text: `User: ${newMessage}` });

    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: conversationParts }],
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    return response.text;

  } catch (error: any) {
    console.error("Error chatting with ConBot:", error);
    return "I'm sorry, I encountered an error. Please try again later. " + error.message;
  }
};