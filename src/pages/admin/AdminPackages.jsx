"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { AdminSidebar } from "../../components/admin/AdminSidebar"
import { PackageManager } from "../../components/admin/PackageManager"
import { Button } from "../../components/ui/button"
import { Plus } from "lucide-react"

export default function AdminPackages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "packages"))
      const packagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setPackages(packagesData)
    } catch (error) {
      console.error("Error fetching packages:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPackage = async (packageData) => {
    try {
      await addDoc(collection(db, "packages"), {
        ...packageData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      fetchPackages()
      setShowAddForm(false)
    } catch (error) {
      console.error("Error adding package:", error)
    }
  }

  const handleUpdatePackage = async (id, packageData) => {
    try {
      await updateDoc(doc(db, "packages", id), {
        ...packageData,
        updatedAt: new Date(),
      })
      fetchPackages()
    } catch (error) {
      console.error("Error updating package:", error)
    }
  }

  const handleDeletePackage = async (id) => {
    try {
      await deleteDoc(doc(db, "packages", id))
      fetchPackages()
    } catch (error) {
      console.error("Error deleting package:", error)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-bold text-[#ac3500]">Manage Travels</h1>
            <Button className="bg-[#ac3500]" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Travel
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <PackageManager
            packages={packages}
            loading={loading}
            showAddForm={showAddForm}
            onAddPackage={handleAddPackage}
            onUpdatePackage={handleUpdatePackage}
            onDeletePackage={handleDeletePackage}
            onCloseAddForm={() => setShowAddForm(false)}
          />
        </main>
      </div>
    </div>
  )
}
