import { Header } from "../components/layout/Header"
import { Footer } from "../components/layout/Footer"
import { TravelPackagesGrid } from "../components/travel/TravelPackagesGrid"

export default function TravelPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#d87b53] to-[#ac3500] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance">Travel Packages</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto text-pretty">
              Discover amazing destinations with our carefully curated travel packages designed for unforgettable
              experiences.
            </p>
          </div>
        </section>

        {/* Filters and Packages */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <main className="lg:w-full">
                <TravelPackagesGrid />
              </main>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
