import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SF Admin Study | Salesforce Exam Prep',
  description: 'Prepare for the Salesforce Administrator certification exam with practice questions, explanations, and progress tracking.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-brand-dark">
          {children}
        </div>
      </body>
    </html>
  )
}
