// components/UserMessageCountChart.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Counts {
  userCount: number;
  messageCount: number;
  contactCount: number;
}

const UserMessageCountChart = () => {
  const [counts, setCounts] = useState<Counts>({ userCount: 0, messageCount: 0, contactCount: 0 });
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data: users, error: userError } = await supabase
          .from('user-profile') // Assuming your user profiles are in 'user-profile'
          .select('id', { count: 'exact' });

        if (userError) {
          console.error('Error fetching user count:', userError);
        }

        const { data: messages, error: messageError } = await supabase
          .from('messages')
          .select('id', { count: 'exact' });

        if (messageError) {
          console.error('Error fetching message count:', messageError);
        }

        const { data: contacts, error: contactError } = await supabase
          .from('contacts')
          .select('id', { count: 'exact' });

        if (contactError) {
          console.error('Error fetching contact count:', contactError);
        }

        setCounts({
          userCount: users ? users.length : 0,
          messageCount: messages ? messages.length : 0,
          contactCount: contacts ? contacts.length : 0,
        });
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchCounts();
  }, [supabase]);

  const data = {
    labels: ['Users', 'Messages', 'Contacts'],
    datasets: [
      {
        label: 'Count',
        data: [counts.userCount, counts.messageCount, counts.contactCount],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Number of Users, Messages, and Contacts',
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
      <div style={{ height: '300px' }}>
        <Bar data={data} options={options} />
      </div>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <p style={{ fontWeight: 'bold' }}>Users: {counts.userCount}</p>
        <p style={{ fontWeight: 'bold' }}>Messages Sent: {counts.messageCount}</p>
        <p style={{ fontWeight: 'bold' }}>Contacts: {counts.contactCount}</p>
      </div>
    </div>
  );
};

export default UserMessageCountChart;