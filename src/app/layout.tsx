import type { Metadata } from 'next'
import './globals.css'
import AppProviders from '@/components/app-providers'
import { AppHeader } from '@/components/app-header'
import React from 'react'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'GM Raffle',
  description: 'A Solana-powered daily GM raffle',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <body className="min-h-screen bg-background">
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <AppHeader />
            <main className="flex-1">{children}</main>
          </div>
        </AppProviders>
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: '#181c2f', color: '#fff', border: '1px solid #3b3b5c' },
            success: { iconTheme: { primary: '#a18cd1', secondary: '#fbc2eb' } },
            error: { iconTheme: { primary: '#ff6b81', secondary: '#181c2f' } },
          }}
        />
      </body>
    </html>
  )
}

// Patch BigInt so we can log it using JSON.stringify without any errors
declare global {
  interface BigInt {
    toJSON(): string
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString()
}
