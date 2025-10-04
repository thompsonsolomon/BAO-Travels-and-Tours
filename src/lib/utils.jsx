import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { collection, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "./firebase"

// ✅ Utility to merge Tailwind classes
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}



export default function useFeaturedData() {
  const [featuredTravels, setFeaturedTravels] = useState([])
  const [featuredTours, setFeaturedTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFeaturedData = async () => {
      try {
        // Fetch Featured Travels
        const travelsQuery = query(
          collection(db, "packages"),
          where("featured", "==", true)
        )
        const travelsSnapshot = await getDocs(travelsQuery)
        const travelsData = travelsSnapshot.docs.map((doc) => ({
          id: doc.id,
           dataType: "travel",
          ...doc.data(),
        }))
       
        setFeaturedTravels(travelsData)

        // Fetch Featured Tours
        const toursQuery = query(
          collection(db, "tours"),
          where("featured", "==", true)
        )
        const toursSnapshot = await getDocs(toursQuery)
        const toursData = toursSnapshot.docs.map((doc) => ({
          id: doc.id,
            dataType: "tours",
          ...doc.data(),
        }))
        setFeaturedTours(toursData)
      } catch (err) {
        console.error("Error fetching featured data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedData()
  }, [])

  return { featuredTravels, featuredTours, loading, error }
}



