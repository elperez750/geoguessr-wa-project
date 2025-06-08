"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import api from "@/app/api"
import { toast } from "sonner"
import { User } from "@/app/types/authTypes"
import {useRouter} from "next/navigation";
import { useGame} from "@/app/context/GameContext";
// Define the User type


// Define the AuthContext type
type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  refreshUserData: () => Promise<void>
}


// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create the AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { resetGame } = useGame();

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const router = useRouter();

  // Function to get user data from token
  const getUserData = async () => {
    try {
      const response = await api.get("/auth/me")
        console.log(response.data)
      setUser(response.data)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Error getting user data:", error)

    } finally {
      setIsLoading(false)
    }
  }

  // Check if user is authenticated on initial load
  useEffect(() => {
    getUserData()
  }, [])

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await api.post("/auth/login", { email, password })
      const { user: userData } = response.data
      console.log(userData)
      // Set user data in state
      setUser(userData)
      setIsAuthenticated(true)
      
      toast.success("Login Successful", {
        description: "Welcome back!",
        duration: 3000,
      })

      router.push("/play")
      return true
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          "Invalid credentials. Please try again."

      
      toast.error("Login Failed", {
        description: errorMessage,
        duration: 5000,
      })


      
      return false
    } finally {
      setIsLoading(false)
    }
  }


  // Register function
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      await api.post("/auth/register", { username, email, password })
      
      toast.success("Registration Successful", {
        description: "You can now log in with your credentials",
        duration: 3000,
      })
      
      return true
    } catch (error: unknown) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          "Registration failed. Please try again."
      
      toast.error("Registration Failed", {
        description: errorMessage,
        duration: 5000,
      })
      
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async() => {

    try {
      const response = await api.post("/auth/logout")
      console.log(response)
      setUser(null)
      resetGame()
      setIsAuthenticated(false)

      toast.success("Logged Out", {
        description: "You have been successfully logged out",
        duration: 3000,
      })

    }
    catch(e) {
      console.error("Error logging out:", e)
    }
    

  }

  // Refresh user data
  const refreshUserData = async () => {
    try {
      const response = await api.get("/auth/me")
      setUser(response.data)
    } catch (error: unknown) {
      console.error("Error refreshing user data:", error)
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUserData,
  };

  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  )

};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}