import { Card, CardContent } from "../ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    text: "BAO Travel made our honeymoon in Santorini absolutely magical. Every detail was perfectly planned, and the customer service was exceptional. We can't wait to book our next adventure with them!",
    image: "/professional-headshot-of-happy-woman-with-blonde-h.jpg",
    trip: "Santorini Paradise Package",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Toronto, Canada",
    rating: 5,
    text: "The Bali adventure exceeded all our expectations. The local guides were knowledgeable, the accommodations were luxurious, and the itinerary was perfectly balanced between adventure and relaxation.",
    image: "/professional-headshot-of-smiling-asian-man-with-gl.jpg",
    trip: "Bali Adventure Package",
  },
  {
    id: 3,
    name: "Emma Williams",
    location: "London, UK",
    rating: 5,
    text: "As a solo traveler, I was initially nervous, but BAO Travel's support team made me feel safe and confident throughout my Swiss Alps journey. The experience was life-changing!",
    image: "/professional-headshot-of-confident-woman-with-red-.jpg",
    trip: "Swiss Alps Experience",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-4 text-balance">
            What Our Travelers Say
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto text-pretty">
            Don't just take our word for it. Here's what our satisfied customers have to say about their experiences.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-[#ac3500] opacity-50" />
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-slate-700 mb-6 text-pretty">{testimonial.text}</p>

                {/* Trip Info */}
                <div className="text-sm text-[#ac3500] font-semibold mb-4">{testimonial.trip}</div>

                {/* Customer Info */}
                <div className="flex items-center">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-slate-600 mb-4">Ready to create your own amazing story?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/travel"
              className="bg-[#ac3500] hover:bg-[#e75111] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Travel Packages
            </a>
            <a
              href="/tours"
              className="border border-[#ac3500] text-[#ac3500] hover:bg-[#ac3500] hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Explore Tours
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
