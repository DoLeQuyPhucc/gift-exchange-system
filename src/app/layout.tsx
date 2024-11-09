// app/layout.tsx
import { Inter } from 'next/font/google'
import Navbar from './components/layout/Navbar'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'E-commerce Store',
  description: 'Modern e-commerce store built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gray-100 pt-16">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}