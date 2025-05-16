'use client'

import Link from 'next/link'
import Image from 'next/image' 
import { signOut, useSession } from 'next-auth/react'

const Navbar = () => {
  const { data: session, status } = useSession()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="https://1000logos.net/wp-content/uploads/2023/03/Paytm-logo.png"
                alt="Paytm Logo"
                width={85}
                height={36}
                className="cursor-pointer"
              />
            </Link>
          </div>

          <div className="flex items-center">
            <nav className="hidden md:flex items-center">
              <Link href="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link href="/dashboard/transactions" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Transactions
              </Link>
              <Link href="/dashboard/transfer" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Transfer
              </Link>
            </nav>
            
            <div className="flex items-center ml-4">
              {status === 'authenticated' ? (
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 flex items-center justify-center h-8 w-8 text-center mr-2">
                    <span className="text-blue-800 font-semibold">U</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 mr-3">
                    User
                  </span>
                  <Link 
                    href="/dashboard" 
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <span className="text-gray-400 mx-1">|</span>
                  <button
                    onClick={() => signOut()}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/signin"
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
