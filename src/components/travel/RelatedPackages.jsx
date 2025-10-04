import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { MapPin, Clock, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../lib/firebase"

export function RelatedPackages({ currentPackageId }) {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "packages"))
        const allPackages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setPackages(allPackages)
      } catch (err) {
        console.error("Error fetching packages:", err)
        setError("Failed to fetch packages")
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  // filter out the current package
  const filteredPackages = packages.filter((pkg) => pkg.id !== currentPackageId)

  if (loading) return <p className="text-center py-8">Loading related packages...</p>
  if (error) return <p className="text-center text-red-500 py-8">Error: {error}</p>
  if (!filteredPackages.length) return null

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">You Might Also Like</h2>
          <p className="text-slate-600">Discover more amazing destinations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={pkg.image || "/placeholder.svg"}
                  alt={pkg.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
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
                  {pkg.destination}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{pkg.title}</h3>
                <div className="flex items-center text-sm text-slate-600 mb-4">
                  <Clock className="w-4 h-4 mr-1" />
                  {pkg.duration} days
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">${pkg.price}</span>
                    <span className="text-slate-500 text-sm ml-1">per person</span>
                  </div>
                  <Link to={`/${pkg.type === "tour" ? "tour" : "travel"}/${pkg.id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700">View Details</Button>
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
