'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import Aside from '@/app/components/aside';
import { getApiBaseUrl } from '@/app/utils/api';

const TransferMoneyComponent = () => {
  const { data: session } = useSession();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSending(true);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await axios.post(`${baseUrl}/api/transferto`, {
        to: recipient,
        amount: Number(amount),
        user: Number(session?.user?.id),
      });

      if (res.status === 200) {
        setMessage('✅ Transfer successful');
        setRecipient('');
        setAmount('');
      } else {
        setMessage(`❌ ${res.data.message || 'Transfer failed'}`);
      }
    } catch (error) {
      setMessage('❌ Something went wrong');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 mt-10">
        <Aside />
      <div className="max-w-md mx-auto bg-gradient-to-tr from-indigo-50 to-white p-8 rounded-2xl shadow-2xl mt-30 h-1/2 " >
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">Send Money Instantly 💸</h2>

      <form onSubmit={handleTransfer} className="space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-600">Recipient Number</label>
          <input
            type="text"
            required
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter phone or user ID"
            className="w-full px-4 py-3 mt-1 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Amount (INR)</label>
          <input
            type="number"
            required
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-3 mt-1 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none transition"
          />
        </div>

        <button
          type="submit"
          disabled={isSending}
          className={`w-full py-3 text-white font-semibold rounded-xl transition ${
            isSending ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isSending ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2 h-5 w-5" /> Sending...
            </span>
          ) : (
            'Transfer Now'
          )}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center text-sm font-medium ${
            message.includes('✅') ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}
    </div>
    </div>

  );
};

export default TransferMoneyComponent;
