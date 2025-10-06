import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { doc, getDoc, getDocs, collection } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { Button } from "../ui/button"
import { Clock, Share2, Star, Users } from "lucide-react"
import { timeAgo } from "../../lib/utils"

export default function BlogDetail() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      const blogRef = doc(db, "blogs", id)
      const blogSnap = await getDoc(blogRef)
      if (blogSnap.exists()) {
        const blogData = { id: blogSnap.id, ...blogSnap.data() }
        setBlog(blogData)

        // Fetch related blogs if available
        if (blogData.related?.length) {
          const allBlogsSnapshot = await getDocs(collection(db, "blogs"))
          const allBlogs = allBlogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          const filteredRelated = allBlogs.filter(b => blogData.related.includes(b.id))
          setRelatedBlogs(filteredRelated)
        }
      }
      setLoading(false)
    }
    fetchBlog()
  }, [id])

  if (loading) return <p className="text-center py-8">Loading blog...</p>
  if (!blog) return <p className="text-center py-8 text-red-500">Blog not found</p>
  console.log(blog)
  return (

    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-slate-600">
            <li>
              <a href="/" className="hover:text-amber-600">
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/blogs" className="hover:text-amber-600">
                Blogs
              </a>
            </li>
            <li>/</li>
            <li className="text-[#ac3500]">{blog?.title}</li>
          </ol>
        </nav>
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Blog Image */}
          <img
            src={blog.image || "/placeholder.svg"}
            alt={blog.title}
            className="w-full rounded-lg mb-6 object-cover max-h-[400px] sm:max-h-[500px]"
          />

          {/* Blog Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 text-center sm:text-left">
            {blog?.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-slate-600 gap-4 mb-6">
            {/* Left Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {/* Date */}
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {blog?.createdAt
                  ? new Date(
                    blog.createdAt.seconds
                      ? blog.createdAt.seconds * 1000
                      : blog.createdAt
                  ).toLocaleString("en-GB", { timeZone: "Africa/Lagos" })
                  : "Unknown date"}
              </div>

              {/* Users */}
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>20 people</span>
              </div>

              {/* Reviews */}
              <div className="flex items-center">
                <span>5</span>
                <Star className="w-4 h-4 ml-1 text-amber-500 fill-current" />
                <span className="ml-1">reviews</span>
              </div>
            </div>

            {/* Right Info */}
            <div className="text-sm italic text-slate-500">
              {timeAgo(blog?.createdAt)}
            </div>
          </div>

          {/* Blog Content */}
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6">
            {blog.content}
          </p>
        </section>


      </div>
    </div>
  )
}
