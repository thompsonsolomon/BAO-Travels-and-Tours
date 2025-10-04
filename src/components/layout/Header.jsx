import { useState } from "react"
import { Button } from "../ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import { Link } from "react-router-dom"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This will be managed by auth context

  const navigation = [
    { name: "Home", to: "/" },
    { name: "Travel Packages", to: "/travel" },
    { name: "Tours", to: "/tours" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
  ]

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#ac3500] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="font-serif text-xl font-bold text-foreground">BAO Travels & Tours</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} to={item.to} className="text-foreground hover:text-primary transition-colors">
                {item.name}
              </Link>
            ))}
          </nav>
          {/* Desktop Auth Buttons */}
          {/* <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div> */}

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                {isLoggedIn ? (
                  <>
                    <Link to="/dashboard" className="block py-2">
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="w-full justify-start mt-2">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth/login" className="block">
                      <Button variant="ghost" className="w-full mb-2">
                        Login
                      </Button>
                    </Link>
                    <Link to="/auth/register" className="block">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
