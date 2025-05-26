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
  profilePic?:string;
}