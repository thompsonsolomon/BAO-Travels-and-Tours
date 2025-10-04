import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { MapPin, Clock, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../lib/firebase"

export function RelatedTours({ currentTourId }) {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tours"))
        const allTours = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setTours(allTours)
      } catch (err) {
        console.error("Error fetching tours:", err)
        setError("Failed to fetch tours")
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [])

  // filter out the current tour
  const filteredTours = tours.filter((tour) => tour.id !== currentTourId)

  if (loading) return <p className="text-center py-8">Loading related tours...</p>
  if (error) return <p className="text-center text-red-500 py-8">Error: {error}</p>
  if (!filteredTours.length) return null

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">More Amazing Experiences</h2>
          <p className="text-slate-600">Discover other tours you might enjoy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => (
            <Card
              key={tour.id}
              className="group overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative overflow-hidden">
                <img
                  src={tour.images[0] || "/placeholder.svg"}
                  alt={tour.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-sm font-semibold">{tour.rating}</span>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-[#ac3500] text-white">
                    {tour.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center text-slate-500 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {tour.location}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{tour.title}</h3>
                <div className="flex items-center text-sm text-slate-600 mb-4">
                  <Clock className="w-4 h-4 mr-1" />
                  {tour.duration} {tour.durationType}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-amber-600">${tour.price}</span>
                    <span className="text-slate-500 text-sm ml-1">per person</span>
                  </div>
                  <Link to={`/tours/${tour.id}`}>
                    <Button className="bg-amber-600 text-white hover:bg-amber-700">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
