// lib/UserContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const UserContext = createContext<{ phone: string | null }>({ phone: null });

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [phone, setPhone] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchPhone = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user-profile')
        .select('phone')
        .eq('id', user.id)
        .single();

      if (!error) setPhone(data?.phone || null);
    };

    fetchPhone();
  }, []);

  return (
    <UserContext.Provider value={{ phone }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
