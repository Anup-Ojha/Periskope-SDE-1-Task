'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { COLORS } from '@/app/lib/utils';
import Image from 'next/image';

export default function SignupPage() {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [signupCompleted, setSignupCompleted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: Email,
        password: Password,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`,
        },
      });

      if (authError) {
        console.error('Signup error:', authError.message);
        setMessage('Signup failed: ' + authError.message);
      } else if (authData?.user?.id) {
        const { error: profileError } = await supabase
          .from('user-profile')
          .insert({ id: authData.user.id, email: Email, name: '', phone: Phone, description: '' });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          setMessage('Signup successful, but failed to create profile.');
        } else {
          setEmail('');
          setPassword('');
          setPhone('');
          setSignupCompleted(true);
          setMessage('✅ Check your email to confirm and log in.');
        }
      }
    } catch (error) {
      console.error('Unexpected error during signup:', error);
      setMessage('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Allow only digits and limit to 10 characters
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.darkGreenBackground,
        fontFamily: 'Inter, sans-serif',
        padding: '20px',
        borderRadius: '20px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <Image
          src="https://framerusercontent.com/images/ywGyuWgLKzqyB4QJ1sw5Nk1mckU.svg?scale-down-to=512"
          width={350} // Specify width
          height={240} // Specify height (adjust as needed)
          style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
          alt="Logo"
        />
        <h1
          style={{
            color: COLORS.white,
            fontSize: '20px',
            paddingTop: '15px',
            textAlign: 'center',
          }}
        >
          Welcome to Periskope
        </h1>
      </div>

      <div
        style={{
          backgroundColor: COLORS.white,
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxHeight: '500px',
          maxWidth: '480px',
          border: `1px solid ${COLORS.primaryGreen}`,
        }}
      >
        <h2
          style={{
            color: COLORS.primaryGreen,
            textAlign: 'center',
            marginBottom: '30px',
            fontSize: '28px',
            fontWeight: 'bold',
          }}
        >
          Sign Up
        </h2>

        <form
          onSubmit={handleSignup}
          style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
        >
          <input
            type="email"
            value={Email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="Email"
            required
            maxLength={50}
            disabled={signupCompleted}
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            title="Please enter a valid email address"
            style={{
              padding: '14px',
              borderRadius: '8px',
              border: `1px solid ${COLORS.primaryGreen}`,
              fontSize: '19px',
              color: COLORS.darkGray,
              width: '100%',
            }}
          />

          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={Password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
              maxLength={30}
              disabled={signupCompleted}
              style={{
                padding: '14px',
                borderRadius: '8px',
                border: `1px solid ${COLORS.primaryGreen}`,
                fontSize: '17px',
                color: COLORS.darkGray,
                width: '100%',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                color: COLORS.primaryGreen,
                userSelect: 'none',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <input
            type="tel"
            value={Phone}
            onChange={handlePhoneChange}
            placeholder="Phone (10 digits)"
            maxLength={10}
            pattern="\d{10}"
            title="Please enter a 10-digit phone number"
            style={{
              padding: '14px',
              borderRadius: '8px',
              border: `1px solid ${COLORS.primaryGreen}`,
              fontSize: '17px',
              color: COLORS.darkGray,
              width: '100%',
            }}
          />

          <button
            type="submit"
            disabled={loading || signupCompleted}
            style={{
              padding: '14px 25px',
              backgroundColor: COLORS.primaryGreen,
              color: COLORS.white,
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: loading || signupCompleted ? 'not-allowed' : 'pointer',
              opacity: loading || signupCompleted ? 0.7 : 1,
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              boxShadow: '0 4px 10px rgba(21, 128, 61, 0.3)',
            }}
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        {message && (
          <p
            style={{ textAlign: 'center', marginTop: '20px', color: COLORS.darkGray, fontSize: '15px' }}
            aria-live="polite"
          >
            {message}
          </p>
        )}

        <p
          style={{
            textAlign: 'center',
            marginTop: '30px',
            fontSize: '15px',
            color: COLORS.mediumGray,
          }}
        >
          Already have an account?{' '}
          <a href="/login" style={{ color: COLORS.primaryGreen, fontWeight: 'bold' }}>
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
