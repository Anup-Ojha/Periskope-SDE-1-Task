'use client';

import { useEffect, useState, useRef } from 'react';
import { MdFilterList } from 'react-icons/md';
import { CiSearch } from 'react-icons/ci';
import Image from 'next/image';
import { supabase } from '@/app/lib/supabaseClient';
import { HiFolderDownload } from 'react-icons/hi';
import { fetchContacts, subscribeToContacts, unsubscribeFromContacts } from './api.chat';

export interface Contact {
    phone: string;
    contactName: string;
    contactNumber: string;
    profilePic?: string;
    id: number;
    userId: string;
}

interface ContactListProps {
    selectedContact: Contact | null;
    onSelect: (contact: Contact) => void;
    userId: string;
}

export default function ContactList({ selectedContact, onSelect, userId }: ContactListProps) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const contactsChannel = useRef<any>(null);

    useEffect(() => {
        const getContacts = async () => {
            const fetchedContacts = await fetchContacts();
            setContacts(fetchedContacts);
            console.log("Fetched Contacts in ContactList:", fetchedContacts);
        };
        getContacts();
    }, [userId]);

    useEffect(() => {
        contactsChannel.current = subscribeToContacts(setContacts);
        return () => {
            if (contactsChannel.current) {
                unsubscribeFromContacts(contactsChannel.current);
                contactsChannel.current = null;
            }
        };
    }, [setContacts]);

    useEffect(() => {
        console.log("selectedContact prop in ContactList:", selectedContact);
    }, [selectedContact]);

    const filteredContacts = contacts.filter(contact =>
        (contact.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.contactNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div style={{ width: '30%', minWidth: '300px', backgroundColor: '#fff', overflowY: 'auto', borderRight: '1px solid #ddd', borderTop: '2px solid #ddd' }}>
            {/* ... Header ... */}
            <div
                className='flex items-center justify-between flex-wrap'
                style={{ padding: '10px', backgroundColor: '#FAFAFA', fontWeight: 'bold', borderBottom: '1px solid #eee' }}
            >
                {/* ... Header Content ... */}
                <div className="flex items-center mb-2 md:mb-0">
                    <HiFolderDownload size={25} style={{ color: 'green', marginRight: '8px' }} />
                    <p style={{ color: 'green', fontSize: '1rem', marginRight: '10px' }}>Custom filter</p>
                    <button
                        className="bg-white shadow-sm rounded-md flex items-center space-x-1 px-3 py-2 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        style={{ marginLeft: '0' }}
                    >
                        <span className="">Save</span>
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="bg-white shadow-sm rounded-md flex items-center relative">
                        <CiSearch size={16} style={{ color: '#888', position: 'absolute', left: '8px' }} />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '6px 10px 6px 30px',
                                borderRadius: '6px',
                                border: '1px solid #ccc',
                                fontSize: '0.900rem',
                                width: '100px',
                                outline: 'none',
                                backgroundColor: 'inherit',
                            }}
                            className="focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <button className="bg-white shadow-sm rounded-md flex items-center space-x-1 px-2 py-2 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                        <MdFilterList className="text-gray-600" size={16} />
                        <span className="">Filtered</span>
                    </button>
                </div>
            </div>

            {/* Contact List */}
            {filteredContacts.map((contact) => (
                <div
                    key={contact.id}
                    onClick={() => onSelect(contact)}
                    className={`flex items-center p-3 cursor-pointer border-bottom transition-colors duration-200 ease-in-out ${selectedContact?.phone === contact.phone ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    style={{ borderBottom: '1px solid #f0f0f0' }}
                >
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', marginRight: '15px' }}>
                        {contact.profilePic ? (
                            <Image src={contact.profilePic} alt="Profile" width={50} height={50} style={{ objectFit: 'cover' }} />
                        ) : (
                            <Image priority src='/default-image.jpeg' alt="Default Profile" width={50} height={50} style={{ objectFit: 'cover' }} />
                        )}
                    </div>
                    <div className="flex-grow flex flex-col">
                        <div style={{ fontWeight: 'bold' }}>{contact.contactName || contact.contactNumber}</div>
                        {contact.contactName && <div style={{ fontSize: '12px', color: '#555' }}>{contact.contactNumber}</div>}
                    </div>
                </div>
            ))}
        </div>
    );
}