"use client";

import { Footer } from "@/modules/landing/footer";
import { Navbar } from "@/modules/landing/navbar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
    Calendar,
    Heart,
    PlayCircle,
    Rocket,
    Shield,
    Sparkles,
    Target,
    Users
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { number: "10k+", label: "Happy Families", icon: "👨‍👩‍👧‍👦", color: "text-purple-500", bg: "bg-purple-50" },
    { number: "500+", label: "Magic Nurseries", icon: "🏫", color: "text-blue-500", bg: "bg-blue-50" },
    { number: "50k+", label: "Little Heroes", icon: "👶", color: "text-pink-500", bg: "bg-pink-50" },
    { number: "100%", label: "Pure Magic", icon: "✨", color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const features = [
    {
      icon: <Heart className="w-10 h-10 text-red-500" />,
      title: "Built with Extra Love! ❤️",
      description: "We poured all our heart into making KidLink the most caring place for your little explorers.",
      color: "bg-red-50 border-red-200",
    },
    {
      icon: <Users className="w-10 h-10 text-blue-500" />,
      title: "Family Superpowers! 🦸‍♂️",
      description: "Connecting parents and teachers with the speed of a superhero zoom! ⚡",
      color: "bg-blue-50 border-blue-200",
    },
    {
      icon: <Shield className="w-10 h-10 text-green-500" />,
      title: "Safe & Sound! 🛡️",
      description: "Your data is tucked in safely under our giant, invisible safety blanket.",
      color: "bg-green-50 border-green-200",
    },
    {
      icon: <Target className="w-10 h-10 text-purple-500" />,
      title: "Celebrate Every Win! 🏆",
      description: "From first crawls to first draws, we capture every magical milestone!",
      color: "bg-purple-50 border-purple-200",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Captain of Fun (CEO)",
      bio: "A teacher at heart who believes every child's doodle is a masterpiece! 🎨",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
      name: "Michael Chen",
      role: "Digital Wizard (CTO)",
      bio: "Turns morning coffee into magical playground apps for happy nurseries! ☕",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Smile Specialist",
      bio: "Expert in developmental magic and making sure every day is an adventure!",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
    {
      name: "David Thompson",
      role: "Art Master (Design)",
      bio: "Crafts beautiful worlds where colors dance and imagination runs wild! 🌈",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
  ];

  return (
    <div className="bg-white min-h-screen overflow-x-hidden selection:bg-yellow-200 selection:text-black">
      <Navbar />

      {/* Magical Hero Header */}
      <section className="relative pt-32 pb-24 px-4 bg-gradient-to-b from-yellow-200 via-pink-100 to-white">
        {/* Animated Background Icons */}
        <div className="absolute top-24 left-10 text-6xl animate-bounce-slow opacity-20">🎈</div>
        <div className="absolute top-48 right-12 text-7xl animate-pulse opacity-20">🧸</div>
        <div className="absolute bottom-20 left-1/4 text-5xl animate-bounce delay-300 opacity-20">🌈</div>
        <div className="absolute top-1/2 right-1/4 text-5xl animate-spin-slow opacity-10">⚙️</div>

        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <Badge className="mb-6 text-xl px-8 py-3 bg-white text-purple-600 chunky-border border-purple-300 font-cartoon animate-pulse shadow-lg">
            Our Magic World ✨
          </Badge>
          <h1 className="text-6xl md:text-9xl font-black font-cartoon text-gray-900 mb-8 leading-none drop-shadow-sm tracking-tight">
            Meet the <span className="text-purple-600">Dreamers</span>! 🌟
          </h1>
          <p className="text-2xl md:text-4xl font-bold text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed font-sans">
            We are a band of <span className="text-pink-500 italic">visionaries</span> and <span className="text-blue-500 underline decoration-8 decoration-blue-200">big-hearted creators</span> building the future of childhood! 🚀
          </p>

          <div className="inline-flex gap-8 p-6 bg-white/40 backdrop-blur-md rounded-[3rem] border-4 border-white shadow-2xl animate-float">
             <Heart className="w-14 h-14 text-red-500 animate-pulse" />
             <Sparkles className="w-14 h-14 text-yellow-500 animate-bounce" />
             <Rocket className="w-14 h-14 text-blue-500 animate-pulse delay-500" />
          </div>
        </div>
      </section>

      {/* The Big Story Adventure */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white chunky-border border-purple-400 p-10 md:p-20 rounded-[5rem] bubble-shadow relative overflow-hidden group hover:rotate-1 transition-all duration-700">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#a855f7_2px,transparent_2px)] [background-size:32px_32px]"></div>

            <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div className="space-y-8">
                <h2 className="text-5xl md:text-7xl font-black font-cartoon text-purple-600 leading-tight">
                  Once Upon a <span className="text-yellow-500">Time...</span> 📖
                </h2>
                <div className="space-y-6 text-xl md:text-2xl font-bold text-gray-600 leading-relaxed font-sans">
                  <p>
                    It all started with a simple question: <span className="text-blue-500 underline decoration-wavy decoration-blue-300">"What did my child do today?"</span> 🧸
                  </p>
                  <p>
                    We realized that nurseries were full of magic, but parents were missing the show! So, we built a bridge made of code and <span className="text-red-500">pixie dust</span>. ✨
                  </p>
                  <p>
                    Now, KidLink brings that magic straight to your phone, making every day a shared adventure!
                  </p>
                </div>
                <div className="flex gap-4 pt-4">
                  <Badge className="bg-green-100 text-green-700 chunky-border border-green-200 px-4 py-2 text-lg">Safe 🛡️</Badge>
                  <Badge className="bg-blue-100 text-blue-700 chunky-border border-blue-200 px-4 py-2 text-lg">Fun 🎈</Badge>
                  <Badge className="bg-yellow-100 text-yellow-700 chunky-border border-yellow-200 px-4 py-2 text-lg">Magic ✨</Badge>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-12 rounded-[4rem] chunky-border border-yellow-300 -rotate-3 transform group-hover:rotate-0 transition-all duration-700">
                   <div className="grid grid-cols-2 gap-8">
                      {[
                        { icon: "🎨", label: "Creative" },
                        { icon: "🍎", label: "Healthy" },
                        { icon: "🧩", label: "Learning" },
                        { icon: "🧸", label: "Playtime" }
                      ].map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] chunky-border border-gray-100 flex flex-col items-center bubble-shadow hover:-translate-y-2 transition-transform">
                           <div className="text-6xl mb-3">{item.icon}</div>
                           <div className="font-cartoon text-xl text-gray-800 tracking-wide">{item.label}</div>
                        </div>
                      ))}
                   </div>
                </div>
                {/* Floating Elements */}
                <div className="absolute -top-12 -right-8 text-7xl animate-bounce-slow delay-700">⭐</div>
                <div className="absolute -bottom-10 -left-10 text-6xl animate-pulse">🍭</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fun Stats Row */}
      <section className="py-24 px-4 bg-gray-50/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`p-10 text-center ${stat.bg} chunky-border border-gray-200 bubble-shadow hover:scale-110 transition-all duration-300 group`}
              >
                <div className="text-7xl mb-6 group-hover:scale-125 transition-transform duration-500 inline-block drop-shadow-md">
                  {stat.icon}
                </div>
                <div className={`text-5xl md:text-6xl font-black font-cartoon mb-2 ${stat.color} tracking-tight`}>
                  {stat.number}
                </div>
                <div className="text-lg font-black text-gray-500 uppercase tracking-[0.2em] leading-none">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Magic Superpowers */}
      <section className="py-32 px-4 bg-white relative">
        <div className="container mx-auto max-w-6xl">
           <div className="text-center mb-24">
              <h2 className="text-6xl md:text-8xl font-black font-cartoon text-gray-900 mb-8 leading-none">
                 Our <span className="text-pink-500 italic">Magic</span> Powers! 🌈
              </h2>
              <p className="text-2xl md:text-3xl font-bold text-gray-500 max-w-3xl mx-auto font-sans leading-relaxed">
                 We don't just build code, we build smiles and super-connections every single day! 💫
              </p>
           </div>

           <div className="grid md:grid-cols-2 gap-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-12 chunky-border bubble-shadow bubble-shadow-hover transition-all duration-500 transform group hover:-translate-y-3 ${feature.color}`}
                >
                  <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                    <div className="bg-white p-8 rounded-[3rem] chunky-border border-gray-100 shadow-2xl group-hover:rotate-12 transition-transform shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-4xl font-black font-cartoon text-gray-900 mb-4 tracking-wide">
                        {feature.title}
                      </h3>
                      <p className="text-xl md:text-2xl font-bold text-gray-600 leading-relaxed font-sans">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* The Super Helper Team */}
      <section className="py-32 px-4 bg-blue-50 relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-200/50 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-200/50 rounded-full blur-[100px]"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-8xl font-black font-cartoon text-gray-900 mb-8 leading-none">
              Meet Our <span className="text-blue-600 underline decoration-blue-200 decoration-8">Helpers</span>! 🦸‍♀️
            </h2>
            <p className="text-2xl md:text-3xl font-bold text-gray-500 font-sans italic">The big kids making the magic happen behind the scenes!</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16">
            {team.map((member, index) => (
              <div key={index} className="flex flex-col items-center group">
                 <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
                    <div className="w-52 h-52 chunky-border border-white rounded-[4rem] overflow-hidden relative z-10 bg-white shadow-2xl p-2 transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                       <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-yellow-400 p-3 rounded-2xl chunky-border border-white z-20 shadow-lg animate-bounce-slow">
                       <Sparkles className="w-6 h-6 text-white" />
                    </div>
                 </div>
                 <div className="text-center px-4">
                    <h3 className="text-3xl font-black font-cartoon text-gray-900 mb-2 leading-none">{member.name}</h3>
                    <div className="text-xl font-black text-purple-600 mb-4 tracking-wide uppercase text-sm">{member.role}</div>
                    <p className="text-lg font-bold text-gray-600 leading-tight font-sans italic">"{member.bio}"</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Adventure CTA */}
      <section className="py-32 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="chunky-border border-pink-400 p-16 md:p-24 text-center bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-400 bubble-shadow relative overflow-hidden group rounded-[5rem]">
            {/* Background sparkle bits */}
            <div className="absolute top-10 left-10 text-5xl animate-pulse text-white/50">✨</div>
            <div className="absolute bottom-20 right-10 text-6xl animate-bounce text-white/40">⭐</div>
            <div className="absolute top-1/2 left-20 text-4xl animate-spin-slow text-white/30 tracking-widest">✨</div>

            <div className="relative z-10">
              <div className="text-9xl mb-12 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 inline-block drop-shadow-2xl">🦄</div>
              <h2 className="text-6xl md:text-9xl font-black font-cartoon text-white mb-10 leading-none drop-shadow-2xl tracking-tight">
                Let's Start Your <span className="text-yellow-300">Adventure!</span> 🚀
              </h2>
              <p className="text-2xl md:text-4xl font-bold text-white/95 mb-16 max-w-3xl mx-auto leading-relaxed font-sans drop-shadow-md">
                Ready to transform your nursery into the most <span className="italic">magical place</span> on Earth? 🌈
              </p>

              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-white text-pink-600 hover:bg-gray-50 font-black text-3xl px-16 py-10 rounded-[3rem] shadow-[0_12px_0_0_#be123c] transform hover:translate-y-2 hover:shadow-[0_6px_0_0_#be123c] transition-all duration-300 border-4 border-white active:translate-y-4 active:shadow-none"
                  >
                    <PlayCircle className="w-10 h-10 mr-3" />
                    Play Now! 🍭
                  </Button>
                </Link>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-4 border-white text-white hover:bg-white/20 font-black text-3xl px-16 py-10 rounded-[3rem] shadow-[0_12px_0_0_#ffffff] transform hover:translate-y-2 hover:shadow-[0_6px_0_0_#ffffff] transition-all duration-300 active:translate-y-4 active:shadow-none bg-transparent"
                  >
                    <Calendar className="w-10 h-10 mr-3" />
                    Demo! 📅
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
