'use client';

import { useEffect, useState, useRef } from 'react';
import { MdFilterList } from 'react-icons/md';
import { CiSearch } from 'react-icons/ci';
import Image from 'next/image';
import { HiFolderDownload } from 'react-icons/hi';
import { fetchContacts, unsubscribeFromContacts } from './api.chat';

export interface Contact {
  phone: string;
  contactName: string;
  contactNumber: string;
  id: string | number; // ID can now be a string for unsaved
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
    };
    getContacts();
  }, [userId]);

  useEffect(() => {
    return () => {
      if (contactsChannel.current) {
        unsubscribeFromContacts(contactsChannel.current);
        contactsChannel.current = null;
      }
    };
  }, []);

  const filteredContacts = contacts.filter(contact =>
    (contact.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.contactNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-[32%] min-w-[350px] bg-white overflow-y-auto border-r border-t border-gray-300">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap p-3 bg-gray-50 font-semibold border-b border-gray-200">
        <div className="flex items-center mb-2 md:mb-0">
          <HiFolderDownload size={25} className="text-green-600 mr-2" />
          <p className="text-green-600 text-base mr-3">Custom filter</p>
          <button className="bg-white shadow-sm rounded-md flex items-center px-3 py-2 text-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <span>Save</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative bg-white shadow-sm rounded-md flex items-center">
            <CiSearch size={16} className="text-gray-500 absolute left-2" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 pr-3 py-1.5 rounded-md border border-gray-300 text-sm w-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-inherit"
            />
          </div>
          <button className="bg-white shadow-sm rounded-md flex items-center space-x-1 px-2 py-2 text-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <MdFilterList className="text-gray-600" size={16} />
            <span>Filtered</span>
          </button>
        </div>
      </div>

      {/* Contact List */}
      {filteredContacts.map((contact) => {
        const isSelected = selectedContact?.id === contact.id;
        return (
          <div
            key={contact.id}
            onClick={() => onSelect(contact)}
            className={`flex items-center p-3 cursor-pointer border-b border-gray-100 transition-colors duration-200 ease-in-out
              ${isSelected ? 'bg-blue-100 border-l-4 ' : 'hover:bg-gray-50'}
            `}
          >
            <div className="w-[50px] h-[50px] rounded-full overflow-hidden mr-4 flex-shrink-0">
              <Image
                src={'/default-image.jpeg'}
                alt="Profile"
                width={50}
                height={50}
                priority
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-grow flex flex-col">
              <div className="font-semibold text-sm">{contact.contactName || contact.contactNumber}</div>
              {contact.contactName && (
                <div className="text-xs text-gray-600">{contact.contactNumber}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}