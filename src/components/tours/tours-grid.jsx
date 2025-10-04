import { useEffect, useState } from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { MapPin, Clock, Users, Star, Heart, Award } from "lucide-react"
import { Link } from "react-router-dom"
import { collection, getDocs } from "@firebase/firestore"
import { db } from "../../lib/firebase"

export function ToursGrid() {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("featured")

  useEffect(() => {
    fetchTours()
  }, [])

  const fetchTours = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tours"))
      const toursData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setTours(toursData)
    } catch (error) {
      console.error("Error fetching tours:", error)
    } finally {
      setLoading(false)
    }
  }

  const sortedTours = [...tours].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "duration":
        return a.duration - b.duration
      default:
        return b.featured ? 1 : -1
    }
  })
 if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-9 w-9 border-b-4 border-primary"> </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Header with sorting and view options */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{tours.length} Tours & Experiences</h2>
          <p className="text-slate-600">Discover authentic local experiences</p>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="featured">Featured First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="duration">Duration</option>
          </select>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTours.map((tour) => (
          <Card key={tour.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative overflow-hidden">
              <img
                src={tour.images[0] || "/placeholder.svg"}
                alt={tour.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {tour.featured && <Badge className="bg-[#ac3500] text-white">Featured</Badge>}
                {tour.instantConfirmation && <Badge className="bg-green-600 text-white">Instant Booking</Badge>}
              </div>

              {/* Rating */}
              <div className="absolute top-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="text-sm font-semibold">{tour.rating}</span>
                </div>
              </div>

              {/* Wishlist Button */}
              <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                <Heart className="w-5 h-5 text-slate-600 hover:text-red-500" />
              </button>
            </div>

            <CardContent className="p-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center text-slate-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {tour.location}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {tour.category}
                </Badge>
              </div>

              <h3 className="text-l font-bold text-slate-900 mb-2">{tour.title}</h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{tour.description}</p>

              {/* Tour Details */}
              <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {tour.duration} {tour.durationType}
                </div>

                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  {tour.reviews} reviews
                </div>
              </div>

              {/* Highlights */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {tour.highlights.slice(0, 3).map((highlight, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                  {tour.highlights.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{tour.highlights.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="flex items-center gap-4 text-xs text-green-600 mb-4">
                {tour.instantConfirmation && <span>✓ Instant confirmation</span>}
                {tour.freeCancellation && <span>✓ Free cancellation</span>}
              </div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#ac3500]">${tour.price}</span>

                  </div>
                  <span className="text-slate-500 text-sm">per person</span>
                </div>
                <Link to={`/tours/${tour.id}`}>
                  <Button className="bg-[#ac3500] text-white cursor-pointer hover:bg-amber-700">Book Now</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
