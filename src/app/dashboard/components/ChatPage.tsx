'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import ContactList from './ContactList';
import ChatBox from './ChatBox';
import AddContactButton from './AddContactButton';
import { Contact } from '@/app/lib/utils';

export default function ChatPage() {
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null); // Ensure it's Contact | null
    const [refreshKey, setRefreshKey] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const getUserId = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id || null);
        };
        getUserId();
    }, []);

    const handleContactAdded = useCallback(() => {
        setRefreshKey(prevKey => prevKey + 1);
    }, []);

    const handleSelectContact = (contact: Contact) => {
        setSelectedContact(contact);
        console.log("Selected Contact in ChatPage:", contact); // Debugging
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#ece5dd' }}>
            {userId && (
                <ContactList
                    onSelect={handleSelectContact} // Use the new handler
                    selectedContact={selectedContact}
                    userId={userId}
                    key={refreshKey}
                />
            )}
            <AddContactButton onContactAdded={handleContactAdded} />
            <div style={{ flex: 1 }}>
                <ChatBox selectedContact={selectedContact} />
            </div>
        </div>
    );
}