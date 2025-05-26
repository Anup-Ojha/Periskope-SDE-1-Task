// app/dashboard/page.tsx
'use client';

import { useState } from 'react';

import { Contact } from '@/app/lib/utils';
import ContactList from './ContactList';
import ChatBox from './ChatBox';

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#ece5dd' }}>
      {/* Contacts section takes 30% of the width */}
      <ContactList onSelect={setSelectedContact} selectedContact={selectedContact} />

      {/* Chats section takes the remaining 70% */}
      <div style={{ flex: 1 }}>
        <ChatBox selectedContact={selectedContact} />
      </div>
    </div>
  );
}