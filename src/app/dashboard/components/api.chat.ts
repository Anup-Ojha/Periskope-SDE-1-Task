// api/chat.ts
import { supabase } from '@/app/lib/supabaseClient';
import { Contact, Message } from '@/app/lib/utils';

const currentUser = '9309109229'; // This should ideally come from authentication context

export const fetchContacts = async (): Promise<Contact[]> => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('phone', currentUser);
  if (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
  return data as Contact[];
};

export const fetchMessages = async (selectedContact: Contact | null): Promise<Message[]> => {
  if (!selectedContact) return [];
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(
      `and(sender.eq.${currentUser},recipient.eq.${selectedContact.contactNumber}),and(sender.eq.${selectedContact.contactNumber},recipient.eq.${currentUser})`
    )
    .order('timestamp', { ascending: true });
  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  return data as Message[];
};

export const sendMessage = async (selectedContact: Contact | null, newMessage: string): Promise<void> => {
  if (!newMessage.trim() || !selectedContact) return;
  const { error } = await supabase.from('messages').insert({
    sender: currentUser,
    recipient: selectedContact.contactNumber,
    content: newMessage,
  });
  if (error) {
    console.error('Error sending message:', error);
  }
};

// Function to set up message subscription
export const subscribeToNewMessages = async (
  selectedContact: Contact | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  if (!selectedContact) return null;

  const channel = supabase.channel('realtime-chat').on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      const newMsg = payload.new as Message;
      if (
        newMsg &&
        ((newMsg.sender === currentUser && newMsg.recipient === selectedContact.contactNumber) ||
         (newMsg.sender === selectedContact.contactNumber && newMsg.recipient === currentUser))
      ) {
        setMessages((prev: Message[]) => [...prev, newMsg]);
      }
    }
  );

  await channel.subscribe(); // ✅ ensure subscription is established
  return channel;
};

export const removeChatSubscription = (channel: any) => {
  if (channel) {
    supabase.removeChannel(channel);
  }
};