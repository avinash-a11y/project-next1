'use client';

import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';

const BalanceComponent = ({refresh}) => {
  const [balance, setBalance] = useState(0);
  const [locked, setLocked] = useState(0);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
        if(!session){
            return;
        }
        const response = await fetch(`http://localhost:3000/api/addmoney?user=${session.user.id}`);
      const data = await response.json();
      setBalance(data.balance[0].amount);
        console.log(data.balance[0].amount);
        setLoading(false);
    };
    fetchBalance();
  }, [session, refresh]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-10">
      <h3 className="text-xl font-semibold mb-4">Balance</h3>
      <div className="flex justify-between py-2 border-b">
        <span>Unlocked balance</span>
        <span>{loading ? "Loading..." : balance} INR</span>
      </div>
      <div className="flex justify-between py-2 border-b">
        <span>Total Locked Balance</span>
        <span>{loading ? "Loading..." : locked} INR</span>
      </div>
      <div className="flex justify-between py-2">
        <span>Total Balance</span>
        <span>{loading ? "Loading..." : balance} INR</span>
      </div>
    </div>
  );
};

export default BalanceComponent;
