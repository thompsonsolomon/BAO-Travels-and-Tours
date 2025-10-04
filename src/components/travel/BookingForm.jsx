// components/BookingForm.jsx
import React, { useEffect, useRef, useState } from "react"
import PaystackPop from "@paystack/inline-js"
import { addDoc, collection } from "firebase/firestore"
import { db } from "../../lib/firebase" // adjust path if needed
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"
import { Alert, AlertDescription } from "../ui/alert"
import { Calendar, Users, CreditCard, CheckCircle, X } from "lucide-react"

export function BookingForm({ packageData, onClose }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    travelers: 1,
    travelDate: "",
    specialRequests: "",
  })
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null) // null | "success" | "failed"
  const [bookingId, setBookingId] = useState(null)
  const overlayRef = useRef(null)

  // Try different env var locations depending on bundler
  const PAYSTACK_KEY = import.meta.env.VITE_PAYSTACK_TEST_PUBLIC_kEY

  useEffect(() => {
    // lock background scroll when modal open
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const handleOutsideClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value || "0", 10) : value,
    }))
  }

  const calculateTotal = () => {
    const price = Number(packageData?.price || 0)
    const travelers = Number(formData.travelers || 1)
    return price * travelers
  }

  // Main submit: init Paystack, on success save booking to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setPaymentStatus(null)

    // Basic validation
    if (!PAYSTACK_KEY) {
      console.error("Paystack public key missing. Set REACT_APP_PAYSTACK_KEY / VITE_PAYSTACK_KEY / NEXT_PUBLIC_PAYSTACK_KEY.")
      setPaymentStatus("failed")
      setLoading(false)
      return
    }

    const total = calculateTotal()
    const amountKobo = Math.round(total * 100) // Paystack expects kobo (if price in Naira)

    // Prepare booking payload (pending until payment success)
    const bookingData = {
      packageId: packageData?.id || null,
      packageTitle: packageData?.title || null,
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      customerEmail: formData.email,
      customerPhone: formData.phone,
      travelers: formData.travelers,
      specialRequests: formData.specialRequests,
      amount: total,
      paymentStatus: "Paid",
      status: "Confirmed",
      createdAt: new Date(),
    }

    try {
      
      // initialize paystack transaction
      const paystack = new PaystackPop()
      paystack.newTransaction({
        key: PAYSTACK_KEY,
        email: formData.email,
        amount: amountKobo,
        currency: "NGN",
        // metadata can include additional data visible in dashboard
        metadata: {
          packageId: packageData?.id,
          packageTitle: packageData?.title,
        },
        onSuccess: async (transaction) => {
          // transaction.reference is the payment reference
          try {
            // Save booking AFTER successful payment
            const finalBooking = {
              ...bookingData,
              paymentStatus: "completed",
              paymentReference: transaction.reference,
              status: "confirmed",
              paidAt: new Date(),
              rawTransaction: transaction,
            }

            const docRef = await addDoc(collection(db, "travel-bookings"), finalBooking)
            setBookingId(docRef.id)
            setPaymentStatus("success")
            setLoading(false)
          } catch (saveError) {
            console.error("Failed to save booking after payment:", saveError)
            setPaymentStatus("failed")
            setLoading(false)
          }
        },
        onCancel: () => {
          setPaymentStatus("failed")
          setLoading(false)
        },
      })
    } catch (err) {
      console.error("Payment initialization failed:", err)
      setPaymentStatus("failed")
      setLoading(false)
    }
  }

  // Success view
  if (paymentStatus === "success") {
    return (
      <div
        ref={overlayRef}
        onClick={handleOutsideClick}
        className="fixed inset-0 z-50 bg-black/80 text-white flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md mx-auto">
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Booking Confirmed!</h3>
              <p className="text-slate-600 mb-4">
                Thanks — your payment was successful and your booking is confirmed.
              </p>
              <p className="text-sm text-slate-500 mb-4">Booking ID: {bookingId}</p>
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Failed view (after attempt)
  if (paymentStatus === "failed") {
    return (
      <div
        ref={overlayRef}
        onClick={handleOutsideClick}
        className="fixed inset-0 z-50 bg-black/80 text-white flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md mx-auto">
          <Card>
            <CardContent className="text-center py-8">
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  There was a problem with payment. Please try again or contact support.
                </AlertDescription>
              </Alert>
              <div className="flex gap-3">
                <Button onClick={() => setPaymentStatus(null)} variant="outline" className="flex-1">
                  Try Again
                </Button>
                <Button onClick={onClose} className="flex-1">
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Default: show form inside modal
  return (
    <div
      ref={overlayRef}
      onClick={handleOutsideClick}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-full max-w-2xl max-h-screen overflow-y-auto bg-white rounded-lg shadow-lg">
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-20"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <Card className="shadow-none border-0">
          <CardHeader className="sticky top-0 bg-white z-10">
            <CardTitle>Book Your Trip</CardTitle>
            <CardDescription>Complete your booking for {packageData?.title}</CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                </div>
              </div>

              {/* Trip details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Trip Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="travelers">Number of travelers</Label>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-muted-foreground mr-2" />
                      <Input id="travelers" name="travelers" type="number" min="1" max="20" value={formData.travelers} onChange={handleInputChange} required />
                    </div>
                  </div>

                 
                </div>

                <div>
                  <Label htmlFor="specialRequests">Special requests (optional)</Label>
                  <Textarea id="specialRequests" name="specialRequests" value={formData.specialRequests} onChange={handleInputChange} rows={3} />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span>Package Price (per person)</span>
                  <span>₦{(packageData?.price ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of travelers</span>
                  <span>{formData.travelers}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₦{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button type="submit" className="flex-1 bg-black text-white" disabled={loading}>
                  <CreditCard className="h-4 w-4 mr-2 inline-block" />
                  {loading ? "Processing..." : `Pay ₦${calculateTotal().toLocaleString()}`}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BookingForm
