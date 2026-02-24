import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4 relative h-12 w-40">
              <Image src="/images/ardalogo.png" alt="ARDA Seeds Logo" fill className="object-contain" />
            </div>
            <p className="mb-4">
              ARDA Seeds is a leading supplier of high-quality agricultural seeds in Zimbabwe, providing farmers with
              superior crop varieties for sustainable agriculture.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="hover:text-green-400">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://twitter.com" className="hover:text-green-400">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://instagram.com" className="hover:text-green-400">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="hover:text-green-400">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-green-400">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/agronomy" className="hover:text-green-400">
                  Agronomy Support
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-green-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-green-400">
                  News & Updates
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-green-400">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Products</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/maize" className="hover:text-green-400">
                  Maize Seeds
                </Link>
              </li>
              <li>
                <Link href="/products/wheat" className="hover:text-green-400">
                  Wheat Seeds
                </Link>
              </li>
              <li>
                <Link href="/products/soybeans" className="hover:text-green-400">
                  Soybean Seeds
                </Link>
              </li>
              <li>
                <Link href="/products/groundnuts" className="hover:text-green-400">
                  Groundnut Seeds
                </Link>
              </li>
              <li>
                <Link href="/products/sunflower" className="hover:text-green-400">
                  Sunflower Seeds
                </Link>
              </li>
              <li>
                <Link href="/products/other" className="hover:text-green-400">
                  Other Crop Seeds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>ARDA Seeds (PVT) Ltd, Harare, Zimbabwe</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>0242 704 924/5 | +263 71 149 6082</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                <Link href="mailto:customerexperience@ardaseeds.co.zw" className="hover:text-green-400">
                  customerexperience@ardaseeds.co.zw
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ARDA Seeds (PVT) Ltd. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/privacy" className="hover:text-green-400 mr-4">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-green-400">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
