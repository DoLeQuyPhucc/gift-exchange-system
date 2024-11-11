import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    return (
      <html lang="vi">
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </html>
    )
}