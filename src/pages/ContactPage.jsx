import { Mail, Phone, MapPin } from "lucide-react"
import { Footer } from "../components/layout/Footer"
import { Header } from "../components/layout/Header"

export default function ContactPage() {
  return (



    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-600 to-[#ac3500] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance">
              Get in Touch
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto text-pretty">
              Have questions about a tour or need help planning your next adventure?
              We’d love to hear from you.            </p>
          </div>
        </section>

        {/* Filters and Tours */}
        <section className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-6 md:px-12">


          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Phone className="w-6 h-6 text-amber-600" />
                <p className="text-slate-700">+234 800 123 4567</p>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-amber-600" />
                <p className="text-slate-700">support@baotravel.com</p>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="w-6 h-6 text-amber-600" />
                <p className="text-slate-700">Lagos, Nigeria</p>
              </div>
            </div>

            {/* Contact Form */}
            <form className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Message</label>
                <textarea
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  rows="4"
                  placeholder="How can we help you?"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>

  )
}
