'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const OnRampTransactionComponent = ({ refresh }) => {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== 'authenticated') return;
    
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/transactions?user=${session.user.id}`);
        const data = await response.json();
        setTransactions(data.transactions || []);
        console.log(data.transactions)
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [session, status, refresh]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  const statusColor = {
    COMPLETED: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    FAILED: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg m-10 mt-20">

      <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Transactions</h3>

      {loading ? (
        <p className="text-gray-500">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-400">No recent transactions found.</p>
      ) : (
        <ul className="divide-y divide-gray-200 pr-2">
          {transactions.map((txn) => (
            <li key={txn.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Token: <span className="text-gray-600">{txn.token}</span>
                </p>
                <p className="text-xs text-gray-500">Date: {formatDate(txn.createdAt)}</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700">{txn.amount} INR</p>
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${statusColor[txn.status] || 'bg-gray-100 text-gray-600'}`}
                >
                  {txn.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OnRampTransactionComponent;
