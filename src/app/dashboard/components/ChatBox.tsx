// components/ChatBox.tsx
'use client';

import { Contact, Message } from '@/app/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { fetchMessages, removeChatSubscription, sendMessage, subscribeToNewMessages } from './api.chat';

interface ChatBoxProps {
  selectedContact: Contact | null;
}

const currentUser = '9309109229'; // Should come from context

export default function ChatBox({ selectedContact }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const chatSubscription = useRef<any>(null);

  useEffect(() => {
    const loadMessages = async () => {
      const fetchedMessages = await fetchMessages(selectedContact);
      setMessages(fetchedMessages);
    };

    if (selectedContact) {
      loadMessages();
      chatSubscription.current = subscribeToNewMessages(selectedContact, setMessages);
    }

    return () => {
      removeChatSubscription(chatSubscription.current);
    };
  }, [selectedContact]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    await sendMessage(selectedContact, newMessage);
    setNewMessage('');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px 20px', backgroundColor: '#075e54', color: '#fff', fontWeight: 'bold' }}>
        {selectedContact ? (selectedContact.contactName || selectedContact.contactNumber) : 'Select a contact'}
      </div>

      <div style={{ flex: 1, padding: '20px', backgroundColor: '#ece5dd', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.sender === currentUser ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === currentUser ? '#dcf8c6' : '#fff',
              padding: '10px 15px',
              margin: '5px 0',
              borderRadius: '8px',
              maxWidth: '70%',
              boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
            }}
          >
            <div>{msg.content}</div>
            <div style={{ fontSize: '10px', textAlign: 'right', marginTop: '5px', color: '#666' }}>
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {selectedContact && (
        <div style={{ display: 'flex', padding: '10px 20px', borderTop: '1px solid #ddd', backgroundColor: '#f0f0f0' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            style={{
              flex: 1,
              padding: '10px 15px',
              borderRadius: '20px',
              border: '1px solid #ccc',
              outline: 'none',
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              marginLeft: '10px',
              padding: '10px 20px',
              borderRadius: '20px',
              backgroundColor: '#075e54',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}