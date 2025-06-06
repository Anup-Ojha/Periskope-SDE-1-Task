// components/AddContactButton.tsx
import React, { useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { addContact } from './api.chat';
import { TbMessageCirclePlus } from 'react-icons/tb';

interface AddContactButtonProps {
  onContactAdded: () => void;
}

const AddContactButton: React.FC<AddContactButtonProps> = ({ onContactAdded }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddButtonClick = () => {
    setIsFormOpen(true);
    setFormError(null);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setName('');
    setMobileNumber('');
    setFormError(null);
    setIsSubmitting(false);
  };

  const isValidMobileNumber = (number: string): boolean => {
    const cleanedNumber = number.replace(/\s/g, '');
    return /^[0-9]{10}$/.test(cleanedNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const trimmedName = name.trim();
    const cleanedMobileNumber = mobileNumber.replace(/\s/g, '');

    if (!trimmedName) {
      setFormError('Name cannot be empty.');
      setIsSubmitting(false);
      return;
    }

    if (!isValidMobileNumber(cleanedMobileNumber)) {
      setFormError('Please enter a valid 10-digit mobile number.');
      setIsSubmitting(false);
      return;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('User not authenticated:', userError);
      setFormError('You must be logged in to add contacts.');
      setIsSubmitting(false);
      return;
    }

    const result = await addContact(trimmedName, cleanedMobileNumber, user.id);

    if (result.success) {
      console.log('Contact added successfully');
      handleCloseForm();
      onContactAdded();
    } else {
      setFormError(result.error?.message || JSON.stringify(result.error) || 'Failed to add contact. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits and spaces, optionally limit length here
    const input = e.target.value;
    if (/^[0-9\s]*$/.test(input)) {
      setMobileNumber(input);
    }
  };

  return (
    <>
      {/* Floating Add Button */}
      <div
        style={{
          position: 'absolute',
          top: '90%',
          left: '26%',
          backgroundColor: 'green',
          color: 'white',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '32px',
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
          zIndex: 998,
        }}
        onClick={handleAddButtonClick}
        aria-label="Add new contact"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') handleAddButtonClick(); }}
      >
        <TbMessageCirclePlus size={24} />
      </div>

      {/* Modal Overlay */}
      {isFormOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-contact-title"
        >
          <div
            style={{
              backgroundColor: '#fefefe',
              padding: '30px 25px',
              borderRadius: '12px',
              boxShadow: '0 6px 24px rgba(0, 0, 0, 0.2)',
              width: '90%',
              maxWidth: '400px',
              fontFamily: 'Segoe UI, sans-serif',
              zIndex: 1000,
            }}
          >
            <h3
              id="add-contact-title"
              style={{ marginBottom: '15px', fontSize: '20px', fontWeight: '600', color: '#333' }}
            >
              Add New Contact
            </h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '14px', color: '#555' }}>
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                  style={{
                    marginTop: '4px',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    width: '100%',
                    fontSize: '14px',
                  }}
                  required
                  autoFocus
                  aria-required="true"
                />
              </label>
              <label style={{ fontSize: '14px', color: '#555' }}>
                Mobile Number:
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={handleMobileNumberChange}
                  placeholder="Enter 10-digit mobile number"
                  style={{
                    marginTop: '4px',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    width: '100%',
                    fontSize: '14px',
                  }}
                  required
                  aria-required="true"
                />
              </label>
              {formError && (
                <p style={{ color: '#d93025', fontSize: '13px', marginTop: '2px' }} role="alert">
                  {formError}
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    backgroundColor: '#fff',
                    color: '#333',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    backgroundColor: '#25D366',
                    color: '#fff',
                    border: 'none',
                    fontWeight: '500',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.6 : 1,
                  }}
                >
                  {isSubmitting ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddContactButton;
