// api/chat.ts
import { supabase } from '@/app/lib/supabaseClient';
import { Contact, Message } from '@/app/lib/utils'; // Assuming Contact and Message types are defined in utils.ts

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

const getCurrentUserPhone = async (): Promise<string> => {
  const phone = await fetchCurrentUserPhone();
  if (!phone) {
    console.error("Could not fetch current user's phone number.");
    throw new Error("User not authenticated or phone number not found.");
  }
  return phone;
};

export const addContact = async (
  contactName: string,
  contactNumber: string,
  userId: string
): Promise<{ success: boolean; error: any }> => {
  try {
    const currentUserPhone = await getCurrentUserPhone(); // The phone number of the user who is adding the contact

    const { error } = await supabase.from('contacts').insert({
      userId: userId, // The Supabase auth.users ID of the current user
      phone: currentUserPhone, // The phone number of the current user (owner of this contact entry)
      contactName: contactName,
      contactNumber: contactNumber,
    });

    if (error) {
      console.error('Error adding contact:', error);
      return { success: false, error };
    }
    return { success: true, error: null };
  } catch (error) {
    console.error("An unexpected error occurred while adding contact:", error);
    return { success: false, error };
  }
};

export const fetchContacts = async (): Promise<Contact[]> => {
  try {
    const currentUserPhone = await getCurrentUserPhone();

    // Fetch only saved contacts for the current user
    const { data: savedContacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .eq('phone', currentUserPhone); // Assuming 'phone' column in 'contacts' table stores the owner's phone

    if (contactsError) {
      console.error('Error fetching saved contacts:', contactsError);
      return [];
    }

    // Return the fetched saved contacts directly
    return savedContacts || [];

  } catch (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
};

export const unsubscribeFromContacts = (channel: any) => {
  if (channel && channel.unsubscribe) {
    channel.unsubscribe();
    supabase.removeChannel(channel);
  }
};


export async function fetchMessages(contact: Contact) {
  const currentUserPhone = await fetchCurrentUserPhone(); // Get the current user's phone

  if (!currentUserPhone) {
    console.error("Could not determine current user's phone.");
    return [];
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*') // Or specific columns you need
    .or(`and(sender.eq.${currentUserPhone},recipient.eq.${contact.contactNumber}),and(sender.eq.${contact.contactNumber},recipient.eq.${currentUserPhone})`)
    .order('timestamp', { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
  return data || [];
}

export const sendMessage = async (selectedContact: Contact | null, newMessage: string): Promise<void> => {
  if (!newMessage.trim() || !selectedContact) return;
  const currentUserPhone = await getCurrentUserPhone();
  const { error } = await supabase.from('messages').insert({
    sender: currentUserPhone,
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
        setMessages((prev: Message[]) => [...prev, newMsg]);
      }
    }
  );

  await channel.subscribe();
  return channel;
};

export const removeChatSubscription = (channel: any) => {
  if (channel && channel.unsubscribe) {
    channel.unsubscribe();
    supabase.removeChannel(channel);
  }
};