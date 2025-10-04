import { Shield, Award, Headphones, Globe } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Your safety is our priority. All our packages include comprehensive insurance and 24/7 support.",
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized as the best travel agency with over 500 satisfied customers and 5-star ratings.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated support team is available round the clock to assist you during your journey.",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "With partners worldwide, we ensure seamless experiences across all destinations.",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-4 text-balance">
            Why Choose BAO Travel?
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto text-pretty">
            We're committed to providing exceptional travel experiences with unmatched service and attention to detail.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-[#f4b89e] rounded-full flex items-center justify-center mx-auto mb-6 cursor-pointer group-hover:bg-[#ac3500] transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-[#ac3500] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 text-pretty">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
