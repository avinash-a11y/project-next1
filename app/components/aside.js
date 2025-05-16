'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Aside = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
    { icon: '🔁', label: 'Transfer', path: '/dashboard/tonumber' },
    { icon: '💰', label: 'Deposit', path: '/dashboard/transfer' },
    { icon: '⏱️', label: 'Transactions', path: '/dashboard/transactions' },
  ];

  return (
    <aside className={`w-[17%] bg-white shadow-md border-r transition-all duration-300 flex flex-col fixed top-0 left-0 h-screen`}>
      <nav className="p-4 flex-1 mt-20">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                href={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  pathname === item.path 
                    ? 'bg-[#00baf2]/10 text-[#00baf2] font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto p-4 border-t">
        {!collapsed && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Need help?</p>
            <Link 
              href="/support"
              className="text-[#00baf2] hover:underline text-sm font-medium flex items-center gap-2"
            >
              <span>🛟</span>
              <span>Contact Support</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Aside;