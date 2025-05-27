"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, MapPin } from "lucide-react"
import { useAuth } from "@/app/context/AuthContext"

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
      <header className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out
      ${scrolled
          ? 'backdrop-blur-md bg-white/90 shadow-lg border-b border-slate-200/50'
          : 'backdrop-blur-sm bg-white/80'
      }
    `}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">

            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-blue-700 rounded-lg
                             flex items-center justify-center transition-transform duration-200
                             group-hover:rotate-3 group-hover:scale-105">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-800 tracking-tight">
                GeoWA
              </span>
                <span className="text-xs text-slate-500 -mt-1 tracking-wide">
                Explorer
              </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                  href="/"
                  className="relative text-slate-700 hover:text-slate-900 font-medium
                        transition-colors duration-200 py-2 group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600
                              transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                  href="/play"
                  className="relative text-slate-700 hover:text-slate-900 font-medium
                        transition-colors duration-200 py-2 group"
              >
                Play
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-600
                              transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Auth Buttons */}
            {isAuthenticated && user ? (

                <div className="hidden md:flex items-center gap-4">
                  <div className="flex items-center gap-4">{user.email}</div>
                  <Link
                      href=""
                      onClick={logout}
                      className="text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200"
                  >
                    Logout
                  </Link>
                </div>
            ):
                <div className="hidden md:flex items-center gap-4">
                  <Link
                      href="/authentication"
                      className="text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                      href="/authentication"
                      className="bg-gradient-to-r from-emerald-600 to-blue-700 text-white
                        px-5 py-2 rounded-xl font-medium transition-all duration-200
                        hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5
                        active:translate-y-0"
                  >
                    Get Started
                  </Link>
                </div>


            }



            {/* Mobile Menu Button */}
            <button
                className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100
                      transition-colors duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                  <X className="h-5 w-5" />
              ) : (
                  <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`
          md:hidden overflow-hidden transition-all duration-300 ease-out
          ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}
        `}>
            <nav className="pt-4 pb-2 border-t border-slate-200/50 mt-4">
              <div className="flex flex-col gap-1">
                <Link
                    href="/"
                    className="text-slate-700 hover:text-slate-900 hover:bg-slate-50
                          font-medium px-4 py-3 rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                    href="/play"
                    className="text-slate-700 hover:text-slate-900 hover:bg-slate-50
                          font-medium px-4 py-3 rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                >
                  Play
                </Link>


                <Link
                    href="/authentication"
                    className="text-slate-700 hover:text-slate-900 hover:bg-slate-50
                          font-medium px-4 py-3 rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                >
                  Login / Register
                </Link>
                <Link
                    href="/authentication"
                    className="bg-gradient-to-r from-emerald-600 to-blue-700 text-white
                          px-4 py-3 rounded-lg font-medium transition-all duration-200
                          hover:shadow-lg mt-2"
                    onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>
  )
}