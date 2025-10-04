import { ToursGrid } from "../components/tours/tours-grid"
import { Header } from "../components/layout/Header"
import { Footer } from "../components/layout/Footer"

export default function ToursPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-amber-600 to-[#ac3500] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance">Local Tours & Experiences</h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto text-pretty">
              Discover authentic local experiences and guided tours that showcase the best of each destination.
            </p>
          </div>
        </section>

        {/* Filters and Tours */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <main className="lg:w-full">
                <ToursGrid />
              </main>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
