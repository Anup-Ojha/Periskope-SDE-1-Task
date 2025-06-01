'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { COLORS } from '@/app/lib/utils';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ContactCountChart from './ContactCountChart';

export default function HomePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error during logout:', error);
      } else {
        console.log('Logged out successfully');
      }
    };

    handleLogout();

    return () => {
      // Cleanup if needed
    };
  }, [supabase, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="home-container"
    >
      <style jsx global>{`
        .home-container {
          background-color: ${COLORS.darkGreenBackground};
          min-height: 100vh;
          padding: 40px 20px;
          font-family: Inter, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
        }

        .nav-bar {
          width: 100%;
          max-width: 1200px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          flex-wrap: wrap;
          gap: 20px;
        }

        .nav-logo {}

        .nav-buttons {
          display: flex;
          gap: 10px;
        }

        .nav-buttons button {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          border: none;
          transition: opacity 0.3s ease;
        }

        .nav-buttons button:hover {
          opacity: 0.8;
        }

        .login-button {
          background-color: ${COLORS.primaryGreen};
          color: ${COLORS.white};
        }

        .signup-button {
          background-color: ${COLORS.white};
          color: ${COLORS.primaryGreen};
          border: 2px solid ${COLORS.primaryGreen};
        }

        .main-area {
          width: 100%;
          max-width: 1200px;
          display: flex;
          gap: 40px;
          align-items: center; /* Vertically align chart and text */
          flex-direction: row; /* Default to side-by-side */
        }

        .hero-section {
          flex: 1; /* Take up available space */
          text-align: left; /* Align text to the left when side-by-side */
        }

        .main-heading {
          color: ${COLORS.white};
          font-size: 48px;
          margin-bottom: 20px;
        }

        .main-paragraph {
          color: ${COLORS.white};
          font-size: 18px;
          margin-bottom: 30px;
        }

        .hero-image {
          width: 80%;
          max-width: 400px;
          height: auto;
          border-radius: 10px;
          margin-bottom: 0; /* Remove bottom margin when side-by-side */
          object-fit: contain;
        }

        .chart-container {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          flex-shrink: 0; /* Don't shrink below its content */
        }

        @media (max-width: 768px) {
          .nav-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .nav-buttons {
            width: 100%;
            flex-direction: column;
            gap: 10px;
          }
          .nav-buttons button {
            width: 100%;
            padding: 12px 20px;
            font-size: 16px;
          }
          .main-heading {
            font-size: 36px !important;
            text-align: center; /* Center text on mobile */
          }
          .main-paragraph {
            font-size: 16px !important;
            text-align: center; /* Center text on mobile */
          }
          .main-area {
            flex-direction: column; /* Stack on mobile */
            align-items: center; /* Center items on mobile */
            gap: 30px;
          }
          .hero-section {
            text-align: center; /* Center text on mobile */
          }
          .hero-image {
            width: 100% !important;
            max-width: 300px; /* Adjust image size on mobile */
            margin-bottom: 30px; /* Add bottom margin on mobile */
          }
          .chart-container {
            max-width: 100%;
          }
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="nav-bar">
        <Link href="/" className="nav-logo">
          <Image
            src="https://framerusercontent.com/images/ywGyuWgLKzqyB4QJ1sw5Nk1mckU.svg?scale-down-to=512"
            alt="Periskope Logo"
            height={80}
            width={250}
            style={{ objectFit: 'contain' }}
          />
        </Link>
        <div className="nav-buttons">
          <Link href="/login">
            <button className="login-button">Login</button>
          </Link>
          <Link href="/signup">
            <button className="signup-button">Sign Up</button>
          </Link>
        </div>
      </nav>

      {/* Main Content and Chart */}
      <div className="main-area">
        <section className="hero-section">
          <h2 className="main-heading">Welcome to Periskope</h2>
          <p className="main-paragraph">
            Connect with your friends and family seamlessly through our chat application.
          </p>
          <Image
            src="/pafe.jpg"
            alt="Chat Illustration"
            className="hero-image"
            
            width={450}
            height={300}
            style={{
              maxWidth: '400px',
              height: 'auto',
              marginLeft: '9%',
              borderRadius: '10px',
              objectFit: 'contain',
            }}
          />
        </section>
        <div className="chart-container">
          <ContactCountChart />
        </div>
      </div>
    </motion.div>
  );
}