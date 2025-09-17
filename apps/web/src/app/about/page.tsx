"use client";

import { Navbar } from "@/modules/landing/navbar";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  ArrowRight,
  Award,
  Heart,
  Lightbulb,
  Shield,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { number: "10,000+", label: "Happy Families" },
    { number: "500+", label: "Partner Nurseries" },
    { number: "50,000+", label: "Children Supported" },
    { number: "99.9%", label: "Uptime Reliability" },
  ];

  const features = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Child-Centered Design",
      description:
        "Every feature is designed with children's safety, development, and well-being as the top priority.",
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Family Connection",
      description:
        "Strengthen the bond between families and educators through seamless communication and transparency.",
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "Security First",
      description:
        "Enterprise-grade security ensures your family's data is protected with the highest standards.",
    },
    {
      icon: <Target className="w-8 h-8 text-purple-500" />,
      title: "Growth Tracking",
      description:
        "Comprehensive tools to monitor and celebrate each child's unique developmental journey.",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      bio: "Former early childhood educator with 15 years of experience in nursery management.",
      image: "/team/sarah.jpg",
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      bio: "Tech veteran with expertise in educational technology and child safety systems.",
      image: "/team/michael.jpg",
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Head of Child Development",
      bio: "Child psychologist specializing in early learning and developmental milestones.",
      image: "/team/emily.jpg",
    },
    {
      name: "David Thompson",
      role: "Head of Product",
      bio: "Product designer focused on creating intuitive experiences for educators and families.",
      image: "/team/david.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About KidLink</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8">
            Connecting hearts, minds, and futures in early childhood education
          </p>
          <div className="flex justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            To empower nurseries, educators, and families with innovative
            technology that enhances early childhood education, promotes
            transparent communication, and supports every child's unique
            developmental journey.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Story Section */}
        <Card className="mb-16 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-purple-800">
              Our Story
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  KidLink was born from a simple observation: the disconnect
                  between what happens in nurseries and what parents know about
                  their child's day. As educators and parents ourselves, we saw
                  the challenges faced by both sides of this relationship.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We founded KidLink in 2020 with a vision to bridge this gap
                  using technology that prioritizes simplicity, security, and
                  meaningful connections. Our platform isn't just about
                  digitizing processes— it's about strengthening the community
                  around each child.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Today, we're proud to serve thousands of families and hundreds
                  of nurseries, creating transparent, collaborative environments
                  where children thrive.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-8 rounded-lg">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                    <span className="font-semibold">
                      Innovation in Education
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="w-6 h-6 text-red-500" />
                    <span className="font-semibold">Child-First Approach</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-green-500" />
                    <span className="font-semibold">Privacy & Security</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-blue-500" />
                    <span className="font-semibold">Community Building</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            What Makes Us Different
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-purple-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <Card className="mb-16 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-purple-800">
              Our Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Compassion</h3>
                <p className="text-gray-600">
                  Every decision we make is guided by empathy for children,
                  families, and educators.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                <p className="text-gray-600">
                  We strive for the highest quality in everything we do, from
                  code to customer service.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community</h3>
                <p className="text-gray-600">
                  We believe in the power of connection and collaboration in
                  early childhood education.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="pt-8 pb-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Nursery?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of educators and families who trust KidLink to
              connect, communicate, and celebrate childhood.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  Get Started Today
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Schedule a Demo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
