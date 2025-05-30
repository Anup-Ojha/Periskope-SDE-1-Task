// utils/constants.ts

export const COLORS = {
  primaryGreen: '#15803d',
  white: 'white',
  darkGray: '#333',
  mediumGray: '#555',
  lightGray: '#ccc',
  redError: 'red',
  darkGreenBackground: '#06402B', // New dark green shade for the page background
};


// types/chat.ts
export interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
}

export interface Contact {
  phone: string;
  contactName: string;
  contactNumber: string;
  profile_pic_data?: string;
  profile_pic_type?:string;
  id: number;
  userId: string;
}

export interface Profile {
  id: string;
  name: string | null;
  phone: string | null;
  description: string | null;
  profile_pic_data: string | null;
  profile_pic_type: string | null;
}


// types/realtime.ts

export interface TypingStatusPayload {
  userId: string | null;
  recipientId: string | null;
  status: 'typing' | 'stopped_typing';
}





// Add any other Realtime-related types here as needed