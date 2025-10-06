import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { collection, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "./firebase"
import { format } from "timeago.js";

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





export function timeAgo(date) {
  if (!date) return "Unknown time";

  let realDate;

  // Firestore Timestamp
  if (date?.seconds) {
    realDate = new Date(date.seconds * 1000);
  }
  // ISO string (e.g. "2025-10-06T12:34:56Z")
  else if (typeof date === "string") {
    realDate = new Date(date);
  }
  // Normal JS Date
  else if (date instanceof Date) {
    realDate = date;
  }
  // Fallback
  else {
    realDate = new Date(date);
  }

  return format(realDate);
}
