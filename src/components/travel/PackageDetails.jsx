
import { useEffect, useState } from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, Users, Star, Check, X, ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { BookingForm } from "./BookingForm"

export function PackageDetails({ packageId }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [travels, setTravelsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!packageId) return

    const fetchTour = async () => {
      try {
        const docRef = doc(db, "packages", packageId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setTravelsData({ id: docSnap.id, ...docSnap.data() })
        } else {
          setError("No tour found with this ID")
        }
      } catch (err) {
        console.error("Error fetching tour:", err)
        setError("Failed to fetch tour")
      } finally {
        setLoading(false)
      }
    }

    fetchTour()
  }, [packageId])



  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % travels.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + travels.images.length) % travels.images.length)
  }


  // 🛑 Guard: Loading / Error
  if (loading) {
    return <p className="text-center py-10">Loading tour...</p>
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>
  }

  if (!travels) {
    return <p className="text-center py-10">No data available</p>
  }


  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)




  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-slate-600">
            <li>
              <a href="/" className="hover:text-[#a30500] text-[#a30500]">
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/travel" className="hover:text-[#a30500] text-[#a30500]">
                Travel Packages
              </a>
            </li>
            <li>/</li>
            <li className="text-slate-900">{travels.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-8">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <img
                  src={travels.images[currentImageIndex] || "/placeholder.svg"}
                  alt={travels.title}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {travels.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? "bg-white" : "bg-white/50"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Package Info */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center text-slate-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {travels.destination}
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{travels.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {travels.duration} days
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Max {travels.maxCapacity} people
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-amber-500 fill-current" />
                      {travels.rating} ({travels.reviews} reviews)
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setIsWishlisted(!isWishlisted)}>
                    <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? "fill-current text-red-500" : ""}`} />
                    {isWishlisted ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <p className="text-slate-700 text-lg leading-relaxed">{travels.description}</p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="itinerary" className="mb-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="included">What's Included</TabsTrigger>
                <TabsTrigger value="highlights">Highlights</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="itinerary" className="mt-6">
                <div className="space-y-6">
                  {travels?.itinerary
                    ?.split("\n")
                    .map((line, index) => {
                      const [day, title] = line.split(" - ");
                      return (
                        <Card key={index}>
                          <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-slate-900 mb-3">
                              {day.trim()}: {title?.trim()}
                            </h3>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </TabsContent>

              <TabsContent value="included" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                        <Check className="w-5 h-5 mr-2" />
                        What's Included
                      </h3>
                      <ul className="space-y-2">
                        {travels.includes.map((item, index) => (
                          <li key={index} className="flex items-center text-slate-700">
                            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
                        <X className="w-5 h-5 mr-2" />
                        What's Not Included
                      </h3>
                      <ul className="space-y-2">
                        {travels?.excludes?.map((item, index) => (
                          <li key={index} className="flex items-center text-slate-700">
                            <X className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="highlights" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Package Highlights</h3>
                    <ul className="space-y-3">
                      {/* {travels.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start text-slate-700">
                          <Star className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                          {highlight}
                        </li>
                      ))} */}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Customer Reviews</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-500 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-slate-600">{travels.rating} out of 5</span>
                    </div>
                  </div>

                  {/* Sample reviews */}
                  <div className="space-y-4">
                    {[1, 2, 3].map((review) => (
                      <Card key={review}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-slate-900">Sarah Johnson</h4>
                              <p className="text-sm text-slate-500">Traveled in April 2024</p>
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-amber-500 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-700">
                            Amazing experience! The itinerary was perfectly planned and our guide was incredibly
                            knowledgeable. The sunsets in Oia were absolutely breathtaking. Highly recommend this
                            package!
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-[#a30500] text-white">${travels.price}</span>
                    </div>
                    <p className="text-slate-600">per person</p>
                    {travels.originalPrice > travels.price && (
                      <Badge variant="destructive" className="mt-2">
                        Save ${travels.originalPrice - travels.price}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Duration:</span>
                      <span className="font-semibold">{travels.duration} days</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Group Size:</span>
                      <span className="font-semibold">Max {travels?.maxCapacity}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Min Age:</span>
                      <span className="font-semibold">18+ years</span>
                    </div>

                  </div>

                  <Button onClick={handleOpen} className="w-full bg-[#a30500] text-white hover:bg-[#bd130d] mb-4" size="lg">
                    Book Now
                  </Button>

                  <Button variant="outline" className="w-full bg-transparent">
                    Contact Us
                  </Button>
                </CardContent>
              </Card>

              {/* Available Dates */}

            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <BookingForm
          packageData={travels}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
