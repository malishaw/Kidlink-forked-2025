"use client";

import { Footer } from "@/modules/landing/footer";
import { Navbar } from "@/modules/landing/navbar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import {
    Clock,
    Gamepad2,
    GraduationCap,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Rocket,
    Send,
    Sparkles,
    Star,
    Wrench,
    Zap
} from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);

    alert("Yippee! We got your message! We'll zoom back to you soon! 🚀");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-white min-h-screen overflow-x-hidden selection:bg-purple-200 selection:text-black font-sans">
      <Navbar />

      {/* Magical Hero Header */}
      <section className="relative pt-32 pb-24 px-4 bg-gradient-to-b from-purple-200 via-blue-100 to-white">
        {/* Animated Background Icons */}
        <div className="absolute top-24 left-10 text-6xl animate-bounce-slow opacity-20">✉️</div>
        <div className="absolute top-48 right-12 text-7xl animate-pulse opacity-20">🎈</div>
        <div className="absolute bottom-20 left-1/4 text-5xl animate-bounce delay-300 opacity-20">✨</div>
        <div className="absolute top-1/2 right-1/4 text-5xl animate-spin-slow opacity-10">📞</div>

        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <Badge className="mb-6 text-xl px-8 py-3 bg-white text-purple-600 chunky-border border-purple-300 font-cartoon animate-pulse shadow-lg">
            Say Hello! 👋
          </Badge>
          <h1 className="text-6xl md:text-9xl font-black font-cartoon text-gray-900 mb-8 leading-none drop-shadow-sm tracking-tight">
            Let's <span className="text-purple-600">Chat</span>! 💬
          </h1>
          <p className="text-2xl md:text-4xl font-bold text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
            Have a question? A suggestion? Or just want to share some <span className="text-pink-500 italic font-cartoon">pixie dust</span>? We’re all ears! 🦄
          </p>

          <div className="inline-flex gap-8 p-6 bg-white/40 backdrop-blur-md rounded-[3rem] border-4 border-white shadow-2xl animate-float">
             <MessageCircle className="w-14 h-14 text-purple-500 animate-pulse" />
             <Sparkles className="w-14 h-14 text-yellow-500 animate-bounce" />
             <Rocket className="w-14 h-14 text-blue-500 animate-pulse delay-500" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-24 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Magical Contact Form */}
          <div className="bg-white chunky-border border-purple-400 p-8 md:p-12 rounded-[4rem] bubble-shadow relative group hover:-rotate-1 transition-all duration-500">
             <div className="absolute -top-10 -left-10 text-8xl group-hover:scale-110 transition-transform animate-bounce-slow">💌</div>

             <div className="space-y-10 relative z-10">
                <div className="text-center md:text-left">
                  <Badge className="bg-purple-100 text-purple-700 chunky-border border-purple-200 text-xl px-6 py-2 font-cartoon mb-4">
                    Send a Message! ✨
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-black font-cartoon text-gray-800">Your Magic Inquiry</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label htmlFor="name" className="text-2xl font-black font-cartoon text-gray-700 ml-2">Name</label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your cool name!"
                        className="h-16 rounded-3xl chunky-border border-gray-200 text-xl px-6 focus:ring-4 focus:ring-purple-200 transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="email" className="text-2xl font-black font-cartoon text-gray-700 ml-2">Email</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Where can we buzz you?"
                        className="h-16 rounded-3xl chunky-border border-gray-200 text-xl px-6 focus:ring-4 focus:ring-purple-200 transition-all font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="subject" className="text-2xl font-black font-cartoon text-gray-700 ml-2">Subject</label>
                    <Input
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's the buzz?"
                      className="h-16 rounded-3xl chunky-border border-gray-200 text-xl px-6 focus:ring-4 focus:ring-purple-200 transition-all font-bold"
                    />
                  </div>

                  <div className="space-y-3">
                    <label htmlFor="message" className="text-2xl font-black font-cartoon text-gray-700 ml-2">Message</label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us everything! 🌈"
                      className="rounded-[2.5rem] chunky-border border-gray-200 text-xl p-6 focus:ring-4 focus:ring-purple-200 transition-all font-bold min-h-[200px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-24 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-3xl rounded-[3rem] chunky-border border-white shadow-[0_12px_0_0_#9333ea] transform hover:translate-y-2 hover:shadow-[0_6px_0_0_#9333ea] transition-all duration-300 active:translate-y-4 active:shadow-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-white"></div>
                        <span>Zooming...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <Send className="w-8 h-8 rotate-12" />
                        <span>Send Blast! 🚀</span>
                      </div>
                    )}
                  </Button>
                </form>
             </div>
          </div>

          {/* Contact Information & Links */}
          <div className="space-y-12">

            {/* Get in Touch Card */}
            <div className="bg-blue-50 chunky-border border-blue-400 p-10 rounded-[3rem] bubble-shadow space-y-8 group hover:rotate-1 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-blue-100 text-blue-700 chunky-border border-blue-200 text-xl px-6 py-2 font-cartoon">
                  Quick Buzz! 🐝
                </Badge>
                <div className="bg-white w-16 h-16 rounded-2xl chunky-border border-blue-200 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Star className="w-8 h-8 text-yellow-500 fill-yellow-500 animate-pulse" />
                </div>
              </div>

              <div className="space-y-8">
                {[
                  {
                    icon: <Mail className="text-purple-500" />,
                    title: "Email Support",
                    value: "hello@kidlink.com",
                    sub: "Super fast zoom reply!",
                    bg: "bg-purple-100"
                  },
                  {
                    icon: <Phone className="text-blue-500" />,
                    title: "Phone Fun",
                    value: "+1 (555) MAGIC",
                    sub: "Direct line to the fun!",
                    bg: "bg-blue-100"
                  },
                  {
                    icon: <MapPin className="text-red-500" />,
                    title: "Our Clubhouse",
                    value: "123 Magic St, Education City",
                    sub: "Where the magic happens!",
                    bg: "bg-red-100"
                  },
                  {
                    icon: <Clock className="text-yellow-500" />,
                    title: "Playtime Hours",
                    value: "Mon-Sat: 9am - 6pm",
                    sub: "Sunday is for naps! 😴",
                    bg: "bg-yellow-100"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group/item transform hover:translate-x-2 transition-transform">
                    <div className={`${item.bg} w-16 h-16 rounded-2xl chunky-border border-white flex items-center justify-center shadow-lg shrink-0`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black font-cartoon text-gray-800 leading-none mb-1">{item.title}</h3>
                      <p className="text-xl font-bold text-gray-700">{item.value}</p>
                      <p className="text-sm font-bold text-gray-400 font-cartoon italic tracking-wide">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-green-50 chunky-border border-green-400 p-8 rounded-[3rem] bubble-shadow">
               <h3 className="text-3xl font-black font-cartoon text-green-700 mb-8 pl-4">Fast Tracks! 🚀</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: <Gamepad2 />, label: "Get Started", color: "hover:bg-blue-100 hover:text-blue-700 border-blue-200" },
                    { icon: <GraduationCap />, label: "Helper Center", color: "hover:bg-purple-100 hover:text-purple-700 border-purple-200" },
                    { icon: <Zap />, label: "Magic Tips", color: "hover:bg-yellow-100 hover:text-yellow-700 border-yellow-200" },
                    { icon: <Wrench />, label: "Tech Wizardry", color: "hover:bg-orange-100 hover:text-orange-700 border-orange-200" }
                  ].map((link, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className={`h-16 rounded-2xl chunky-border bg-white text-xl font-black font-cartoon flex items-center gap-3 shadow-md hover:translate-y-1 active:translate-y-2 transition-all ${link.color}`}
                    >
                      {link.icon}
                      {link.label}
                    </Button>
                  ))}
               </div>
            </div>

            {/* Extra Sparkle Element */}
            <div className="bg-pink-500 chunky-border border-white p-6 rounded-[2rem] text-white text-center bubble-shadow animate-float">
               <p className="text-2xl font-black font-cartoon tracking-wider">
                  WE CAN'T WAIT TO HEAR FROM YOU! 🌈✨
               </p>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
