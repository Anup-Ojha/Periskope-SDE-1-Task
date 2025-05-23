'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { COLORS } from '@/app/lib/utils';

export default function HomePage() {
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
        <img
          src="https://framerusercontent.com/images/ywGyuWgLKzqyB4QJ1sw5Nk1mckU.svg?scale-down-to=512"
          alt="Periskope Logo"
          style={{ height: '60px' }}
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
        <img
          src="https://cdn.vectorstock.com/i/500p/49/58/chat-app-speech-logotype-type-bubble-vector-18534958.jpg"
          alt="Chat Illustration"
          className="hero-image"
          style={{
            width: '80%',
            maxWidth: '450px',
            height: 'auto',
            borderRadius: '10%',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />
      </div>
    </motion.div>
  );
}
