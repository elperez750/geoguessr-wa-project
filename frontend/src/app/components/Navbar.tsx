"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, MapPin, Target } from "lucide-react"
import { useAuth } from "@/app/context/AuthContext"
import { useGame } from "@/app/context/GameContext"

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { gameStatus, roundNumber, totalRounds } = useGame()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  const isGameActive = gameStatus === "active" || gameStatus === "loading"

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
          ? 'backdrop-blur-md bg-white/95 shadow-xl border-b border-slate-200/50'
          : 'backdrop-blur-lg bg-white/90'
      }
    `}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">

            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl
                             flex items-center justify-center transition-all duration-300
                             group-hover:rotate-6 group-hover:scale-110 shadow-lg group-hover:shadow-emerald-500/25">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
                GeoWA
              </span>
                <span className="text-xs text-slate-500 -mt-1 tracking-wide font-medium">
                Explorer
              </span>
              </div>
            </Link>

            {/* Round Indicator - Show when game is active */}
            {isGameActive && (
              <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-emerald-100 to-blue-100 
                            rounded-full border border-emerald-200/50 backdrop-blur-sm shadow-lg">
                <Target className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-800">
                  Round {roundNumber} of {totalRounds}
                </span>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            )}

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                  href="/"
                  className="relative text-slate-700 hover:text-slate-900 font-semibold
                        transition-all duration-200 py-2 group"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600
                              transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
              {!isGameActive && (
                <Link
                    href="/play"
                    className="relative text-slate-700 hover:text-slate-900 font-semibold
                          transition-all duration-200 py-2 group"
                >
                  Play
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-600 to-blue-600
                                transition-all duration-300 group-hover:w-full rounded-full"></span>
                </Link>
              )}
            </nav>

            {/* Auth Buttons */}
            {isAuthenticated && user ? (
                <div className="hidden md:flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">{user.email}</span>
                  </div>
                  <button
                      onClick={logout}
                      className="text-slate-700 hover:text-slate-900 font-semibold transition-all duration-200 
                               px-3 py-1.5 rounded-lg hover:bg-slate-100"
                  >
                    Logout
                  </button>
                </div>
            ) : (
                <div className="hidden md:flex items-center gap-4">
                  <Link
                      href="/authentication"
                      className="text-slate-700 hover:text-slate-900 font-semibold transition-all duration-200
                               px-3 py-1.5 rounded-lg hover:bg-slate-100"
                  >
                    Login
                  </Link>
                  <Link
                      href="/authentication"
                      className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white
                        px-6 py-2.5 rounded-xl font-semibold transition-all duration-300
                        hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-1 hover:scale-105
                        active:translate-y-0 active:scale-100"
                  >
                    Get Started
                  </Link>
                </div>
            )}



            {/* Mobile Menu Button */}
            <button
                className="md:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100
                      transition-all duration-200 hover:scale-105"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                  <X className="h-5 w-5" />
              ) : (
                  <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Round Indicator */}
          {isGameActive && (
            <div className="md:hidden mt-3 flex justify-center">
              <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-emerald-100 to-blue-100 
                            rounded-full border border-emerald-200/50 backdrop-blur-sm shadow-lg">
                <Target className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-800">
                  Round {roundNumber} of {totalRounds}
                </span>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          <div className={`
          md:hidden overflow-hidden transition-all duration-300 ease-out
          ${isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}
        `}>
            <nav className="pt-4 pb-2 border-t border-slate-200/50 mt-4">
              <div className="flex flex-col gap-2">
                <Link
                    href="/"
                    className="text-slate-700 hover:text-slate-900 hover:bg-slate-50
                          font-semibold px-4 py-3 rounded-xl transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                {!isGameActive && (
                  <Link
                      href="/play"
                      className="text-slate-700 hover:text-slate-900 hover:bg-slate-50
                            font-semibold px-4 py-3 rounded-xl transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                  >
                    Play
                  </Link>
                )}

                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-xl">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-slate-700">{user.email}</span>
                    </div>
                    <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="text-slate-700 hover:text-slate-900 hover:bg-slate-50
                              font-semibold px-4 py-3 rounded-xl transition-all duration-200 text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                        href="/authentication"
                        className="text-slate-700 hover:text-slate-900 hover:bg-slate-50
                              font-semibold px-4 py-3 rounded-xl transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                        href="/authentication"
                        className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white
                              px-4 py-3 rounded-xl font-semibold transition-all duration-200
                              hover:shadow-lg mt-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>
  )
}