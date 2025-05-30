'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { COLORS, Profile } from '@/app/lib/utils';
import defaultProfileImage from '@/../public/default-image.jpeg';
import { redirect } from 'next/navigation';


export default function ProfilePage() {
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(defaultProfileImage.src);

  
  useEffect(() => {
    const fetchProfileData = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        redirect('/login')
        return;
      }
      const userId = user.id;
      const { data, error } = await supabase
        .from('user-profile')
        .select('name, phone, description, profile_pic_data, profile_pic_type')
        .eq('id', userId)
        .single();

      if (error) {
        setMessage('Failed to fetch profile.');
      } else {
        setProfile({ id: userId, ...data } as Profile);
        setName(data?.name || '');
        setPhone(data?.phone || '');
        setDescription(data?.description || '');

        if (data?.profile_pic_data && data?.profile_pic_type) {
          const imageUrl = `data:${data.profile_pic_type};base64,${data.profile_pic_data}`;
          setPreviewUrl(imageUrl);
        } else {
          setPreviewUrl(defaultProfileImage.src);
        }
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

    const updates: any = {
      name,
      phone,
      description,
    };

    if (file) {
      const base64Image = await toBase64(file);
      updates.profile_pic_data = (base64Image as string).split(',')[1];
      updates.profile_pic_type = file.type;
    }

    const { error } = await supabase
      .from('user-profile')
      .update(updates)
      .eq('id', profile.id);

    if (error) {
      setMessage('Failed to update profile.');
    } else {
      setMessage('Profile updated successfully!');
      if (file) {
        const base64Image = await toBase64(file);
        setPreviewUrl(base64Image as string);
        setFile(null);
      }
    }

    setLoading(false);
  };

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const toBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };


  return (
    <div style={{ minHeight: '100vh', backgroundColor: COLORS.darkGreenBackground, padding: '40px' }}>
      <div style={{ maxWidth: '1100px', margin: 'auto', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>

        {/* Left Card */}
        <div style={{
          flex: '1',
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: COLORS.primaryGreen, marginBottom: '20px' }}>Your Profile</h2>
          <img
            src={previewUrl}
            alt="Profile Picture"
            onError={(e) => ((e.target as HTMLImageElement).src = defaultProfileImage.src)}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '20px',
              border: '2px solid #eee'
            }}
          />
          {profile && (
            <>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
              <p><strong>Description:</strong> {profile.description}</p>
            </>
          )}
        </div>

        {/* Right Card */}
        <div style={{
          flex: '2',
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: COLORS.primaryGreen, marginBottom: '20px' }}>Edit Profile</h2>
          {message && <p style={{ color: message.includes('Failed') ? 'red' : 'green' }}>{message}</p>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="file" accept="image/*" onChange={handleFileSelection} />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...inputStyle, height: '100px' }}
            />
            <button
              onClick={handleUpdateProfile}
              style={{
                backgroundColor: loading ? '#ccc' : COLORS.primaryGreen,
                color: '#fff',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem'
              }}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Update Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '1rem',
};
