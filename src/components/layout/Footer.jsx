import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="font-serif text-xl font-bold">BAO Travels & Tours</span>
            </div>
            <p className="text-slate-300 mb-6 max-w-md">
              Discover the world with our carefully curated travel packages and tours. Creating unforgettable
              experiences since 2020.
            </p>

            {/* Socials */}
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/travel" className="text-slate-300 hover:text-white transition-colors">
                  Travel Packages
                </Link>
              </li>
              <li>
                <Link to="/tours" className="text-slate-300 hover:text-white transition-colors">
                  Tours
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
             
              <li>
                <Link to="/privacy" className="text-slate-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-center space-x-2">
                <Mail size={18} className="text-primary" />
                <span>support@baotravels.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} className="text-primary" />
                <span>+234 801 234 5678</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={18} className="text-primary" />
                <span>15 Victoria Island, Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 mt-8 py-4 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} BAO Travels & Tours. All rights reserved.
      </div>
    </footer>
  )
}
