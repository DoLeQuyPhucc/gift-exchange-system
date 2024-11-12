'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import LoadingSpinner from '../spinner-loading/spinnerLoading'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'

const publicRoutes = ['/auth', '/', '/products']

export default function AuthenticatedLayout({
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
        <div className='bg-gray-100' style={{height: '100vh', width: '100vw'}}>
            <LoadingSpinner width="42px" height="42px" color="#f97316" />
        </div>
    )
  }

  if (!isAuthenticated && pathname.startsWith('/auth')) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-100 pt-16">
        <div className="w-4/5 container mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}
