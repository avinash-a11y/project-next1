"use client"
import React from 'react'
import { SessionProvider } from 'next-auth/react'
const provider = ({children}) => {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}

export default provider