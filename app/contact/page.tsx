import type { Metadata } from "next"
import ContactForm from "@/components/contact-form"
import { MapPin, Phone, Mail, Clock, Building2, Users } from "lucide-react"
import "./contact-styles.css"

export const metadata: Metadata = {
  title: "Contact Us | ARDA Seeds",
  description:
    "Get in touch with ARDA Seeds. Contact our team for inquiries about our products, services, or any other information you need.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen contact-page">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-700 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 hero-title">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light leading-relaxed hero-subtitle max-w-3xl mx-auto">
              Get in touch with our team for any inquiries about our products, services, or any other information you need.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 form-card">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Send Us a Message</h2>
              </div>
              <ContactForm />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 info-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Contact Information</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-start contact-item">
                  <div className="bg-green-50 p-3 rounded-xl mr-4">
                    <MapPin className="h-6 w-6 text-green-700 flex-shrink-0" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg mb-1">Address</p>
                    <p className="text-gray-600 leading-relaxed">3 Mchlery</p>
                    <p className="text-gray-600 leading-relaxed">Eastlea, Harare</p>
                    <p className="text-gray-600 leading-relaxed">Zimbabwe</p>
                  </div>
                </div>

                <div className="flex items-start contact-item">
                  <div className="bg-green-50 p-3 rounded-xl mr-4">
                    <Phone className="h-6 w-6 text-green-700 flex-shrink-0" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg mb-1">Phone</p>
                    <p className="text-gray-600">0242 704 924/5</p>
                    <p className="text-gray-600">+263 71 149 6082</p>
                  </div>
                </div>

                <div className="flex items-start contact-item">
                  <div className="bg-green-50 p-3 rounded-xl mr-4">
                    <Mail className="h-6 w-6 text-green-700 flex-shrink-0" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg mb-1">Email</p>
                    <p className="text-gray-600">customerexperience@ardaseeds.co.zw</p>
                  </div>
                </div>

                <div className="flex items-start contact-item">
                  <div className="bg-green-50 p-3 rounded-xl mr-4">
                    <Clock className="h-6 w-6 text-green-700 flex-shrink-0" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg mb-1">Business Hours</p>
                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 5:00 PM</p>
                    <p className="text-gray-600">Saturday: 8:00 AM - 12:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Retail Partners */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-lg border border-green-100 partners-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Our Retail Partners</h2>
              </div>
              <div className="space-y-5">
                <div className="partner-item bg-white p-4 rounded-xl">
                  <p className="font-semibold text-lg mb-1">Farm and City</p>
                  <p className="text-gray-600">Multiple locations across Zimbabwe</p>
                  <p className="text-gray-600 text-sm mt-1">Contact: 0242 251 162</p>
                </div>

                <div className="partner-item bg-white p-4 rounded-xl">
                  <p className="font-semibold text-lg mb-1">Electrosales</p>
                  <p className="text-gray-600">Harare, Bulawayo, Mutare</p>
                  <p className="text-gray-600 text-sm mt-1">Contact: 08677222000</p>
                </div>

                <div className="partner-item bg-white p-4 rounded-xl">
                  <p className="font-semibold text-lg mb-1">Other Authorized Dealers</p>
                  <p className="text-gray-600">Find our products at agricultural supply stores nationwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 section-header">Find Us Here</h2>
            <p className="text-gray-600 text-lg">
              Visit our office at 3 Mchlery, Eastlea, Harare
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d391.0490562378794!2d31.062427575000996!3d-17.829423033739115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2szw!4v1771252504180!5m2!1sen!2szw"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="ARDA Seeds Location"
              className="map-iframe"
            />
          </div>
          <div className="mt-6 text-center">
            <a
              href="https://www.google.com/maps/search/?api=1&query=3+Mchlery,+Eastlea,+Harare,+Zimbabwe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
            >
              <MapPin className="h-5 w-5" />
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
