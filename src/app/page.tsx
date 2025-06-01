'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { COLORS } from '@/app/lib/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import the Image component

export default function HomePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error during logout:', error);
        // Optionally display an error message to the user
      } else {
        console.log('Logged out successfully');
        // The router.push('/') here is redundant as this is the home page
        // You might want to redirect to a different landing page if needed
      }
    };

    // Call handleLogout when the component mounts
    handleLogout();

    // Cleanup function (optional, but good practice)
    return () => {
      // Any cleanup logic if needed
    };
  }, [supabase, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        backgroundColor: COLORS.darkGreenBackground,
        minHeight: '100vh',
        padding: '40px 20px',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <style>
        {`
          @media (max-width: 768px) {
            .nav-bar {
              flex-direction: column;
              align-items: flex-start;
              gap: 16px;
            }
            .nav-buttons {
              width: 100%;
              display: flex;
              justify-content: flex-start;
              gap: 10px;
              flex-wrap: wrap;
            }
            .main-heading {
              font-size: 32px !important;
            }
            .main-paragraph {
              font-size: 16px !important;
            }
            .hero-image {
              width: 100% !important;
            }
          }
        `}
      </style>

      {/* Navigation Bar */}
      <nav className="nav-bar" style={{ width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px', flexWrap: 'wrap' }}>
        <Image
          src="https://framerusercontent.com/images/ywGyuWgLKzqyB4QJ1sw5Nk1mckU.svg?scale-down-to=512"
          alt="Periskope Logo"
          height={60} // Added height
          width={200} // Added a reasonable width
          style={{ objectFit: 'contain' }}
        />
        <div className="nav-buttons">
          <Link href="/login">
            <button style={{
              marginRight: '10px',
              padding: '10px 20px',
              backgroundColor: COLORS.primaryGreen,
              color: COLORS.white,
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
            }}>
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button style={{
              padding: '10px 20px',
              backgroundColor: COLORS.white,
              color: COLORS.primaryGreen,
              border: `2px solid ${COLORS.primaryGreen}`,
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
            }}>
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ textAlign: 'center', maxWidth: '800px', width: '100%' }}>
        <h1 className="main-heading" style={{ color: COLORS.white, fontSize: '48px', marginBottom: '20px' }}>
          Welcome to Periskope
        </h1>
        <p className="main-paragraph" style={{ color: COLORS.white, fontSize: '18px', marginBottom: '40px' }}>
          Connect with your friends and family seamlessly through our chat application.
        </p>
        <Image
          src="/pafe.jpg"
          alt="Chat Illustration"
          className="hero-image"
          width={450} // Added max width as width
          height={300} // Added a reasonable height
          style={{
            width: '80%',
            maxWidth: '400px',
            height: 'auto',
            borderRadius: '10%',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>
    </motion.div>
  );
}