'use client';

import { supabase } from '@/app/lib/supabaseClient';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { COLORS } from '@/app/lib/utils';
import { redirect, useRouter, useSearchParams } from 'next/navigation';


function navigatorToDashboard(){
    redirect('/dashboard');
  }

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Prefetch dashboard to speed up redirect
    router.prefetch('/dashboard');
  }, [router]);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const { error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) {
        setError(`Login failed: ${supabaseError.message}`);
        setPassword(''); // Optional: Clear password field on failure
      } else {
        setMessage('Login successful! Redirecting...');
        const myTimeout = setTimeout(navigatorToDashboard, 5);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.darkGreenBackground,
      fontFamily: 'Inter, sans-serif',
      padding: '20px',
      borderRadius: '20px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <img
          src="https://framerusercontent.com/images/ywGyuWgLKzqyB4QJ1sw5Nk1mckU.svg?scale-down-to=512"
          style={{ minWidth: '240px', maxWidth: '350px', height: 'auto', objectFit: 'contain' }}
          alt="Logo"
        />
        <h1 style={{ color: COLORS.white, fontSize: '20px', paddingTop: '25px' }}>
          Welcome Back!
        </h1>
      </div>

      <div style={{
        backgroundColor: COLORS.white,
        padding: '50px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '480px',
        border: `1px solid ${COLORS.primaryGreen}`
      }}>
        <h2 style={{
          color: COLORS.primaryGreen,
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          Login
        </h2>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email address"
            required
            style={{
              padding: '14px',
              borderRadius: '8px',
              border: `1px solid ${COLORS.primaryGreen}`,
              fontSize: '17px',
              color: COLORS.darkGray
            }}
          />
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            required
            style={{
              padding: '14px',
              borderRadius: '8px',
              border: `1px solid ${COLORS.primaryGreen}`,
              fontSize: '17px',
              color: COLORS.darkGray
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px 25px',
              backgroundColor: COLORS.primaryGreen,
              color: COLORS.white,
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              boxShadow: '0 4px 10px rgba(21, 128, 61, 0.3)',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {message && <p style={{
          color: COLORS.primaryGreen,
          marginTop: '25px',
          textAlign: 'center',
          fontSize: '15px'
        }}>{message}</p>}

        {error && <p style={{
          color: COLORS.redError,
          marginTop: '25px',
          textAlign: 'center',
          fontSize: '15px'
        }}>Error: {error}</p>}

        <p style={{ textAlign: 'center', marginTop: '30px', fontSize: '15px', color: COLORS.mediumGray }}>
          Don't have an account?{' '}
          <a href="/signup" style={{ color: COLORS.primaryGreen, textDecoration: 'none', fontWeight: 'bold' }}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
