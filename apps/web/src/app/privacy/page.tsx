"use client";

import { Footer } from "@/modules/landing/footer";
import { Navbar } from "@/modules/landing/navbar";
import { Badge } from "@repo/ui/components/badge";
import {
    Clock,
    Heart,
    Mail,
    MapPin,
    Phone,
    Search,
    ShieldAlert,
    Sparkles,
    Zap
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "December 20, 2024";

  return (
    <div className="bg-white min-h-screen overflow-x-hidden selection:bg-blue-200 selection:text-black">
      <Navbar />

      {/* Magical Header Section */}
      <section className="relative pt-32 pb-24 px-4 bg-gradient-to-b from-blue-200 via-purple-100 to-white">
        {/* Animated Background Icons */}
        <div className="absolute top-24 left-10 text-6xl animate-bounce-slow opacity-20">🛡️</div>
        <div className="absolute top-48 right-12 text-7xl animate-pulse opacity-20">🔒</div>
        <div className="absolute bottom-10 left-1/4 text-5xl animate-bounce delay-300 opacity-20">✨</div>
        <div className="absolute top-1/2 right-1/4 text-5xl animate-spin-slow opacity-10">🕵️</div>

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <Badge className="mb-6 text-xl px-8 py-3 bg-white text-blue-600 chunky-border border-blue-300 font-cartoon animate-pulse shadow-lg">
            Safety First! 🛡️
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black font-cartoon text-gray-900 mb-8 leading-none drop-shadow-sm tracking-tight">
            Our <span className="text-blue-600">Privacy</span> Promise ✨
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed font-sans">
            Your data is tucked in <span className="text-purple-500 italic">safely</span> and protected by our <span className="text-blue-500 underline decoration-8 decoration-blue-200">magic security shield</span>! 🔒
          </p>
          <div className="inline-flex items-center gap-2 bg-white/50 px-6 py-2 rounded-full border-2 border-blue-100 font-cartoon text-blue-500">
            <Clock className="w-5 h-5" />
            Last updated: {lastUpdated} 📅
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-5xl space-y-20">

        {/* Intro Card */}
        <div className="bg-white chunky-border border-blue-400 p-8 md:p-16 rounded-[4rem] bubble-shadow relative group hover:-rotate-1 transition-all duration-500">
           <div className="absolute -top-10 -right-10 text-7xl group-hover:rotate-12 transition-transform">📄</div>
           <div className="space-y-8 relative z-10">
              <Badge className="bg-blue-100 text-blue-700 chunky-border border-blue-200 text-xl px-6 py-2 font-cartoon">
                 The Hello! 👋
              </Badge>
              <h2 className="text-4xl md:text-6xl font-black font-cartoon text-gray-800">Welcome to the Safe Zone!</h2>
              <p className="text-xl md:text-2xl font-bold text-gray-600 leading-relaxed font-sans">
                 KidLink ("we," "our," or "us") is like a giant, protective hug for your data! 🤗 We’re committed to making sure your information stays safe while we help manage your magical nursery world.
              </p>
           </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-12">
           {/* Section 1 */}
           <div className="bg-purple-50 chunky-border border-purple-400 p-10 rounded-[3rem] bubble-shadow space-y-8 group hover:scale-[1.02] transition-transform">
              <div className="bg-white w-20 h-20 rounded-3xl chunky-border border-purple-200 flex items-center justify-center shadow-xl mb-4 transform -rotate-6 group-hover:rotate-0 transition-transform">
                 <Search className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="text-4xl font-black font-cartoon text-purple-700">Things We Peek at 🧐</h3>
              <div className="space-y-6">
                 <div>
                    <h4 className="text-xl font-black font-cartoon text-gray-800 flex items-center gap-2">
                       <Heart className="w-5 h-5 text-red-500" /> Personal Bits
                    </h4>
                    <p className="text-lg font-bold text-gray-600 font-sans">Names, emails, and phone numbers for our teachers and happy families!</p>
                 </div>
                 <div>
                    <h4 className="text-xl font-black font-cartoon text-gray-800 flex items-center gap-2">
                       <Zap className="w-5 h-5 text-yellow-500" /> App Magic
                    </h4>
                    <p className="text-lg font-bold text-gray-600 font-sans">How you use our platform, your browser type, and access times.</p>
                 </div>
                 <div>
                    <h4 className="text-xl font-black font-cartoon text-gray-800 flex items-center gap-2">
                       <Sparkles className="w-5 h-5 text-blue-500" /> Learning Fun
                    </h4>
                    <p className="text-lg font-bold text-gray-600 font-sans">Progress reports, magical photos, and chats between teachers and parents.</p>
                 </div>
              </div>
           </div>

           {/* Section 2 */}
           <div className="bg-green-50 chunky-border border-green-400 p-10 rounded-[3rem] bubble-shadow space-y-8 group hover:scale-[1.02] transition-transform">
              <div className="bg-white w-20 h-20 rounded-3xl chunky-border border-green-200 flex items-center justify-center shadow-xl mb-4 transform rotate-6 group-hover:rotate-0 transition-transform">
                 <ShieldAlert className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-4xl font-black font-cartoon text-green-700">How We Use Magic ✨</h3>
              <div className="space-y-6">
                 <div className="flex gap-4 p-5 bg-white/60 rounded-3xl chunky-border border-green-100">
                    <div className="text-4xl bounce-slow">🚀</div>
                    <p className="text-lg font-bold text-gray-600 font-sans">To keep the KidLink ship sailing smooth and fast at all times!</p>
                 </div>
                 <div className="flex gap-4 p-5 bg-white/60 rounded-3xl chunky-border border-green-100">
                    <div className="text-4xl">💬</div>
                    <p className="text-lg font-bold text-gray-600 font-sans">To help teachers and parents talk with superpower speed!</p>
                 </div>
                 <div className="flex gap-4 p-5 bg-white/60 rounded-3xl chunky-border border-green-100">
                    <div className="text-4xl">🛠️</div>
                    <p className="text-lg font-bold text-gray-600 font-sans">To build new, even more magical features for everyone to enjoy!</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Security Fort */}
        <div className="bg-blue-600 chunky-border border-white p-10 md:p-20 rounded-[5rem] bubble-shadow relative overflow-hidden text-white group hover:rotate-1 transition-all duration-700">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
           <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
              <div className="space-y-8 text-center md:text-left">
                 <Badge className="bg-white text-blue-700 chunky-border border-blue-200 text-xl px-6 py-2 font-cartoon">
                    Our Fort! 🏰
                 </Badge>
                 <h2 className="text-5xl md:text-8xl font-black font-cartoon leading-tight">Your Data’s <span className="text-yellow-300">Invisible</span> Shield! 🛡️</h2>
                 <p className="text-xl md:text-2xl font-bold text-blue-50 leading-relaxed font-sans">
                    We use <span className="underline decoration-wavy decoration-yellow-400">super-strong encryption</span> to keep your data safe from pesky intruders! Our fort is guarded by digital knights. ⚔️
                 </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-[4rem] p-10 chunky-border border-white/20 shadow-2xl">
                 <ul className="space-y-6">
                    {[
                       { icon: "🔐", text: "Encryption Locks" },
                       { icon: "🛡️", text: "Safety Audits" },
                       { icon: "🔑", text: "Multi-Factor Keys" },
                       { icon: "☁️", text: "Secure Backups" }
                    ].map((item, i) => (
                       <li key={i} className="flex items-center gap-6 text-2xl font-black font-cartoon">
                          <span className="bg-white p-4 rounded-3xl chunky-border border-blue-400 text-3xl shadow-lg">{item.icon}</span>
                          {item.text}
                       </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>

        {/* Final CTA Area */}
        <div className="bg-yellow-400 chunky-border border-gray-900 p-12 md:p-24 rounded-[4rem] bubble-shadow text-center space-y-10 group relative overflow-hidden">
           <div className="absolute top-10 right-10 text-6xl animate-pulse opacity-30">✨</div>
           <div className="text-9xl group-hover:scale-125 transition-all duration-700 animate-bounce-slow inline-block">📞</div>
           <h2 className="text-5xl md:text-8xl font-black font-cartoon text-gray-900 leading-none">Got a <span className="text-white drop-shadow-md">Question</span>?</h2>
           <p className="text-2xl md:text-3xl font-bold text-gray-800 max-w-2xl mx-auto font-sans">
              Don't be shy! Our magic helper team is always here to answer your safety questions. 🌈
           </p>

           <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/40 p-8 rounded-3xl chunky-border border-gray-900 flex flex-col items-center bubble-shadow-hover transition-all">
                 <Mail className="w-10 h-10 mb-4" />
                 <span className="font-cartoon text-2xl">privacy@kidlink.com</span>
              </div>
              <div className="bg-white/40 p-8 rounded-3xl chunky-border border-gray-900 flex flex-col items-center bubble-shadow-hover transition-all">
                 <Phone className="w-10 h-10 mb-4" />
                 <span className="font-cartoon text-2xl">+1 (555) MAGIC</span>
              </div>
              <div className="bg-white/40 p-8 rounded-3xl chunky-border border-gray-900 flex flex-col items-center bubble-shadow-hover transition-all">
                 <MapPin className="w-10 h-10 mb-4" />
                 <span className="font-cartoon text-2xl text-center">Magic St, Education City</span>
              </div>
           </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
