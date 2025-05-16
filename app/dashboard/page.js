import { redirect } from 'next/navigation';
import TransactionChart from '../components/transactionschart';
import { getServerSession } from 'next-auth';
import Aside from '@/app/components/aside';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getApiBaseUrl } from '../utils/api';
import { NextResponse } from 'next/server';

// Tell Next.js this is a dynamic page that should not be statically generated
export const dynamic = 'force-dynamic';

// Helper function for error handling
const errorWrapper = async (fn) => {
  try {
    return await fn();
  } catch (error) {
    console.error('Dashboard error:', error);
    throw new Error(`Dashboard error: ${error.message}`);
  }
};

const Page = async () => {
  return errorWrapper(async () => {
    console.log('Dashboard page rendering started');
    
    // Get user session
    let session;
    try {
      session = await getServerSession(authOptions);
      console.log('Session check result:', session ? 'Session found' : 'No session');
    } catch (error) {
      console.error('Session retrieval error:', error);
      throw new Error(`Unable to get user session: ${error.message}`);
    }
    
    if (!session) {
      console.log("No session, redirecting to signin");
      redirect('/signin');
    }
    
    console.log('User authenticated:', session.user.id);

    // Use relative URLs for server components
    const baseUrl = '';  // Empty string for relative URLs
    
    // Safely fetch transactions
    let txData = { transactions: [] };
    try {
      console.log(`Fetching transactions for user ${session.user.id}`);
      const txRes = await fetch(`/api/transactions?user=${session.user.id}`, {
        cache: "no-store"
      });
      
      if (!txRes.ok) {
        console.error(`Transaction fetch failed with status: ${txRes.status}`);
        throw new Error(`Failed to fetch transactions: ${txRes.statusText}`);
      }
      
      txData = await txRes.json();
      console.log(`Fetched ${txData.transactions?.length || 0} transactions`);
    } catch (error) {
      console.error('Transaction fetch error:', error);
      // Continue with empty transactions rather than failing
      txData = { transactions: [] };
    }
    
    const recentTransactions = txData.transactions || [];
    
    // Get greeting based on time of day
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };

    console.log('Dashboard rendering completed successfully');

    return (
      <div className="flex min-h-screen bg-gray-50">
        <Aside />
        
        <main className="flex-1 p-8 overflow-y-auto w-[80%] ml-[20%] mt-20">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8">
              <h2 className="text-3xl font-bold text-[#4B3F72]">{getGreeting()}, {session.user.name || 'User'} 👋</h2>
              <p className="text-gray-500 mt-1">Welcome to your financial dashboard</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Portfolio Overview</h3>
                </div>
                <div className="w-full h-[500px]">
                  <TransactionChart userId={session.user.id} />
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
                
                {recentTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {recentTransactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            <span className="text-lg">
                              {tx.amount > 0 ? '↓' : '↑'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{tx.amount > 0 ? 'Deposit' : 'Withdrawal'}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className={`font-semibold ${
                          tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6">No recent transactions</p>
                )}
                
                <a href="/dashboard/transactions" className="block text-center text-purple-600 font-medium mt-4 py-2 hover:text-purple-800">
                  View all transactions →
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <a href="/dashboard/tonumber" className="bg-white/20 rounded-lg p-4 text-center hover:bg-white/30 transition">
                    <span className="block text-2xl mb-1">🔁</span>
                    <span className="font-medium">Transfer</span>
                  </a>
                  <a href="/dashboard/transfer" className="bg-white/20 rounded-lg p-4 text-center hover:bg-white/30 transition">
                    <span className="block text-2xl mb-1">💰</span>
                    <span className="font-medium">Deposit</span>
                  </a>
                  <a href="/dashboard" className="bg-white/20 rounded-lg p-4 text-center hover:bg-white/30 transition">
                    <span className="block text-2xl mb-1">💸</span>
                    <span className="font-medium">Withdraw</span>
                  </a>
                    <a href="/dashboard/settings" className="bg-white/20 rounded-lg p-4 text-center hover:bg-white/30 transition">
                    <span className="block text-2xl mb-1">⚙️</span>
                    <span className="font-medium">Settings</span>
                  </a>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Assets</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">₹</span>
                      </div>
                      <div>
                        <p className="font-medium">INR</p>
                        <p className="text-xs text-gray-500">Indian Rupee</p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ₹0.00
                    </p>
                  </div>
                  
                  <div className="text-center py-6">
                    <p className="text-gray-500">More assets coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  });
};

export default Page;
