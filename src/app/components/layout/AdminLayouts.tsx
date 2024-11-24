import AdminNavbar from './AdminNavbar'
import Footer from './Footer'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AdminNavbar />
      <main className="min-h-screen bg-gray-100 pt-16">
        <div className="w-4/5 container mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </>
  )
}