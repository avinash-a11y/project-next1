'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getApiBaseUrl } from './utils/api';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/api/issigned`);
        const json = await res.json();
        setIsLoggedIn(json.issigned);
        setLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pt-20 pb-16 md:pt-28 md:pb-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Manage Your Finances <span className="text-[#00baf2]">Seamlessly</span>
            </h1>
            <p className="text-lg text-gray-600">
              Track your expenses, make transfers, and monitor your portfolio all in one place.
              Simple, secure, and designed for your financial success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {isLoggedIn ? (
                <Link href="/dashboard" className="bg-[#00baf2] hover:bg-[#00a0d6] text-white font-medium px-8 py-3 rounded-lg text-center transition-colors">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/signin" className="bg-[#00baf2] hover:bg-[#00a0d6] text-white font-medium px-8 py-3 rounded-lg text-center transition-colors">
                    Sign In
                  </Link>
                  <Link href="/signin" className="bg-white text-[#00baf2] border-2 border-[#00baf2] font-medium px-8 py-3 rounded-lg text-center hover:bg-gray-50 transition-colors">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="relative w-full max-w-md mx-auto lg:max-w-full h-[350px] md:h-[400px]">
              <Image
                src="https://img.freepik.com/free-vector/finance-app-interface-mobile-phone_23-2148603256.jpg"
                alt="Financial Dashboard"
                fill
                style={{objectFit: 'contain'}}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Our Platform</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#00baf2] mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
              <p className="text-gray-600">End-to-end encrypted transactions ensure your financial data stays protected.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">Powerful visualization tools to track your spending patterns and financial growth.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Transfers</h3>
              <p className="text-gray-600">Send and receive money instantly with just a few clicks, anytime and anywhere.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Take Control of Your Finances?</h2>
          <p className="text-lg text-gray-600 mb-8">Join thousands of users who are already managing their money smarter.</p>
          
          <Link href="/signin" className="bg-[#00baf2] hover:bg-[#00a0d6] text-white font-medium px-8 py-3 rounded-lg inline-block transition-colors">
            Get Started Today
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">© 2025 FinTech App. All rights reserved.</p>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
