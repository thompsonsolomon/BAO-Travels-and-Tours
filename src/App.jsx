import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import TravelPage from "./pages/TravelPage"
import TravelDetailsPage from "./pages/TravelDetailsPage"
import ToursPage from "./pages/ToursPage"
import TourDetailsPage from "./pages/TourDetailsPage"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminPackages from "./pages/admin/AdminPackages"
import AdminTours from "./pages/admin/AdminTours"
import AdminBookings from "./pages/admin/AdminBookings"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import BlogPage from "./pages/BlogPage"
import BlogDetailsPage from "./pages/BlogDetailsPage"
import AdminBlogPage from "./pages/admin/AdminBlogPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/travel" element={<TravelPage />} />
      <Route path="/travel/:id" element={<TravelDetailsPage />} />
      <Route path="/tours" element={<ToursPage />} />
      <Route path="/tours/:id" element={<TourDetailsPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/blogs" element={<BlogPage />} />
      <Route path="/blogs/:id" element={<BlogDetailsPage />} />
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/packages" element={<AdminPackages />} />
      <Route path="/admin/tours" element={<AdminTours />} />
      <Route path="/admin/bookings" element={<AdminBookings />} />
      <Route path="/admin/blogs" element={<AdminBlogPage />} />

    </Routes>
  )
}

export default App
