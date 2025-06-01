'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { COLORS, Profile } from '@/app/lib/utils';
import { redirect, useRouter } from 'next/navigation';
import { IoLogOutOutline } from 'react-icons/io5';
import { BsFillArrowLeftCircleFill } from 'react-icons/bs';

export default function ProfilePage() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [profile, setProfile] = useState<Omit<Profile, 'profile_pic_data' | 'profile_pic_type'> | null>(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfileData = async () => {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                redirect('/login');
                return;
            }
            const userId = user.id;
            const { data, error } = await supabase
                .from('user-profile')
                .select('name, phone, description')
                .eq('id', userId)
                .single();

            if (error) {
                setMessage('Failed to fetch profile.');
            } else {
                setProfile({ id: userId, ...data } as Omit<Profile, 'profile_pic_data' | 'profile_pic_type'>);
                setName(data?.name || '');
                setPhone(data?.phone || '');
                setDescription(data?.description || '');
            }
            setLoading(false);
        };

        fetchProfileData();
    }, [supabase]);

    const handleUpdateProfile = async () => {
        setMessage('');
        if (!profile?.id) {
            setMessage('No profile loaded. Cannot update.');
            return;
        }

        const cleanedPhone = phone.replace(/\D/g, '');
        if (cleanedPhone.length < 10) {
            setMessage('Phone number must be at least 10 digits.');
            return;
        }

        setLoading(true);

        const updates: Record<string, any> = {
            name,
            phone,
            description,
        };

        const { error } = await supabase
            .from('user-profile')
            .update(updates)
            .eq('id', profile.id);

        if (error) {
            setMessage('Failed to update profile.');
        } else {
            setMessage('Profile updated successfully!');
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        if (error) {
            setMessage('Logout failed.');
        } else {
            router.push('/logout');
        }
        setLoading(false);
    };

    const handleGoBack = () => {
        router.push('/dashboard');
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: COLORS.darkGreenBackground, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'absolute', top: '20px', left: '20px', cursor: 'pointer',  display: 'flex', alignItems: 'center', gap: '8px', color: COLORS.primaryGreen }}>
                    <BsFillArrowLeftCircleFill size={24} onClick={handleGoBack} />
                    <span onClick={handleGoBack} style={{ fontWeight: 'bold' }}>Go to Dashboard</span>
                </div>
            
            <div style={{ maxWidth: '1200px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', backgroundColor: '#f7f7f7', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', padding: '40px', position: 'relative' }}>
                {/* Go to Dashboard Button (Top Left) */}
                

                {/* Left Card - User Info (More Professional Look) */}
                <div style={{
                    backgroundColor: '#fff',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <h2 style={{ color: COLORS.primaryGreen, marginBottom: '25px', borderBottom: `1px solid ${COLORS.lightGray}`, paddingBottom: '10px' }}>Your Information</h2>
                    {profile && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <strong style={{ color: COLORS.darkGray, display: 'block', marginBottom: '5px' }}>Name:</strong>
                                <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#f9f9f9', border: `1px solid ${COLORS.lightGray}` }}>
                                    {profile.name || 'Not set'}
                                </div>
                            </div>
                            <div>
                                <strong style={{ color: COLORS.darkGray, display: 'block', marginBottom: '5px' }}>Phone:</strong>
                                <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#f9f9f9', border: `1px solid ${COLORS.lightGray}` }}>
                                    {profile.phone || 'Not set'}
                                </div>
                            </div>
                            <div>
                                <strong style={{ color: COLORS.darkGray, display: 'block', marginBottom: '5px' }}>Description:</strong>
                                <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#f9f9f9', border: `1px solid ${COLORS.lightGray}` }}>
                                    {profile.description || 'Not set'}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Card - Edit Profile */}
                <div style={{
                    backgroundColor: '#fff',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative' // Needed for absolute positioning of logout button
                }}>
                    <h2 style={{ color: COLORS.primaryGreen, marginBottom: '25px', borderBottom: `1px solid ${COLORS.lightGray}`, paddingBottom: '10px' }}>Edit Profile</h2>
                    {message && <p style={{ color: message.includes('Failed') ? 'red' : 'green', marginBottom: '15px' }}>{message}</p>}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={innovativeInputStyle}
                        />
                        <input
                            type="tel"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={innovativeInputStyle}
                        />
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ ...innovativeInputStyle, height: '120px' }}
                        />
                        <button
                            onClick={handleUpdateProfile}
                            style={updateButtonStyle}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                    {/* Logout Button (Bottom Right) */}
                  
                </div>
                  
            </div>
            <button
                        onClick={handleLogout}
                        style={{ ...logoutButtonStyle, position: 'absolute', bottom: '20px', right: '20px' }}
                        disabled={loading}
                    >
                        <IoLogOutOutline size={20} />
                        Logout
                    </button>
        </div>
    );
}

const innovativeInputStyle = {
    padding: '12px 15px',
    border: `1px solid ${COLORS.lightGray}`,
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: '#f9f9f9',
    transition: 'border-color 0.3s ease',
    '&:focus': {
        borderColor: COLORS.primaryGreen,
        outline: 'none',
    },
};

const updateButtonStyle = {
    backgroundColor: COLORS.primaryGreen,
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.05rem',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: 'darkgreen',
    },
    '&:disabled': {
        backgroundColor: '#ccc',
        cursor: 'not-allowed',
    },
};

const logoutButtonStyle = {
    backgroundColor: 'red',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: '#c82333',
    },
    '&:disabled': {
        backgroundColor: '#ccc',
        cursor: 'not-allowed',
    },
};