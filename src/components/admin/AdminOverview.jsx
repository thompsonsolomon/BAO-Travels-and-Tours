import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Package, MapPin, CreditCard, TrendingUp, Calendar } from "lucide-react"

export function AdminOverview() {
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalTours: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])


  const fetchStats = async () => {
    try {
      // Fetch packages count
      const packagesSnapshot = await getDocs(collection(db, "packages"))
      const totalPackages = packagesSnapshot.size

      // Fetch tours count
      const toursSnapshot = await getDocs(collection(db, "tours"))
      const totalTours = toursSnapshot.size

      // Fetch bookings (travel + tours)
      const travelSnapshot = await getDocs(collection(db, "travel-bookings"))
      const tourSnapshot = await getDocs(collection(db, "tour-bookings"))

      const allBookings = [
        ...travelSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: "travel",
          ...doc.data(),
        })),
        ...tourSnapshot.docs.map((doc) => ({
          id: doc.id,
          type: "tour",
          ...doc.data(),
        })),
      ]

      const totalBookings = allBookings.length

      // Calculate total revenue
      const totalRevenue = allBookings.reduce(
        (sum, booking) => sum + (booking.amount || 0),
        0
      )

      // Get 5 most recent bookings
      const recentBookings = allBookings
        .filter((b) => b.createdAt) // only ones with valid timestamp
        .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate())
        .slice(0, 5)

      // ✅ Update state
      setStats({
        totalPackages,
        totalTours,
        totalBookings,
        totalRevenue,
        recentBookings,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPackages}</div>
            <p className="text-xs text-muted-foreground">Travel packages available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tours</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTours}</div>
            <p className="text-xs text-muted-foreground">Tour experiences available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">Bookings received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">Revenue generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest booking requests from customers</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentBookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No recent bookings</p>
          ) : (
            <div className="space-y-4">
              {stats.recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{booking.customerName || "Unknown Customer"}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.packageTitle || booking.tourTitle || "Unknown Package"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(booking.amount || 0)}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.createdAt?.toDate?.()?.toLocaleDateString() || "Unknown Date"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
