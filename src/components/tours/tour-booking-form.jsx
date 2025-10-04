import { useState } from "react"
import { addDoc, collection, updateDoc, doc } from "firebase/firestore"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Alert, AlertDescription } from "../ui/alert"
import { Calendar, Users, CreditCard, CheckCircle, Clock, X } from "lucide-react"
import PaystackPop from "@paystack/inline-js"
import { db } from "../../lib/firebase"


export function TourBookingForm({ tourData, onClose }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    participants: 1,
    tourDate: "",
    timeSlot: "",
    specialRequests: "",
  })
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [bookingId, setBookingId] = useState(null)

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseInt(value) : value,
    }))
  }

  const calculateTotal = () => {
    return tourData?.price * formData.participants
  }
  const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_TEST_PUBLIC_kEY


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const bookingData = {
        tourId: tourData.id,
        tourTitle: tourData.title,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        participants: formData.participants,
        specialRequests: formData.specialRequests,
        amount: calculateTotal(),
        paymentStatus: "Paid",
        status: "Confirmed",
        createdAt: new Date(),
      }

      const paystack = new PaystackPop()
      paystack.newTransaction({
        key: PAYSTACK_KEY,
        email: formData.email,
        amount: calculateTotal() * 100,
        currency: "NGN",
        onSuccess: async (transaction) => {

          // Save booking data to Firebase only after payment success
          const finalBookingData = {
            ...bookingData,
            paymentStatus: "Paid",
            transactionRef: transaction.reference,
          }

          const docRef = await addDoc(collection(db, "tour-bookings"), finalBookingData)

          setPaymentStatus("success")
          setLoading(false)
        },
        onCancel: () => {
          setPaymentStatus("failed")
          setLoading(false)
        },
      })
    } catch (error) {
      console.error("Booking error:", error)
      setPaymentStatus("failed")
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 overflow-auto bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-full max-w-2xl mx-4 mt-32 max-md:top-[35%] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        {paymentStatus === "success" ? (
          <Card className="w-full shadow-none border-0">
            <CardContent className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Tour Booked!</h3>
              <p className="text-muted-foreground mb-4">
                Your tour has been confirmed. You will receive a confirmation email with details.
              </p>
              <p className="text-sm text-muted-foreground mb-4">Booking ID: {bookingId}</p>
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        ) : paymentStatus === "failed" ? (
          <Card className="w-full shadow-none border-0">
            <CardContent className="text-center py-8">
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>Payment failed. Please try again or contact support.</AlertDescription>
              </Alert>
              <Button onClick={() => setPaymentStatus(null)} variant="outline" className="mr-2">
                Try Again
              </Button>
              <Button onClick={onClose}>Close</Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full shadow-none border-0">
            <CardHeader>
              <CardTitle>Book Your Tour</CardTitle>
              <CardDescription>Complete your booking for {tourData?.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Tour Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tour Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="participants">Number of Participants</Label>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="participants"
                          name="participants"
                          type="number"
                          min="1"
                          max="20"
                          value={formData.participants}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>


                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                    <Textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Any special requirements, accessibility needs, or other requests..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h3 className="text-lg font-semibold">Booking Summary</h3>
                  <div className="flex justify-between">
                    <span>Tour Price (per person)</span>
                    <span>₦{tourData?.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of Participants</span>
                    <span>{formData.participants}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>₦{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Button */}
                <div className="flex space-x-4">
                  <Button type="submit" disabled={loading} className="flex-1 bg-black text-white hover:bg-amber-700">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {loading ? "Processing..." : `Pay ₦${calculateTotal().toLocaleString()}`}
                  </Button>
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
