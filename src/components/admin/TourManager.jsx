"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, X, MapPin } from "lucide-react"

export function TourManager({ tours, loading, showAddForm, onAddTour, onUpdateTour, onDeleteTour, onCloseAddForm }) {
  const [editingTour, setEditingTour] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    location: "",
    category: "",
    images: [],
    schedule: "",
    highlights: "",
    includes: "",
    maxParticipants: "",
    featured: false,
  })
  const [uploading, setUploading] = useState(false)

  const categories = ["Adventure", "Cultural", "Nature", "Food & Drink", "Historical", "Photography"]

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
    const tourData = {
      ...formData,
      price: Number.parseFloat(formData.price),
      maxParticipants: Number.parseInt(formData.maxParticipants),
      highlights: formData.highlights.split("\n").filter((item) => item.trim()),
      includes: formData.includes.split("\n").filter((item) => item.trim()),
    }

    if (editingTour) {
      await onUpdateTour(editingTour.id, tourData)
      setEditingTour(null)
    } else {
      await onAddTour(tourData)
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      location: "",
      category: "",
      duration: "",
      price: "",
      rating: 4.9,
      images: [],
      description: "",
      highlights: [],
      includes: "",
      excluded: [],
      meetingPoint: "",
      maxParticipants: "",
      schedule: "",
      featured: false,
    })
  }

  const startEdit = (tour) => {
    setEditingTour(tour)
    setFormData({
      title: tour.title || "",
      description: tour.description || "",
      price: tour.price?.toString() || "",
      duration: tour.duration || "",
      location: tour.location || "",
      category: tour.category || "",
      meetingPoint: tour.meetingPoint || "",
      rating: tour.rating || "",
      images: tour.images || [],
      schedule: tour.schedule || "",
      highlights: Array.isArray(tour.highlights) ? tour.highlights.join("\n") : "",
      includes: Array.isArray(tour.includes) ? tour.includes.join("\n") : "",
      excluded: Array.isArray(tour.excluded) ? tour.excluded.join("\n") : "",
      maxParticipants: tour.maxParticipants?.toString() || "",
      featured: tour.featured || false,
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
      {(showAddForm || editingTour) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{editingTour ? "Edit Tour" : "Add New Tour"}</CardTitle>
                <CardDescription>
                  {editingTour ? "Update tour information" : "Create a new tour experience"}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onCloseAddForm()
                  setEditingTour(null)
                  resetForm()
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
                  <Label htmlFor="title">Tour Title</Label>
                  <Input id="title" name="title" placeholder="Event Title" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Paris, New York"
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
                    placeholder="e.g., 5000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 3 hours, Half day"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    name="maxParticipants"
                    type="number"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 10, 20"
                  />
                </div>



                <div className="space-y-2">
                  <Label htmlFor="meetingPoint">meetingPoint</Label>
                  <Input
                    id="meetingPoint"
                    name="meetingPoint"
                    type="text"
                    value={formData.meetingPoint}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Hotel lobby, Main square"
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
                  placeholder="Brief description of the tour..."
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
                        alt={`Tour image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">Schedule</Label>
                <Textarea
                  id="schedule"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tour schedule and timeline..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="highlights">Highlights (one per line)</Label>
                  <Textarea
                    id="highlights"
                    name="highlights"
                    value={formData.highlights}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Visit famous landmarks&#10;Professional guide&#10;Photo opportunities"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="includes">Includes (one per line)</Label>
                  <Textarea
                    id="includes"
                    name="includes"
                    value={formData.includes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Professional guide&#10;Transportation&#10;Refreshments"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excluded">Excluded (one per line)</Label>
                  <Textarea
                    id="excluded"
                    name="excluded"
                    value={formData.excluded}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Lunch or dinner&#10;Personal expenses&#10;Tips and gratuities&#10:"
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
                <Label htmlFor="featured">Featured Tour</Label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={uploading}>
                  {editingTour ? "Update Tour" : "Add Tour"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onCloseAddForm()
                    setEditingTour(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tours List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <Card key={tour.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{tour.title}</CardTitle>
                  <CardDescription className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{tour.location}</span>
                  </CardDescription>
                </div>
                <div className="flex flex-col space-y-1">
                  {tour.featured && <Badge variant="secondary">Featured</Badge>}
                  <Badge variant="outline">{tour.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">{tour.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">{formatCurrency(tour.price)}</span>
                  <span className="text-sm text-muted-foreground">{tour.duration}</span>
                </div>
                <div className="text-sm text-muted-foreground">Max {tour.maxParticipants} participants</div>
                {tour.images && tour.images.length > 0 && (
                  <img
                    src={tour.images[0] || "/placeholder.svg"}
                    alt={tour.title}
                    className="w-full h-32 object-cover rounded mt-2"
                  />
                )}
              </div>
              <div className="flex space-x-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => startEdit(tour)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDeleteTour(tour.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tours.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No tours yet</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first tour experience</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
