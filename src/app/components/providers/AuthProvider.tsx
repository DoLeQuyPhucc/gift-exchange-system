'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import LoadingSpinner from '../spinner-loading/spinnerLoading'
import { useUser } from '@/app/hooks/useUser'

const publicRoutes = ['/auth' , '/products']

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { userId, userRole } = useUser()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  useEffect(() => {
    console.log('userId', userId)
    console.log('userRole', userRole)
    
    setIsAuthenticated(!!userId)

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
    const isAdminRoute = pathname.startsWith('/admin')

    if (!userId && !isPublicRoute) {
      // Chưa đăng nhập -> redirect to auth
      router.push('/auth')
      return
    }

    if (userId && pathname === '/auth') {
      // Đã đăng nhập, đang ở trang auth -> redirect về trang phù hợp với role
      if (userRole === 'Admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
      return
    }

    // Xử lý routing dựa trên role
    if (userRole === 'Admin') {
      // Admin chỉ được vào /admin/* 
      if (!isAdminRoute && !isPublicRoute) {
        router.push('/admin')
      }
    } else {
      // User thường không được vào /admin/*
      if (isAdminRoute) {
        router.push('/')
      }
    }

  }, [pathname, router, userId, userRole])

  // Đang kiểm tra authentication
  if (isAuthenticated === null) {
    return <LoadingSpinner width="12" height="12" color="orange-500" />
  }

  // Cho phép truy cập trang auth khi chưa đăng nhập
  if (!isAuthenticated && pathname.startsWith('/auth')) {
    return <>{children}</>
  }

  // Chặn admin truy cập các route không phải /admin/*
  if (userRole === 'Admin' && !pathname.startsWith('/admin')) {
    router.push('/admin')
    return <LoadingSpinner width="12" height="12" color="orange-500" />
  }

  // Chặn user thường truy cập /admin/*
  if (userRole !== 'Admin' && pathname.startsWith('/admin')) {
    router.push('/')
    return <LoadingSpinner width="12" height="12" color="orange-500" />
  }

  return children
}