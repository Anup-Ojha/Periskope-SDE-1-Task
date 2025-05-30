'use client';

import { Contact, Message } from '@/app/lib/utils'; // Assuming this now contains the updated Contact interface
import { useEffect, useRef, useState } from 'react';
import { fetchMessages, removeChatSubscription, sendMessage, subscribeToNewMessages } from './api.chat';
import { supabase } from '@/app/lib/supabaseClient';
import Image from 'next/image';
import { FiPaperclip, FiSmile, FiClock } from 'react-icons/fi';
import { IoSend } from 'react-icons/io5';
import { RiExpandUpDownLine, RiFileList2Fill } from 'react-icons/ri';
import { GiStarsStack } from 'react-icons/gi';
import { FaMicrophone } from 'react-icons/fa';
import { PiClockClockwiseFill } from 'react-icons/pi';

interface ChatBoxProps {
  selectedContact: Contact | null;
}

async function fetchCurrentUserPhone(): Promise<string | null> {
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
    console.log(data)

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    const currentUserPhone = data?.phone;
    return currentUserPhone;

  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return null;
  }
}

// Updated function to fetch profile picture data and type
async function fetchContactProfilePictureData(contactNumber: string): Promise<{ data: string | null; type: string | null }> {
  try {
    const { data, error } = await supabase
      .from('user-profile') // Assuming 'profiles' is your table name for user profiles
      .select('profile_pic_data, profile_pic_type')
      .eq('phone', contactNumber)
      .single();

    if (error) {
      console.error('Error fetching contact profile picture data:', error);
      return { data: null, type: null };
    }

    return { data: data?.profile_pic_data || null, type: data?.profile_pic_type || null };
  } catch (error) {
    console.error('An unexpected error occurred while fetching contact profile picture data:', error);
    return { data: null, type: null };
  }
}

export default function ChatBox({ selectedContact }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const chatSubscription = useRef<any>(null);
  const [currentUserPhone, setCurrentUserPhone] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);
  const [contactProfilePicSrc, setContactProfilePicSrc] = useState<string | null>(null); // State for the image source URL

  useEffect(() => {
    const getCurrentUser = async () => {
      const phone = await fetchCurrentUserPhone();
      setCurrentUserPhone(phone);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      const fetchedMessages = await fetchMessages(selectedContact);
      setMessages(fetchedMessages);
      if (messagesAreaRef.current) {
        messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
      }
    };

    const loadContactProfileData = async () => {
      if (selectedContact) {
        const { data, type } = await fetchContactProfilePictureData(selectedContact.contactNumber);
        if (data && type) {
          setContactProfilePicSrc(`data:${type};base64,${data}`);
        } else {
          setContactProfilePicSrc(null); // No profile pic data found
        }
      } else {
        setContactProfilePicSrc(null);
      }
    };

    if (selectedContact) {
      loadMessages();
      loadContactProfileData(); // Call the new function to load profile data
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
    if (selectedContact && newMessage.trim()) {
      // Optimistic UI update: add the message to state immediately
      if (currentUserPhone) {
        const tempMessage: Message = {
          id: Date.now().toString(), // Temporary ID for optimistic update
          sender: currentUserPhone,
          recipient: selectedContact.contactNumber,
          content: newMessage.trim(),
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, tempMessage]);
      }

      setNewMessage(''); // Clear input immediately

      try {
        await sendMessage(selectedContact, newMessage.trim());
        // The real-time subscription will eventually update the message with the actual ID from DB
      } catch (error) {
        console.error("Error sending message:", error);
        // Revert optimistic update if sending fails
        if (currentUserPhone) {
          setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== Date.now().toString())); // Filter out the temp message
        }
        // Optionally, show an error message to the user
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value);
  };


  const makeClickableStyle = {
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '5px',
    transition: 'background-color 0.2s ease-in-out',
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '720px' }}>
    {/* Contact Info Header */}
      <div style={{ padding: '10px 20px', height: '58px', backgroundColor: '#f0f0f0', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd', borderTop: '2px solid #ddd' }}>
        {contactProfilePicSrc ? ( // Use the state variable for the generated image source
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', overflow: 'hidden', marginRight: '10px' }}>
            <img src={contactProfilePicSrc} alt="Contact Profile" width={30} height={30} style={{ objectFit: 'cover' }} />
          </div>
        ) : (
          // Fallback if no profile pic data is found or selectedContact is null
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
          height: 'calc(100% - 58px - 118px)',
          padding: '20px',
          backgroundColor: '#ece5dd',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          scrollbarWidth: 'thin',
          scrollbarColor: '#aab0bb transparent',
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
        {messages.map((msg) => (
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
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area (at the bottom) */}
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
              <div  style={{ ...makeClickableStyle, marginRight: '23px' }}>
                <FiPaperclip size={20} color="#000" />
              </div>
              <div  style={{ ...makeClickableStyle, marginRight: '23px' }}>
                <FiSmile size={20} color="#000" />
              </div>
              <div  style={{ ...makeClickableStyle, marginRight: '23px' }}>
                <FiClock size={20} color="#000" />
              </div>
              <div  style={{ ...makeClickableStyle, marginRight: '23px' }}>
                <PiClockClockwiseFill size={23} color="#000" />
              </div>
              <div  style={{ ...makeClickableStyle, marginRight: '23px' }}>
                <GiStarsStack size={20} color="#000" style={{ rotate: '90deg' }} />
              </div>
              <div  style={{ ...makeClickableStyle, marginRight: '23px' }}>
                <RiFileList2Fill size={20} color="#000" />
              </div>
              <div  style={makeClickableStyle}>
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
              >
                <img
                  src="/publicData/icon.png"
                  style={{ maxWidth: '20px', height: 'auto' }}
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