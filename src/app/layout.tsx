'use client'

import { Inter } from 'next/font/google'
import Navbar from './components/layout/Navbar'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Footer from './components/layout/Footer'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import LoadingSpinner from './components/spinner-loading/spinnerLoading'

const inter = Inter({ subsets: ['latin'] })

const publicRoutes = ['/auth', '/']

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    setIsAuthenticated(!!userId)

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
    
    if (!userId && !isPublicRoute) {
      router.push('/auth')
    } else if (userId && pathname === '/auth') {
      router.push('/')
    }
  }, [pathname, router])

  if (isAuthenticated === null) {
    return (
      <html lang="vi">
        <body className={inter.className}>
           <LoadingSpinner width = '12' height = '12' color = 'orange-500' />
        </body>
      </html>
    )
  }

  if (!isAuthenticated && pathname.startsWith('/auth')) {
    return (
      <html lang="vi">
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </html>
    )
  }

  // Layout chính khi đã authenticated
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gray-100 pt-16">
          <div className="w-4/5 container mx-auto">
            {children}
          </div>
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}