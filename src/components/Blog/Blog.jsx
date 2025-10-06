import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../lib/firebase"

export default function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      const querySnapshot = await getDocs(collection(db, "blogs"))
      const blogsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setBlogs(blogsData)
      setLoading(false)
    }
    fetchBlogs()
  }, [])

  if (loading) return <p className="text-center py-8">Loading blogs...</p>

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">Latest Blogs</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
            <div className="relative overflow-hidden">

              <img
                src={blog.image || "/placeholder.svg"}
                alt={blog.title}
                className="w-full h-48 object-cover rounded"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-[#ac3500] text-white px-3 py-1 rounded-full text-sm font-semibold">Featured</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold mt-4">{blog.title}</h2>
            <p className="text-gray-600 text-sm mt-2 line-clamp-3">{blog.content}</p>
            <Link
              to={`/blogs/${blog.id}`}
              className="mt-4 inline-block text-[#ac3500] hover:underline"
            >
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
