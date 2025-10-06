import { useState, useEffect } from "react"
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"

export default function AdminBlogs() {
    const [blogs, setBlogs] = useState([])
    const [form, setForm] = useState({ title: "", content: "", image: "", featured: false })
    const [imageFile, setImageFile] = useState(null)
    const [editingId, setEditingId] = useState(null)
    const [uploading, setUploading] = useState(false)

    // Fetch blogs
    useEffect(() => {
        const fetchBlogs = async () => {
            const querySnapshot = await getDocs(collection(db, "blogs"))
            setBlogs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        }
        fetchBlogs()
    }, [])

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm({ ...form, [name]: type === "checkbox" ? checked : value })
    }

    // Upload image to Cloudinary
    const uploadToCloudinary = async (file) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        )
        const data = await res.json()
        return data.secure_url
    }

    // Save blog (add or update)
    const handleSave = async () => {
        try {
            setUploading(true)

            let imageUrl = form.image
            if (imageFile) {
                imageUrl = await uploadToCloudinary(imageFile)
            }

            const blogData = {
                title: form.title,
                content: form.content,
                image: imageUrl,
                featured: form.featured,
                createdAt: new Date().toISOString(),
            }

            if (editingId) {
                await updateDoc(doc(db, "blogs", editingId), blogData)
                setEditingId(null)
            } else {
                await addDoc(collection(db, "blogs"), blogData)
            }

            setForm({ title: "", content: "", image: "", featured: false })
            setImageFile(null)
            window.location.reload()
        } catch (error) {
            console.error("Error saving blog:", error)
        } finally {
            setUploading(false)
        }
    }

    // Edit blog
    const handleEdit = (blog) => {
        setForm({
            title: blog.title,
            content: blog.content,
            image: blog.image,
            featured: blog.featured || false,
        })
        setEditingId(blog.id)
    }

    // Delete blog
    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "blogs", id))
        window.location.reload()
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Blog Management</h1>

            {/* Blog Form */}
            <div className="bg-gray-100 p-4 rounded mb-6">
                <input
                    type="text"
                    name="title"
                    placeholder="Blog Title"
                    value={form.title}
                    onChange={handleChange}
                    className="border p-2 mb-2 w-full"
                />
                <textarea
                    name="content"
                    placeholder="Blog Content"
                    value={form.content}
                    onChange={handleChange}
                    className="border p-2 mb-2 w-full"
                />

                {/* Upload Image */}
                <label className="block mb-2">Upload Blog Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="mb-2"
                />
                {form.image && <img src={form.image} alt="Preview" className="w-32 h-32 object-cover rounded mb-2" />}

                {/* Featured Checkbox */}
                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        name="featured"
                        checked={form.featured}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label>Mark as Featured</label>
                </div>

                <button
                    onClick={handleSave}
                    className="bg-[#ac3500] text-white px-4 py-2 rounded"
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : editingId ? "Update Blog" : "Add Blog"}
                </button>
            </div>

            {/* Blog List */}
            <div>
                <h2 className="text-xl font-semibold mb-3">All Blogs</h2>
                {blogs.map((blog) => (
                    <div key={blog.id} className="border-b py-3 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold">{blog.title}</h3>
                            <p className="text-sm text-gray-600">{blog.featured ? "⭐ Featured" : "Not Featured"}</p>
                        </div>
                        <div className="space-x-2">
                            <button onClick={() => handleEdit(blog)} className="bg-yellow-500 px-3 py-1 text-white rounded">Edit</button>
                            <button onClick={() => handleDelete(blog.id)} className="bg-red-600 px-3 py-1 text-white rounded">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
