// components/ContactList.tsx
'use client';

import { useEffect, useState } from 'react';
import { Contact } from '@/app/lib/utils';
import { fetchContacts } from './api.chat';
import Image from 'next/image';

interface ContactListProps {
  selectedContact: Contact | null;
  onSelect: (contact: Contact) => void;
}

export default function ContactList({ selectedContact, onSelect }: ContactListProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const getContacts = async () => {
      const fetchedContacts = await fetchContacts();
      setContacts(fetchedContacts);
    };

    getContacts();
  }, []);

  return (
    <div style={{ width: '30%', minWidth: '300px', backgroundColor: '#fff', overflowY: 'auto', borderRight: '1px solid #ddd' }}>
      <div style={{ padding: '10px', backgroundColor: '#075e54', color: '#fff', fontWeight: 'bold' }}>Contacts</div>
      {contacts.map((contact) => (
        <div
          key={contact.phone}
          onClick={() => onSelect(contact)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            cursor: 'pointer',
            borderBottom: '1px solid #f0f0f0',
            backgroundColor: selectedContact?.phone === contact.phone ? '#f5f5f5' : 'transparent',
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', marginRight: '10px' }}>
            {contact.profilePic ? (
              <img src={contact.profilePic} alt="Profile" width={40} height={40}  />
            ) : (
              <img src='../../../../public/default-image.jpeg' alt="Default Profile" width={40} height={40}/>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 'bold' }}>{contact.contactName || contact.contactNumber}</div>
            {contact.contactName && <div style={{ fontSize: '12px', color: '#555' }}>{contact.contactNumber}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}