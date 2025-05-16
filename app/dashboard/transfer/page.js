'use client';

import React, { useState, useEffect } from 'react';
import AddMoneyComponent from '@/app/components/addmoney';
import BalanceComponent from '@/app/components/balance';
import OnRampTransactionComponent from '@/app/components/onramtrans';
import Aside from '@/app/components/aside';
export default function TransferPage() {
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    console.log(refresh);
  }, [refresh]);

  return (
    <div className="flex h-screen bg-gray-50 mt-10">
      {/* Sidebar */}
      <Aside />
      {/* Main Content */}
      <main className="flex-1 p-10 w-[80%] ml-[20%]">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side - Add Money */}
          <AddMoneyComponent refresh={refresh} setRefresh={setRefresh} />

          {/* Right Side - Balance and Recent Transactions */}
          <div className="space-y-6">
            <BalanceComponent refresh={refresh} />
           
          </div>
        </div>
      </main>
    </div>
  );
}
