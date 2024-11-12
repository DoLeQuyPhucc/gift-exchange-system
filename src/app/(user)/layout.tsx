import MainLayout from "../components/layout/MainLayouts"
import AuthProvider from "../components/providers/AuthProvider"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <MainLayout>
        {children}
      </MainLayout>
    </AuthProvider>
  )
}