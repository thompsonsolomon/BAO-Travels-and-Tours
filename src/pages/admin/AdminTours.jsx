"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { AdminSidebar } from "../../components/admin/AdminSidebar"
import { TourManager } from "../../components/admin/TourManager"
import { Button } from "../../components/ui/button"
import { Plus } from "lucide-react"

export default function AdminTours() {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

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

  const handleAddTour = async (tourData) => {
    try {
      await addDoc(collection(db, "tours"), {
        ...tourData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      fetchTours()
      setShowAddForm(false)
    } catch (error) {
      console.error("Error adding tour:", error)
    }
  }

  const handleUpdateTour = async (id, tourData) => {
    try {
      await updateDoc(doc(db, "tours", id), {
        ...tourData,
        updatedAt: new Date(),
      })
      fetchTours()
    } catch (error) {
      console.error("Error updating tour:", error)
    }
  }

  const handleDeleteTour = async (id) => {
    try {
      await deleteDoc(doc(db, "tours", id))
      fetchTours()
    } catch (error) {
      console.error("Error deleting tour:", error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold text-[#ac3500]">Manage Tours</h1>
            <Button className="bg-[#ac3500]" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tour
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <TourManager
            tours={tours}
            loading={loading}
            showAddForm={showAddForm}
            onAddTour={handleAddTour}
            onUpdateTour={handleUpdateTour}
            onDeleteTour={handleDeleteTour}
            onCloseAddForm={() => setShowAddForm(false)}
          />
        </main>
      </div>
    </div>
  )
}
