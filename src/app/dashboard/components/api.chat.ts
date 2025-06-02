import { supabase } from '@/app/lib/supabaseClient';
import { Contact, Message } from '@/app/lib/utils';

// Helper to fetch current user's phone number from 'user-profile'
async function fetchCurrentUserPhone(): Promise<string | null> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error getting user:', userError);
      return null;
    }

    const userId = user?.id;
    if (!userId) {
      console.warn('User not authenticated.');
      return null;
    }

    const { data, error } = await supabase
      .from('user-profile')
      .select('phone')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data?.phone || null;
  } catch (error) {
    console.error('Unexpected error in fetchCurrentUserPhone:', error);
    return null;
  }
}

const getCurrentUserPhone = async (): Promise<string> => {
  const phone = await fetchCurrentUserPhone();
  if (!phone) throw new Error("User not authenticated or phone number not found.");
  return phone;
};

// Add a contact for the current user
export const addContact = async (
  contactName: string,
  contactNumber: string,
  userId: string
): Promise<{ success: boolean; error: any }> => {
  try {
    const currentUserPhone = await getCurrentUserPhone();

    const { error } = await supabase.from('contacts').insert({
      userId,
      phone: currentUserPhone,
      contactName,
      contactNumber,
    });

    if (error) {
      console.error('Error adding contact:', error);
      return { success: false, error };
    }
    return { success: true, error: null };
  } catch (error) {
    console.error('Unexpected error adding contact:', error);
    return { success: false, error };
  }
};

// Fetch contacts belonging to the current user
export const fetchContacts = async (): Promise<Contact[]> => {
  try {
    const currentUserPhone = await getCurrentUserPhone();

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('phone', currentUserPhone);

    if (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching contacts:', error);
    return [];
  }
};

export const unsubscribeFromContacts = (channel: any) => {
  if (channel?.unsubscribe) {
    channel.unsubscribe();
    supabase.removeChannel(channel);
  }
};

// Fetch messages between current user and a contact
export async function fetchMessages(contact: Contact): Promise<Message[]> {
  const currentUserPhone = await fetchCurrentUserPhone();
  if (!currentUserPhone) {
    console.error("Could not determine current user's phone.");
    return [];
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(
      `and(sender.eq.${currentUserPhone},recipient.eq.${contact.contactNumber}),and(sender.eq.${contact.contactNumber},recipient.eq.${currentUserPhone})`
    )
    .order('timestamp', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  return data || [];
}

// Send a message to a selected contact
export const sendMessage = async (
  selectedContact: Contact | null,
  newMessage: string
): Promise<void> => {
  if (!newMessage.trim() || !selectedContact) return;

  try {
    const currentUserPhone = await getCurrentUserPhone();

    const { error } = await supabase.from('messages').insert({
      sender: currentUserPhone,
      recipient: selectedContact.contactNumber,
      content: newMessage,
    });

    if (error) console.error('Error sending message:', error);
  } catch (error) {
    console.error('Unexpected error sending message:', error);
  }
};

// Subscribe to realtime new messages for the selected contact
export const subscribeToNewMessages = async (
  selectedContact: Contact | null,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  if (!selectedContact) return null;

  const currentUserPhone = await getCurrentUserPhone();

  const channel = supabase.channel('realtime-chat').on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      const newMsg = payload.new as Message;

      if (
        newMsg &&
        ((newMsg.sender === currentUserPhone && newMsg.recipient === selectedContact.contactNumber) ||
          (newMsg.sender === selectedContact.contactNumber && newMsg.recipient === currentUserPhone))
      ) {
        setMessages((prev) => [...prev, newMsg]);
      }
    }
  );

  await channel.subscribe();
  return channel;
};

// Remove subscription channel
export const removeChatSubscription = (channel: any) => {
  if (channel?.unsubscribe) {
    channel.unsubscribe();
    supabase.removeChannel(channel);
  }
};
