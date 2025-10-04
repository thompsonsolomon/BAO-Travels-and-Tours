import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../../lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { AdminSidebar } from "../../components/admin/AdminSidebar"
import { AdminOverview } from "../../components/admin/AdminOverview"
import { Button } from "../../components/ui/button"
import { LogOut } from "lucide-react"

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        navigate("/admin/login")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [navigate])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      navigate("/admin/login")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold text-[#ac3500]">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <AdminOverview />
        </main>
      </div>
    </div>
  )
}
