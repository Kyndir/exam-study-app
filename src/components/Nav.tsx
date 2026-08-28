'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavProps {
  userEmail: string | undefined
}

export default function Nav({ userEmail }: NavProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/review', label: 'Review' },
    { href: '/references', label: 'References' },
  ]

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-surface-1 border-b border-surface-4 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-teal-dim flex items-center justify-center">
              <svg className="w-5 h-5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="font-bold text-gray-100 hidden sm:block">SF Admin Study</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive(link.href)
                    ? 'text-teal bg-teal-dim'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-surface-3'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop user */}
          <div className="hidden md:flex items-center gap-3">
            {userEmail && (
              <span className="text-sm text-gray-500 truncate max-w-[180px]">{userEmail}</span>
            )}
            <form action="/auth/logout" method="POST">
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-100 hover:bg-surface-3 transition"
              >
                Sign out
              </button>
            </form>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-surface-3 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-surface-4 pt-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive(link.href)
                    ? 'text-teal bg-teal-dim'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-surface-3'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-surface-4 flex items-center justify-between px-4">
              {userEmail && (
                <span className="text-xs text-gray-500 truncate max-w-[180px]">{userEmail}</span>
              )}
              <form action="/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-gray-400 hover:text-gray-100 transition"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
