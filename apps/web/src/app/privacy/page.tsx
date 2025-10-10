"use client";

import { Footer } from "@/modules/landing/footer";
import { Navbar } from "@/modules/landing/navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Clock, Eye, FileText, Lock, Shield, UserCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
      <Navbar />
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Your privacy and data security are our top priorities. Learn how we
            protect and handle your information.
          </p>
          <p className="text-sm opacity-75 mt-4">Last updated: December 2024</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Introduction */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-800 flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              KidLink ("we," "our," or "us") is committed to protecting your
              privacy and ensuring the security of your personal information.
              This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our nursery management
              system.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-800 flex items-center">
              <Eye className="w-6 h-6 mr-2" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Personal Information
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    Names, email addresses, and contact information of parents,
                    teachers, and administrators
                  </li>
                  <li>Emergency contact information</li>
                  <li>
                    Child information including names, birthdates, and medical
                    notes (with parental consent)
                  </li>
                  <li>Payment and billing information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Usage Information
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    Log data including IP addresses, browser type, and access
                    times
                  </li>
                  <li>Device information and operating system details</li>
                  <li>
                    Usage patterns and feature interactions within the platform
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Educational Content
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Progress reports and assessment data</li>
                  <li>Photos and videos (with explicit parental consent)</li>
                  <li>Communication logs between parents and teachers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-800 flex items-center">
              <UserCheck className="w-6 h-6 mr-2" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Service Delivery
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                  <li>Provide and maintain our nursery management platform</li>
                  <li>Process payments and billing</li>
                  <li>Facilitate communication between parents and teachers</li>
                  <li>Generate progress reports and assessments</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Platform Improvement
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                  <li>Analyze usage patterns to improve functionality</li>
                  <li>Develop new features based on user needs</li>
                  <li>Ensure platform security and prevent misuse</li>
                  <li>Provide customer support and technical assistance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-800 flex items-center">
              <Lock className="w-6 h-6 mr-2" />
              Data Protection & Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  Security Measures
                </h3>
                <ul className="list-disc list-inside space-y-2 text-green-700">
                  <li>End-to-end encryption for all data transmission</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Multi-factor authentication for all user accounts</li>
                  <li>Secure data centers with 24/7 monitoring</li>
                  <li>Regular automated backups with encryption</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Access Controls
                </h3>
                <p className="text-gray-700 mb-3">
                  We implement strict access controls to ensure that only
                  authorized personnel can access your data:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    Role-based access permissions for different user types
                  </li>
                  <li>Regular access reviews and audit trails</li>
                  <li>Immediate revocation of access when no longer needed</li>
                  <li>Background checks for all employees with data access</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-800">
              Your Privacy Rights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg mt-1">
                    <Eye className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Access Your Data</h4>
                    <p className="text-sm text-gray-600">
                      Request a copy of all personal data we hold about you
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg mt-1">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Correct Your Data</h4>
                    <p className="text-sm text-gray-600">
                      Update or correct any inaccurate information
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 p-2 rounded-lg mt-1">
                    <Lock className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Delete Your Data</h4>
                    <p className="text-sm text-gray-600">
                      Request deletion of your personal information
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-teal-100 p-2 rounded-lg mt-1">
                    <UserCheck className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Limit Processing</h4>
                    <p className="text-sm text-gray-600">
                      Restrict how we process your personal data
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg mt-1">
                    <Shield className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Data Portability</h4>
                    <p className="text-sm text-gray-600">
                      Transfer your data to another service provider
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-gray-100 p-2 rounded-lg mt-1">
                    <Clock className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Withdraw Consent</h4>
                    <p className="text-sm text-gray-600">
                      Revoke consent for data processing at any time
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-800">Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy or wish to
              exercise your privacy rights, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> privacy@kidlink.com
                </p>
                <p>
                  <strong>Phone:</strong> +1 (555) 123-4567
                </p>
                <p>
                  <strong>Address:</strong> 123 Education Street, Suite 100,
                  Learning City, LC 12345
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              We will respond to your privacy requests within 30 days of
              receipt.
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
