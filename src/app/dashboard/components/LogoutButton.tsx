'use client';

import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

export default function LogoutButton() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signOut();
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/');
  };

  return (
    <>
      <button
        onClick={handleLogout}
        disabled={loading}
        className={`px-4 py-2 rounded text-white transition ${
          loading ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        {loading ? 'Logging out...' : 'Logout'}
      </button>
      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
    </>
  );
}
