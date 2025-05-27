"use client"

import React, { useState } from "react"
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {LoginFormType} from "@/app/types/authTypes";
import {useAuth} from "@/app/context/AuthContext";
import { MapPin } from "lucide-react";

export function LoginFormCard() {
    const [formData, setFormData] = useState<LoginFormType>({
        email: "",
        password: "",
    })

    const { login, user } = useAuth()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form submitted:", formData)
        await login(formData.email, formData.password);

    }

    return (
        <div className="w-full max-w-md mx-auto mt-16">
            {/* Card with glassmorphic styling */}
            <Card className="backdrop-blur-md bg-white/90 border-0 shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
                {/* Header with gradient accent */}
                <div className="relative bg-gradient-to-r from-emerald-600 to-blue-700 p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <CardHeader className="relative p-0 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl text-white font-bold tracking-tight">
                                    Welcome Back
                                </CardTitle>
                                <CardDescription className="text-white/80 text-sm">
                                    Continue your Washington exploration
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </div>

                <form onSubmit={handleSubmit}>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-3">
                            <Label
                                htmlFor="email"
                                className="text-slate-700 font-medium text-sm tracking-wide"
                            >
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-700 placeholder:text-slate-400"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label
                                htmlFor="password"
                                className="text-slate-700 font-medium text-sm tracking-wide"
                            >
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="h-12 border-0 bg-slate-50 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 text-slate-700 placeholder:text-slate-400"
                            />
                        </div>


                    </CardContent>

                    <CardFooter className="px-8 pb-8">
                        <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-emerald-600 to-blue-700 hover:from-emerald-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Sign In to GeoWA
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}