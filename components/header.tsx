"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, ShoppingCart } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCart } from "@/lib/cart-context"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { itemCount } = useCart()

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-20 w-56">
              <Image src="/images/ardalogo.png" alt="ARDA Seeds Logo" fill className="object-contain" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/" className="px-3 py-2 text-gray-700 hover:text-green-700">
              Home
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center px-3 py-2 text-gray-700 hover:text-green-700">
                  Products <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/products/maize">Maize</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products/wheat">Wheat</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products/soybeans">Soybeans</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products/groundnuts">Groundnuts</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products/sunflower">Sunflower</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products">All Products</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center px-3 py-2 text-gray-700 hover:text-green-700">
                  Services <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/services/outgrowing">Outgrowing</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/agronomy" className="px-3 py-2 text-gray-700 hover:text-green-700">
              Agronomy
            </Link>
            <Link href="/about" className="px-3 py-2 text-gray-700 hover:text-green-700">
              About Us
            </Link>
            <Link href="/news" className="px-3 py-2 text-gray-700 hover:text-green-700">
              News
            </Link>
            <Link href="/contact" className="px-3 py-2 text-gray-700 hover:text-green-700">
              Contact
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Cart icon with badge */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-green-700 transition-colors"
              aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-green-700 text-white text-xs font-bold flex items-center justify-center leading-none">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <Button asChild variant="outline" className="flex-1 bg-green-700 text-white border-green-700 hover:bg-white hover:text-green-700 hover:border-green-700">
              <Link href="/products">Order Seed</Link>
            </Button>
          </div>

          {/* Mobile: cart icon + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-green-700 transition-colors"
              aria-label={`Shopping cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-green-700 text-white text-xs font-bold flex items-center justify-center leading-none">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
            <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="px-3 py-2 text-gray-700 hover:text-green-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <div className="border-t pt-2">
                <p className="px-3 font-medium text-sm text-gray-500">Products</p>
                <Link
                  href="/products/maize"
                  className="px-6 py-2 text-gray-700 hover:text-green-700 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Maize
                </Link>
                <Link
                  href="/products/wheat"
                  className="px-6 py-2 text-gray-700 hover:text-green-700 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wheat
                </Link>
                <Link
                  href="/products/soybeans"
                  className="px-6 py-2 text-gray-700 hover:text-green-700 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Soybeans
                </Link>
                <Link
                  href="/products/groundnuts"
                  className="px-6 py-2 text-gray-700 hover:text-green-700 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Groundnuts
                </Link>
                <Link
                  href="/products/sunflower"
                  className="px-6 py-2 text-gray-700 hover:text-green-700 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sunflower
                </Link>
                <Link
                  href="/products"
                  className="px-6 py-2 text-gray-700 hover:text-green-700 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Products
                </Link>
              </div>
              <div className="border-t pt-2">
                <p className="px-3 font-medium text-sm text-gray-500">Services</p>
                <Link
                  href="/services/outgrowing"
                  className="px-6 py-2 text-gray-700 hover:text-green-700 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Outgrowing
                </Link>
              </div>
              <Link
                href="/agronomy"
                className="px-3 py-2 text-gray-700 hover:text-green-700 border-t"
                onClick={() => setIsMenuOpen(false)}
              >
                Agronomy
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 text-gray-700 hover:text-green-700"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/news"
                className="px-3 py-2 text-gray-700 hover:text-green-700"
                onClick={() => setIsMenuOpen(false)}
              >
                News
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 text-gray-700 hover:text-green-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-3 border-t">
                <Button asChild className="w-full bg-green-700 hover:bg-green-800">
                  <Link href="/products" onClick={() => setIsMenuOpen(false)}>
                    Order Seed
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
