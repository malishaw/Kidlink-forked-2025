import { Button } from "@repo/ui/components/button";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl animate-bounce">
          🌟
        </div>
        <div className="absolute top-20 right-20 text-4xl animate-pulse">
          🎈
        </div>
        <div className="absolute bottom-20 left-20 text-5xl animate-bounce delay-100">
          🌈
        </div>
        <div className="absolute bottom-10 right-10 text-4xl animate-pulse delay-200">
          💝
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">
          👶
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl">🌟</div>
              <div className="font-black text-3xl bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                KidLink
              </div>
            </div>
            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
              Making nursery management magical, one smile at a time!
              <span className="text-2xl">😊</span> We connect families,
              teachers, and little learners in the most wonderful way possible.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-5 h-5 text-pink-400" />
                <span>hello@kidlink.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-5 h-5 text-green-400" />
                <span>+1 (555) 123-KIDS</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span>Making Magic Worldwide 🌍</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 border-blue-500 text-white rounded-full p-3"
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-pink-600 hover:bg-pink-700 border-pink-500 text-white rounded-full p-3"
              >
                <Instagram className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 border-blue-400 text-white rounded-full p-3"
              >
                <Twitter className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-red-600 hover:bg-red-700 border-red-500 text-white rounded-full p-3"
              >
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              Legal & More 📋
            </h3>
            <div className="space-y-3">
              <Link
                href="/about"
                className="block text-gray-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
              >
                About Us 🌟
              </Link>
              <Link
                href="/privacy"
                className="block text-gray-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
              >
                Privacy Policy 🔒
              </Link>
              <Link
                href="/contact"
                className="block text-gray-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
              >
                Contact 📞
              </Link>
              <Link
                href="/#terms"
                className="block text-gray-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
              >
                Terms of Service 📜
              </Link>
              <Link
                href="/#cookies"
                className="block text-gray-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform"
              >
                Cookie Policy 🍪
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        {/* <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
              <Star className="w-8 h-8 text-yellow-400" />
              Stay Connected! 📬
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Get the latest updates, parenting tips, and magical moments
              delivered straight to your inbox!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200">
                Subscribe! 🎉
              </Button>
            </div>
          </div>
        </div> */}
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white/5 to-transparent">
        <svg
          className="absolute bottom-0 overflow-hidden"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          version="1.1"
          viewBox="0 0 2560 100"
          x="0"
          y="0"
        >
          <polygon
            className="fill-current text-white/5"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
    </footer>
  );
}
