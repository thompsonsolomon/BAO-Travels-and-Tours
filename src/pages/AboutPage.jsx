import { Globe, Users, MapPin } from "lucide-react"
import { Footer } from "../components/layout/Footer"
import { Header } from "../components/layout/Header"

export default function AboutPage() {
  return (


    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-600 to-[#ac3500] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance">  About BAO Travel & Tours </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto text-pretty">
             Discover more about BAO Travel & Tour—your gateway to authentic experiences and guided tours .
            </p>
          </div>
        </section>

        {/* Filters and Tours */}
        <section className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-16 px-6 md:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-600 mb-6">
            
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
              At BAO Travel & Tours, we believe every journey is more than just a trip—
              it’s an unforgettable story waiting to be told. With carefully curated
              tours, expert guides, and personalized experiences, we help you explore
              the world with ease, comfort, and joy.
            </p>
          </div>

          {/* Highlights */}
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
              <Globe className="w-10 h-10 text-amber-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Global Reach</h3>
              <p className="text-slate-600">
                From breathtaking landscapes to cultural wonders, we connect you with
                destinations worldwide.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
              <Users className="w-10 h-10 text-amber-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Trusted by Travelers</h3>
              <p className="text-slate-600">
                Thousands of happy travelers trust us for safe, enjoyable, and
                memorable adventures.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">
              <MapPin className="w-10 h-10 text-amber-600 mb-4" />
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Local Expertise</h3>
              <p className="text-slate-600">
                Our guides and agents provide insider knowledge to make every journey
                authentic and stress-free.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>

  )
}
