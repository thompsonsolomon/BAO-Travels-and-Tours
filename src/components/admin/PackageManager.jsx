import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, X } from "lucide-react"
import { Package } from "lucide-react" // Declaring the Package variable

export function PackageManager({
  packages,
  loading,
  showAddForm,
  onAddPackage,
  onUpdatePackage,
  onDeletePackage,
  onCloseAddForm,
}) {
  const [editingPackage, setEditingPackage] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    destination: "",
    images: [],
    itinerary: "",
    includes: "",
    excludes: "",
    featured: false,
  })
  const [uploading, setUploading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    setUploading(true)

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        )
        const data = await response.json()
        return data.secure_url
      })

      const imageUrls = await Promise.all(uploadPromises)
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }))
    } catch (error) {
      console.error("Error uploading images:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const packageData = {
      ...formData,
      price: Number.parseFloat(formData.price),
      includes: formData.includes.split("\n").filter((item) => item.trim()),
      excludes: formData.excludes.split("\n").filter((item) => item.trim()),
    }

    if (editingPackage) {
      await onUpdatePackage(editingPackage.id, packageData)
      setEditingPackage(null)
    } else {
      await onAddPackage(packageData)
    }

    setFormData({
      title: "",
      description: "",
      price: "",
      duration: "",
      destination: "",
      images: [],
      itinerary: "",
      includes: "",
      excludes: "",
      featured: false,
    })
  }

  const startEdit = (pkg) => {
    setEditingPackage(pkg)
    setFormData({
      title: pkg.title || "",
      description: pkg.description || "",
      price: pkg.price?.toString() || "",
      duration: pkg.duration || "",
      destination: pkg.destination || "",
      images: pkg.images || [],
      itinerary: pkg.itinerary || "",
      includes: Array.isArray(pkg.includes) ? pkg.includes.join("\n") : "",
      excludes: Array.isArray(pkg.excludes) ? pkg.excludes.join("\n") : "",
      featured: pkg.featured || false,
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {(showAddForm || editingPackage) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{editingPackage ? "Edit Travels" : "Add New Travels"}</CardTitle>
                <CardDescription>
                  {editingPackage ? "Update travel information" : "Create a new travel package"}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onCloseAddForm()
                  setEditingPackage(null)
                  setFormData({
                    title: "",
                    description: "",
                    price: "",
                    duration: "",
                    destination: "",
                    images: [],
                    itinerary: "",
                    includes: "",
                    excludes: "",
                    featured: false,
                  })
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Travel Title</Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (NGN)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 7 days, 6 nights"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Images</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-muted-foreground">Uploading images...</p>}
                {formData.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.images.map((url, index) => (
                      <img
                        key={index}
                        src={url || "/placeholder.svg"}
                        alt={`Package image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="itinerary">Itinerary</Label>
                <Textarea
                  id="itinerary"
                  name="itinerary"
                  value={formData.itinerary}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Day-by-day itinerary..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="includes">Includes (one per line)</Label>
                  <Textarea
                    id="includes"
                    name="includes"
                    value={formData.includes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Accommodation&#10;Meals&#10;Transportation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excludes">Excludes (one per line)</Label>
                  <Textarea
                    id="excludes"
                    name="excludes"
                    value={formData.excludes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Personal expenses&#10;Travel insurance&#10;Visa fees"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <Label htmlFor="featured">Featured Package</Label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={uploading}>
                  {editingPackage ? "Update Travels" : "Add Travels"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onCloseAddForm()
                    setEditingPackage(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Packages List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{pkg.title}</CardTitle>
                  <CardDescription>{pkg.destination}</CardDescription>
                </div>
                {pkg.featured && <Badge variant="secondary">Featured</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">{pkg.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">{formatCurrency(pkg.price)}</span>
                  <span className="text-sm text-muted-foreground">{pkg.duration}</span>
                </div>
                {pkg.images && pkg.images.length > 0 && (
                  <img
                    src={pkg.images[0] || "/placeholder.svg"}
                    alt={pkg.title}
                    className="w-full h-32 object-cover rounded mt-2"
                  />
                )}
              </div>
              <div className="flex space-x-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => startEdit(pkg)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDeletePackage(pkg.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {packages.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Travel yet</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first travel package</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
