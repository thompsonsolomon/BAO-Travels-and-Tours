import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { ArrowRight, Play } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/stunning-tropical-beach-paradise-with-crystal-clea.jpg"
          alt="Beautiful tropical destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-800/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 text-balance">
            Discover Your Next
              <span className="block text-[#ac3500]">Adventure</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto text-pretty">
            Explore breathtaking destinations and create unforgettable memories with our curated travel packages and
            immersive tours.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/travel">
              <Button size="lg" className="bg-[#ac3500] hover:bg-amber-600 text-white px-8 py-4 text-lg font-semibold">
                Book a Trip
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/tours">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#ac3500] px-8 py-4 text-lg font-semibold bg-transparent"
              >
                <Play className="mr-2 w-5 h-5" />
                Book a Tour
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#ac3500] mb-2">500+</div>
              <div className="text-blue-100 text-sm md:text-base">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#ac3500] mb-2">50+</div>
              <div className="text-blue-100 text-sm md:text-base">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#ac3500] mb-2">100+</div>
              <div className="text-blue-100 text-sm md:text-base">Tours Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#ac3500] mb-2">5★</div>
              <div className="text-blue-100 text-sm md:text-base">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
