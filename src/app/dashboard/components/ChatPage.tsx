'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import ContactList from './ContactList';
import ChatBox from './ChatBox';
import AddContactButton from './AddContactButton';
import { Contact } from '@/app/lib/utils';

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserId() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        setUserId(null);
        return;
      }
      setUserId(user?.id ?? null);
    }
    fetchUserId();
  }, []);

  const handleContactAdded = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const handleSelectContact = useCallback((contact: Contact) => {
    setSelectedContact(contact);
  }, []);

  return (
    <div style={{ display: 'flex', height: '92vh', backgroundColor: '#ece5dd' }}>
      {userId && (
        <ContactList
          userId={userId}
          selectedContact={selectedContact}
          onSelect={handleSelectContact}
          key={refreshKey}
        />
      )}
      <AddContactButton onContactAdded={handleContactAdded} />
      <div style={{ flex: 1 }}>
        <ChatBox selectedContact={selectedContact} refreshKey={refreshKey} />
      </div>
    </div>
  );
}
