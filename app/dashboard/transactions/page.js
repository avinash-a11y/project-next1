import React from 'react'
import OnRampTransactionComponent from '@/app/components/onramtrans'
import Aside from '@/app/components/aside'
const page = () => {
  return (
    <div className='flex min-h-screen bg-gray-50 mt-10'>
        <Aside />
        <main className='flex-1 p-10 w-[80%] ml-[20%]'>
            <OnRampTransactionComponent />
        </main>
    </div>
  )
}

export default page