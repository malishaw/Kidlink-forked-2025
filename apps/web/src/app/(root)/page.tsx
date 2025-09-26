"use client";

import { Footer } from "@/modules/landing/footer";
import { Hero } from "@/modules/landing/hero";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  Heart,
  MessageCircle,
  PlayCircle,
  Shield,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-blue-500" />,
      title: "Learning Activities",
      description:
        "Track daily activities and learning progress with fun, interactive tools",
      color: "bg-blue-100 border-blue-200",
    },
    {
      icon: <Camera className="w-8 h-8 text-green-500" />,
      title: "Photo Sharing",
      description:
        "Share precious moments with parents through secure photo galleries",
      color: "bg-green-100 border-green-200",
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-purple-500" />,
      title: "Parent Communication",
      description:
        "Real-time messaging between teachers and parents made simple",
      color: "bg-purple-100 border-purple-200",
    },
    {
      icon: <Calendar className="w-8 h-8 text-orange-500" />,
      title: "Schedule Management",
      description:
        "Easy scheduling for activities, meals, and important events",
      color: "bg-orange-100 border-orange-200",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Nursery Owner",
      image: "👩‍🏫",
      quote:
        "KidLink transformed how we connect with families. Parents love seeing their child's day!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Parent",
      image: "👨‍💼",
      quote:
        "Finally, I can see what my daughter does all day. The photos and updates are amazing!",
      rating: 5,
    },
    {
      name: "Emma Davis",
      role: "Teacher",
      image: "👩‍🎓",
      quote:
        "So much easier to document activities and share with parents. Love the simple interface!",
      rating: 5,
    },
  ];

  const stats = [
    { number: "10,000+", label: "Happy Families", icon: "👨‍👩‍👧‍👦" },
    { number: "500+", label: "Partner Nurseries", icon: "🏫" },
    { number: "50,000+", label: "Children Supported", icon: "👶" },
    { number: "99.9%", label: "Uptime", icon: "⚡" },
  ];

  return (
    <div>
      <Hero />
      <div className="w-screen min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-purple-700 font-medium mb-6 border-2 border-purple-200">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Trusted by 500+ Nurseries
                </div>

                <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                    Connect
                  </span>
                  <br />
                  <span className="text-gray-800">Every Smile</span>
                  <br />
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    Every Day!
                  </span>
                  <span className="text-6xl">😊</span>
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  The most fun and friendly nursery management system that
                  brings
                  <span className="font-semibold text-purple-600">
                    {" "}
                    families
                  </span>
                  ,
                  <span className="font-semibold text-blue-600"> teachers</span>
                  , and
                  <span className="font-semibold text-green-600">
                    {" "}
                    children
                  </span>{" "}
                  together! 🌟
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/account">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg px-8 py-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 border-4 border-purple-300"
                    >
                      <PlayCircle className="w-6 h-6 mr-2" />
                      Start Your Journey! 🚀
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-4 border-blue-300 text-blue-600 hover:bg-blue-50 font-bold text-lg px-8 py-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <Calendar className="w-6 h-6 mr-2" />
                      Book a Demo 📅
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Free 30-day trial</span>
                  <span>•</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>No credit card required</span>
                  <span>•</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Setup in 5 minutes</span>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200 rounded-3xl p-8 border-4 border-white shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-white rounded-2xl p-6 border-4 border-gray-200">
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">🎨</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Daily Activities
                      </h3>
                      <p className="text-gray-600">
                        Track every magical moment!
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-xl border-2 border-blue-200">
                        <div className="text-2xl">🎵</div>
                        <div>
                          <div className="font-semibold text-blue-800">
                            Music Time
                          </div>
                          <div className="text-sm text-blue-600">
                            10:30 AM - 15 children
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-green-50 p-3 rounded-xl border-2 border-green-200">
                        <div className="text-2xl">🍎</div>
                        <div>
                          <div className="font-semibold text-green-800">
                            Snack Time
                          </div>
                          <div className="text-sm text-green-600">
                            2:00 PM - Healthy treats
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-xl border-2 border-purple-200">
                        <div className="text-2xl">📚</div>
                        <div>
                          <div className="font-semibold text-purple-800">
                            Story Time
                          </div>
                          <div className="text-sm text-purple-600">
                            3:30 PM - Adventure stories
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -left-4 text-4xl animate-bounce">
                  ⭐
                </div>
                <div className="absolute -top-2 -right-2 text-3xl animate-pulse">
                  🌈
                </div>
                <div className="absolute -bottom-4 -left-2 text-3xl animate-bounce delay-100">
                  🎈
                </div>
                <div className="absolute -bottom-2 -right-4 text-4xl animate-pulse delay-200">
                  💝
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 border-y-4 border-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-gray-800 mb-4">
                Making Magic Happen Everywhere! ✨
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="text-center border-4 border-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50"
                >
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-3">{stat.icon}</div>
                    <div className="text-3xl font-black text-purple-600 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-semibold">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 text-lg px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-2 border-orange-200">
                🎯 Amazing Features
              </Badge>
              <h2 className="text-5xl font-black text-gray-800 mb-6">
                Everything You Need for
                <br />
                <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                  Happy Little Learners!
                </span>
                <span className="text-4xl">👶📚</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our super-friendly tools make nursery management feel like
                child's play! 🎮
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`border-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:rotate-1 ${feature.color}`}
                >
                  <CardContent className="pt-8">
                    <div className="flex items-start gap-4">
                      <div className="bg-white p-4 rounded-2xl border-4 border-gray-200 shadow-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {feature.description}
                        </p>
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-2 font-semibold"
                          >
                            Learn More <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 text-lg px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-2 border-green-200">
                💬 Happy Voices
              </Badge>
              <h2 className="text-5xl font-black text-gray-800 mb-6">
                What Our Amazing
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Family Says!
                </span>
                <span className="text-4xl">💕</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="border-4 border-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-4xl">{testimonial.image}</div>
                      <div>
                        <div className="font-bold text-gray-800">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>

                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 leading-relaxed italic">
                      "{testimonial.quote}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10"></div>
          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <div className="text-6xl mb-6">🚀</div>
            <h2 className="text-5xl font-black text-white mb-6">
              Ready to Start the
              <br />
              Adventure?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of happy families and create magical moments every
              day! Your nursery management journey starts here! 🌟
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/account">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 font-bold text-xl px-10 py-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200 border-4 border-white"
                >
                  <Heart className="w-6 h-6 mr-2 text-red-500" />
                  Start Free Trial! 💫
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-4 border-white text-white hover:bg-white/10 font-bold text-xl px-10 py-6 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <MessageCircle className="w-6 h-6 mr-2" />
                  Talk to Us! 💬
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-4 text-white/80">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Free for 30 days</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Shield className="w-5 h-5 text-blue-400" />
                <span>100% Secure</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span>Setup in minutes</span>
              </div>
            </div>
          </div>

          {/* Floating emojis */}
          <div className="absolute top-10 left-10 text-4xl animate-bounce">
            🎈
          </div>
          <div className="absolute top-20 right-20 text-3xl animate-pulse">
            ⭐
          </div>
          <div className="absolute bottom-20 left-20 text-4xl animate-bounce delay-100">
            🌈
          </div>
          <div className="absolute bottom-10 right-10 text-3xl animate-pulse delay-200">
            🎉
          </div>
        </section>

        {/* Footer */}
        {/* <footer className="bg-gray-800 text-white py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="font-black text-2xl mb-4 text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                  KidLink 🌟
                </div>
                <p className="text-gray-400 mb-4">
                  Making nursery management magical, one smile at a time! 😊
                </p>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm">
                    f
                  </div>
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-sm">
                    t
                  </div>
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-sm">
                    i
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4">Product 🚀</h3>
                <div className="space-y-2 text-gray-400">
                  <Link
                    href="#"
                    className="block hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="#"
                    className="block hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="#"
                    className="block hover:text-white transition-colors"
                  >
                    Security
                  </Link>
                  <Link
                    href="#"
                    className="block hover:text-white transition-colors"
                  >
                    Mobile App
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4">Support 💝</h3>
                <div className="space-y-2 text-gray-400">
                  <Link
                    href="/contact"
                    className="block hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="#"
                    className="block hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                  <Link
                    href="#"
                    className="block hover:text-white transition-colors"
                  >
                    Training
                  </Link>
                  <Link
                    href="#"
                    className="block hover:text-white transition-colors"
                  >
                    Community
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-4">Company 🏢</h3>
                <div className="space-y-2 text-gray-400">
                  <Link
                    href="/about"
                    className="block hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/privacy"
                    className="block hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="#"
                    className="block hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="#"
                    className="block hover:text-white transition-colors"
                  >
                    Careers
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>
                &copy; 2024 KidLink. Made with ❤️ for amazing families and
                teachers! ✨
              </p>
            </div>
          </div>
        </footer> */}
        <Footer />
      </div>
    </div>
  );
}
