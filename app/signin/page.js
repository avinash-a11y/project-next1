'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import { signIn } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { getApiBaseUrl } from '../utils/api'

export default function SignIn() {
  const [ispageLoading, setIspageLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const passwordRef = useRef(null)
  const mobileRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl = getApiBaseUrl();
        const res = await fetch(`${baseUrl}/api/issigned`, {
          method: "GET",
          credentials: "include", // ✅ required for session
        })
        const json = await res.json()
        if (json.issigned === "true") {
          router.push("/dashboard")
        } else {
          setIspageLoading(false)
        }
      } catch (err) {
        console.error("Error checking session:", err)
        setIspageLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const phone = mobileRef.current?.value || ''
    const password = passwordRef.current?.value || ''
    setIsLoading(true)

    const res = await signIn('credentials', {
      phone,
      password,
      redirect: false,
    })

    setIsLoading(false)

    if (res?.ok) {
      router.push("/dashboard")
    } else {
      alert("Sign in failed")
    }
  }

  if (ispageLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='w-10 h-10 animate-spin' />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Sign In | Paytm Clone</title>
      </Head>
      <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-center text-[#0f4a8a]">Sign In to Paytm</h2>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your mobile number
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <span className="px-3 text-gray-500 bg-gray-100">+91</span>
              <input
                ref={mobileRef}
                type="tel"
                className="w-full px-4 py-2 outline-none text-gray-700"
                placeholder="Enter 10 digit number"
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mt-4">
              <input
                ref={passwordRef}
                type="password"
                maxLength={10}
                className="w-full px-4 py-2 outline-none text-gray-700"
                placeholder="Enter Password"
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-[#00baf2] hover:bg-[#039be5] text-white font-semibold py-2 rounded-lg transition"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className='w-5 h-5 animate-spin mx-auto' /> : "Sign In"}
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              By continuing, you agree to our <span className="text-blue-600 underline">Terms of Service</span> & <span className="text-blue-600 underline">Privacy Policy</span>
            </p>
          </div>

          <div className="mt-6 text-center text-sm text-gray-400">
            Need help? <a href="#" className="text-blue-500 hover:underline">Contact Support</a>
          </div>
        </div>
      </div>
    </>
  )
}
