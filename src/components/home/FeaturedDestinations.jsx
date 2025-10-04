import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { MapPin, Clock, Users, Star } from "lucide-react"
import { useState } from "react"
import useFeaturedData from "../../lib/utils"

export function FeaturedDestinations() {
  const { featuredTravels, featuredTours, loading, error } = useFeaturedData()
  const combinedData = [
    ...(featuredTravels || []),
    ...(featuredTours || [])
  ]

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  function truncateText(text, maxLength = 20) {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }


  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-4 text-balance">
            Featured Destinations
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto text-pretty">
            Discover our most popular travel packages, carefully curated to give you the best experiences around the
            world.
          </p>
        </div>

        {/* Featured Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {combinedData?.map((pkg, index) => (
            <Card key={pkg.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={pkg.images[0] || "/placeholder.svg"}
                  alt={pkg.title}
                  className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#ac3500] text-white px-3 py-1 rounded-full text-sm font-semibold">Featured</span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-sm font-semibold">{pkg.rating}</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-slate-500 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {truncateText(pkg.destination ? pkg.destination : pkg.location, 25)}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{pkg.title}</h3>
                <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {pkg.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {pkg.reviews} reviews
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-[#ac3500]">${pkg.price}</span>
                    <span className="text-slate-500 text-sm ml-1">per person</span>
                  </div>
                  <Link to={`/${pkg.dataType}/${pkg.id}`}>
                    <Button className="bg-[#ac3500] text-white hover:bg-[#e75111] cursor-pointer">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/travel">
            <Button
              size="lg"
              variant="outline"
              className="border-[#ac3500]  text-[#ac3500] hover:bg-[#e75111] cursor-pointer hover:text-white bg-transparent"
            >
              View All Packages
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
