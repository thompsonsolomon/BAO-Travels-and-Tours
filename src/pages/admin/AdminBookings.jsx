import { useState, useEffect } from "react"
import { collection, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Calendar, Users, Mail, Phone, Clock } from "lucide-react"
import { AdminSidebar } from "../../components/admin/AdminSidebar"

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [tourBookings, setTourBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("travel")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      // Fetch travel bookings
      const travelQuery = query(collection(db, "travel-bookings"), orderBy("createdAt", "desc"))
      const travelSnapshot = await getDocs(travelQuery)
      const travelBookings = travelSnapshot.docs.map((doc) => ({
        id: doc.id,
        type: "travel",
        ...doc.data(),
      }))

      // Fetch tour bookings
      const tourQuery = query(collection(db, "tour-bookings"), orderBy("createdAt", "desc"))
      const tourSnapshot = await getDocs(tourQuery)
      const tourBookingsData = tourSnapshot.docs.map((doc) => ({
        id: doc.id,
        type: "tour",
        ...doc.data(),
      }))

      setBookings(travelBookings)
      setTourBookings(tourBookingsData)
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  console.log(bookings)
  const updateBookingStatus = async (bookingId, status, type) => {
    try {
      const collectionName = type === "travel" ? "travel-bookings" : "tour-bookings"
      await updateDoc(doc(db, collectionName, bookingId), {
        status: status,
        updatedAt: new Date(),
      })
      fetchBookings()
    } catch (error) {
      console.error("Error updating booking status:", error)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", label: "Pending" },
      confirmed: { variant: "default", label: "Confirmed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
      completed: { variant: "outline", label: "Completed" },
    }
    const config = statusConfig[status] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", label: "Pending" },
      completed: { variant: "default", label: "Paid" },
      failed: { variant: "destructive", label: "Failed" },
    }
    const config = statusConfig[status] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const formatDate = (date) => {
    if (!date) return "N/A"
    const dateObj = date.toDate ? date.toDate() : new Date(date)
    return dateObj.toLocaleDateString()
  }

  const currentBookings = activeTab === "travel" ? bookings : tourBookings

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
            <div className="flex space-x-4 mt-4">
              <Button  className="bg-[#ac3500]" variant={activeTab === "travel" ? "default" : "outline"} onClick={() => setActiveTab("travel")}>
                Travel Packages ({bookings.length})
              </Button>
              <Button className="bg-[#ac3500] " variant={activeTab === "tours" ? "default" : "outline"} onClick={() => setActiveTab("tours")}>
                Tours ({tourBookings.length})
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {currentBookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground">
                    {activeTab === "travel" ? "Travel package" : "Tour"} bookings will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {currentBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{booking.packageTitle || booking.tourTitle}</CardTitle>
                          <CardDescription>Booking ID: {booking.id.slice(-8)}</CardDescription>
                        </div>
                        {/* <div className="flex flex-col space-y-2">
                          {getStatusBadge(booking.status)}
                          {getPaymentStatusBadge(booking.paymentStatus)}
                        </div> */}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Customer Information */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Customer Details</h4>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.customerName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.customerEmail}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.customerPhone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Booking Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {booking.travelers || booking.participants}{" "}
                              {booking.type === "travel" ? "travelers" : "participants"}
                            </span>
                          </div>
                        
                          {booking.timeSlot && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{booking.timeSlot}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{formatCurrency(booking.amount)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Special Requests */}
                      {booking.specialRequests && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Special Requests</h4>
                          <p className="text-sm text-muted-foreground">{booking.specialRequests}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-2 pt-2">
                        {booking.status === "pending" && (
                          <Button size="sm" onClick={() => updateBookingStatus(booking.id, "confirmed", booking.type)}>
                            Confirm
                          </Button>
                        )}
                        {booking.status === "confirmed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBookingStatus(booking.id, "completed", booking.type)}
                          >
                            Mark Complete
                          </Button>
                        )}
                      
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
