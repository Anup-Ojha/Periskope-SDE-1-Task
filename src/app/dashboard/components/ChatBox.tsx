'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {  fetchMessages, sendMessage } from './api.chat';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FiPaperclip, FiSmile, FiClock } from 'react-icons/fi';
import { IoSend } from 'react-icons/io5';
import { RiExpandUpDownLine, RiFileList2Fill } from 'react-icons/ri';
import { GiStarsStack } from 'react-icons/gi';
import { FaMicrophone } from 'react-icons/fa';
import { PiClockClockwiseFill } from 'react-icons/pi';
import { Contact, Message } from '@/app/lib/utils';

interface ChatBoxProps {
    selectedContact: Contact | null;
    refreshKey: number;
}

export default function ChatBox({ selectedContact, refreshKey }: ChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [currentUserPhone, setCurrentUserPhone] = useState<string | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const messagesAreaRef = useRef<HTMLDivElement>(null);
    const [contactProfilePicSrc] = useState<string | null>(null);
    const supabase = createClientComponentClient();
    
    const fetchCurrentUserPhone = useCallback(async (): Promise<string | null> => {
        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();
            if (userError) {
                console.error("Error getting user:", userError);
                return null;
            }
            const userId = user?.id;
            if (!userId) {
                console.warn("User not authenticated.");
                return null;
            }
            const { data, error } = await supabase
                .from('user-profile')
                .select('phone')
                .eq('id', userId)
                .single();
            if (error) {
                console.error("Error fetching user profile:", error);
                return null;
            }
            return data?.phone || null;
        } catch (error) {
            console.error("An unexpected error occurred:", error);
            return null;
        }
    }, [supabase]);

    const loadMessages = useCallback(async (contact: Contact | null) => {
        if (!contact) {
            setMessages([]);
            return;
        }
        const fetchedMessages = await fetchMessages(contact);
        setMessages(fetchedMessages);
        if (messagesAreaRef.current) {
            messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
        }
    }, [fetchMessages]);

    useEffect(() => {
        const getCurrentUser = async () => {
            const phone = await fetchCurrentUserPhone();
            setCurrentUserPhone(phone);
        };
        getCurrentUser();
    }, [fetchCurrentUserPhone]);

    useEffect(() => {
        if (selectedContact) {
            loadMessages(selectedContact);
        }
    }, [refreshKey, selectedContact, loadMessages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = useCallback(async () => {
        if (selectedContact && newMessage.trim() && currentUserPhone) {
            const tempMessage: Message = {
                id: Date.now().toString(),
                sender: currentUserPhone,
                recipient: selectedContact.contactNumber,
                content: newMessage.trim(),
                timestamp: new Date().toISOString(),
            };
            setMessages((prevMessages) => [...prevMessages, tempMessage]);
            setNewMessage('');
            try {
                await sendMessage(selectedContact, newMessage.trim());
            } catch (error) {
                console.error("Error sending message:", error);
                setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== tempMessage.id));
            }
        }
    }, [selectedContact, newMessage, currentUserPhone, sendMessage]);

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(event.target.value);
    }, []);

    const makeClickableStyle = {
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '5px',
        transition: 'background-color 0.2s ease-in-out',
    };

    const autoRefreshMessages = useCallback(() => {
        if (selectedContact) {
            loadMessages(selectedContact);
        }
    }, [selectedContact, loadMessages]);

    useEffect(() => {
        const intervalId = setInterval(autoRefreshMessages, Math.random() * (3000 - 2000) + 2000);
        return () => clearInterval(intervalId);
    }, [autoRefreshMessages]);

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '92vh', maxHeight: '720px' }}>

            <div style={{ padding: '10px 20px', height: '58px', backgroundColor: '#f0f0f0', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd', borderTop: '1px solid #ddd' }}>
                {contactProfilePicSrc ? (
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', overflow: 'hidden', marginRight: '10px' }}>
                        <img src={contactProfilePicSrc} alt="Contact Profile" width={30} height={30}  />
                    </div>
                ) : (
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', overflow: 'hidden', marginRight: '10px', backgroundColor: '#ccc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {selectedContact?.contactName?.charAt(0).toUpperCase() || selectedContact?.contactNumber?.charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    {selectedContact ? (selectedContact.contactName || selectedContact.contactNumber) : 'Select a contact'}
                </div>
            </div>

            <div
                ref={messagesAreaRef}
                style={{
                    height: 'calc(100% - 58px - 56px)', 
                    padding: '20px',
                    backgroundColor: '#ece5dd',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#aab0bb transparent',
                    textAlign: 'center', 
                }}
            >
                <style jsx global>{`
                    ::-webkit-scrollbar {
                        width: 5px;
                    }
                    ::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    ::-webkit-scrollbar-thumb {
                        background-color: #aab0bb;
                        border-radius: 5px;
                    }
                `}</style>
                {!selectedContact ? (
                    <div style={{ maxWidth: '80%' }}>
                        <h3 style={{ color: '#555', marginBottom: '15px' }}>Getting Started</h3>
                        <p style={{ color: '#777', lineHeight: '1.6' }}>
                            To begin chatting, please save a contact first using the green button.
                        </p>
                        <p style={{ color: '#777', marginTop: '10px', lineHeight: '1.6' }}>
                            To receive messages, ensure the sender is also saved as a contact.
                        </p>
                        <strong style={{ display: 'block', marginTop: '20px', color: '#333' }}>Do this to get started:</strong>
                        <ol style={{ marginTop: '10px', textAlign: 'left' }}>
                            <li>Tap the <span style={{ color: 'green', fontWeight: 'bold' }}>green button</span> to add a new contact.</li>
                            <li>Once saved, select the contact from your list to start messaging.</li>
                        </ol>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            style={{
                                alignSelf: msg.sender === currentUserPhone ? 'flex-end' : 'flex-start',
                                backgroundColor: msg.sender === currentUserPhone ? '#dcf8c6' : '#fff',
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
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            {selectedContact && (
                <div style={{ padding: '10px 20px', borderTop: '1px solid #ddd', backgroundColor: 'white', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    {showEmojiPicker && (
                        <div ref={emojiPickerRef} style={{ position: 'absolute', bottom: '60px', left: '20px', zIndex: 10 }}>
                        </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={handleInputChange}
                            placeholder="Message..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && newMessage.trim()) {
                                    handleSendMessage();
                                }
                            }}
                            style={{
                                flex: 1,
                                padding: '10px 15px',
                                borderRadius: '5px',
                                border: '1px solid transparent',
                                backgroundColor: '#fff',
                                outline: 'none',
                                marginRight: '10px',
                                color: '#000',
                            }}
                        />
                        <button
                            onClick={handleSendMessage}
                            style={{
                                padding: '8px 15px',
                                borderRadius: '50%',
                                backgroundColor: 'transparent',
                                color: 'green',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <IoSend size={22} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div onClick={() => console.log('Attachment clicked')} style={{ ...makeClickableStyle, marginRight: '23px' }}>
                                <FiPaperclip size={20} color="#000" />
                            </div>
                            <div onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ ...makeClickableStyle, marginRight: '23px' }}>
                                <FiSmile size={20} color="#000" />
                            </div>
                            <div onClick={() => console.log('Clock clicked')} style={{ ...makeClickableStyle, marginRight: '23px' }}>
                                <FiClock size={20} color="#000" />
                            </div>
                            <div onClick={() => console.log('Undo clicked')} style={{ ...makeClickableStyle, marginRight: '23px' }}>
                                <PiClockClockwiseFill size={23} color="#000" />
                            </div>
                            <div onClick={() => console.log('Hashtag clicked')} style={{ ...makeClickableStyle, marginRight: '23px' }}>
                                <GiStarsStack size={20} color="#000" style={{ rotate: '90deg' }} />
                            </div>
                            <div onClick={() => console.log('FileList clicked')} style={{ ...makeClickableStyle, marginRight: '23px' }}>
                                <RiFileList2Fill size={20} color="#000" />
                            </div>
                            <div onClick={() => console.log('Mic clicked')} style={makeClickableStyle}>
                                <FaMicrophone size={20} color="#000" />
                            </div>
                        </div>
                        <div className='flex'>
                            <button
                                style={{
                                    width: '160px',
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    backgroundColor: 'white',
                                    color: '#000',
                                    border: '1px solid black',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s ease-in-out',
                                }}
                                onClick={() => console.log('Periscope clicked')}
                            >
                                <img
                                    src="/publicData/icon.png"
                                    width={20}
                                    height={10}
                                    alt="Logo"
                                />
                                Periscope
                                <RiExpandUpDownLine size={20} color="#000" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}