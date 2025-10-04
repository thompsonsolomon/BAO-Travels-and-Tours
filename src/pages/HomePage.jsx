import { Header } from "../components/layout/Header"
import { Footer } from "../components/layout/Footer"
import { HeroSection } from "../components/home/HeroSection"
import { FeaturedDestinations } from "../components/home/FeaturedDestinations"
import { TestimonialsSection } from "../components/home/TestimonialsSection"
import { WhyChooseUs } from "../components/home/WhyChooseUs"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturedDestinations />
        <WhyChooseUs />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}
