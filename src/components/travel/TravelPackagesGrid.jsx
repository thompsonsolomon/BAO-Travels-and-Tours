import { useState, useEffect } from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { MapPin, Clock, Users, Star, Heart } from "lucide-react"
import { Link } from "react-router-dom"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../lib/firebase"

export function TravelPackagesGrid() {
  const [sortBy, setSortBy] = useState("featured")
  const [loading, setLoading] = useState(true)
  const [travels, setTravels] = useState([])

  useEffect(() => {
    fetchTravels()
  }, [])

  const fetchTravels = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "packages"))
      const toursData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setTravels(toursData)
    } catch (error) {
      console.error("Error fetching tours:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-9 w-9 border-b-4 border-primary"></div>
      </div>
    )
  }

  const sortedPackages = [...travels].sort((a, b) => {
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
        // show featured tours first
        return b.featured === a.featured ? 0 : b.featured ? 1 : -1
    }
  })

  return (
    <div className="space-y-6">
      {/* Header with sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{travels.length} Travel Packages</h2>
          <p className="text-slate-600">Find your perfect getaway</p>
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

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPackages.map((pkg) => (
          <Card
            key={pkg.id}
            className="group overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="relative overflow-hidden">
              <img
                src={pkg.images[0] || "/placeholder.svg"}
                alt={pkg.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {pkg.featured && (
                  <Badge className="bg-amber-500 text-white">Featured</Badge>
                )}
              </div>

              {/* Rating */}
              <div className="absolute top-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="text-sm font-semibold">{pkg.rating}</span>
                </div>
              </div>

              {/* Wishlist Button */}
              <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                <Heart className="w-5 h-5 text-slate-600 hover:text-red-500" />
              </button>
            </div>

            <CardContent className="p-6">
              <div className="flex items-center text-slate-500 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                {pkg.destination}
              </div>

              <h3 className="text-l font-bold text-slate-900 mb-2">{pkg.title}</h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                {pkg.description}
              </p>

              {/* Package Details */}
              <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {pkg.duration} days
                </div>
               
              </div>

              {/* Included Items */}
              {pkg.included && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {pkg.included.slice(0, 3).map((item, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                    {pkg.included.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{pkg.included.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Price and CTA */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#ac3500]">
                      ${pkg.price}
                    </span>
                  </div>
                  <span className="text-slate-500 text-sm">per person</span>
                </div>
                <Link to={`/travel/${pkg.id}`}>
                  <Button className="bg-[#ac3500] text-white cursor-pointer hover:bg-[#e75111]">
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
