// api/chat.ts
import { supabase } from '@/app/lib/supabaseClient';
import { Contact, Message } from '@/app/lib/utils'; // Assuming Contact and Message types are here

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

// Function to get the current user's phone
const getCurrentUserPhone = async (): Promise<string> => {
  const phone = await fetchCurrentUserPhone();
  if (!phone) {
    console.error("Could not fetch current user's phone number.");
    throw new Error("User not authenticated or phone number not found.");
  }
  return phone;
};

// --- NEW FUNCTION: Add Contact ---
export const addContact = async (
  contactName: string,
  contactNumber: string,
  userId: string // Supabase auth.users ID
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
// --- END NEW FUNCTION ---


export const fetchContacts = async (): Promise<Contact[]> => {
  const currentUserPhone = await getCurrentUserPhone();
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('phone', currentUserPhone); // Fetch contacts owned by the current user
  if (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
  return data as Contact[];
};

// Function to subscribe to real-time updates for contacts
// export const subscribeToContacts = (
//   setContacts: React.Dispatch<React.SetStateAction<Contact[]>>
// ) => {
//   return supabase
//     .channel('realtime-contacts')
//     .on(
//       'postgres_changes',
//       { event: '*', schema: 'public', table: 'contacts' },
//       (payload) => {
//         const currentUserPhone = localStorage.getItem('currentUserPhone'); 
//         if (!currentUserPhone) return;

//         const record = payload.new || payload.old;
//         if (record?.phone === currentUserPhone) {
//           // If the change affects a contact owned by the current user, refetch the list
//           fetchContacts().then(updatedContacts => {
//             setContacts(updatedContacts);
//           }).catch(error => {
//             console.error("Error refetching contacts after real-time event:", error);
//           });
//         }
//       }
//     )
//     .subscribe();
// };

export const unsubscribeFromContacts = (channel: any) => {
  if (channel && channel.unsubscribe) {
    channel.unsubscribe();
    supabase.removeChannel(channel);
  }
};


export const fetchMessages = async (selectedContact: Contact | null): Promise<Message[]> => {
  if (!selectedContact) return [];
  const currentUserPhone = await getCurrentUserPhone();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(
      `and(sender.eq.${currentUserPhone},recipient.eq.${selectedContact.contactNumber}),and(sender.eq.${selectedContact.contactNumber},recipient.eq.${currentUserPhone})`
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