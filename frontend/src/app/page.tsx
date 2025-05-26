"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Play, UserPlus, Mountain, Target, Trophy, MapPin } from "lucide-react";
import Image from "next/image";
import Mountains from "@/assets/images/mountains.avif";

export default function Home() {
    const router = useRouter();

    const handlePlayGame = () => {
        router.push("/play");
    };

    const handleAuthenticateUser = () => {
        router.push("/authentication");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            {/* Main Content - Added pt-24 to account for fixed navbar */}
            <main className="max-w-6xl mx-auto px-4 py-12 pt-24">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Text Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                                Explore the Beautiful State of
                                <span className="text-emerald-700 block">Washington</span>
                            </h1>
                            <p className="text-xl text-slate-600 leading-relaxed">
                                Test your geography skills by exploring random locations around Washington state.
                                Drop into stunning landscapes and guess where you are. The closer your guess,
                                the more points you earn!
                            </p>
                        </div>

                        {/* Call to Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                onClick={handlePlayGame}
                                size="lg"
                                className="cursor-pointer bg-gradient-to-r from-emerald-600 to-blue-700 hover:from-emerald-700 hover:to-blue-800 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5"
                            >
                                <Play className="w-5 h-5" />
                                Play Now
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleAuthenticateUser}
                                size="lg"
                                className="cursor-pointer border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-8 py-3 text-lg font-semibold transition-all duration-200 flex items-center gap-2"
                            >
                                <UserPlus className="w-5 h-5" />
                                Create Account
                            </Button>
                        </div>

                        {/* Feature Points */}
                        <div className="grid sm:grid-cols-3 gap-6 pt-8">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Mountain className="w-6 h-6 text-emerald-700" />
                                </div>
                                <h3 className="font-semibold text-slate-800">Scenic Locations</h3>
                                <p className="text-sm text-slate-600">Explore mountains, forests, and coastlines</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Target className="w-6 h-6 text-blue-700" />
                                </div>
                                <h3 className="font-semibold text-slate-800">Test Skills</h3>
                                <p className="text-sm text-slate-600">Challenge your geography knowledge</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Trophy className="w-6 h-6 text-slate-700" />
                                </div>
                                <h3 className="font-semibold text-slate-800">Earn Points</h3>
                                <p className="text-sm text-slate-600">Compete and track your progress</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="relative">
                        <div className="relative bg-gradient-to-br from-emerald-200 to-blue-200 rounded-2xl shadow-2xl overflow-hidden aspect-square">
                            {/* Image */}
                            <Image
                                src={Mountains}
                                alt="Washington State Mountains"
                                fill
                                className="object-cover"
                            />

                            {/* Decorative Elements */}
                            <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full"></div>
                            <div className="absolute bottom-6 left-6 w-12 h-12 bg-white/10 rounded-full"></div>
                            <div className="absolute top-1/3 left-4 w-6 h-6 bg-white/15 rounded-full"></div>
                        </div>

                        {/* Floating Card */}
                        <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-slate-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-emerald-700" />
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-800">Challenge Yourself</div>
                                    <div className="text-sm text-slate-600">Guess the location!</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-16 py-8 bg-slate-100 border-t border-slate-200">
                <div className="max-w-6xl mx-auto px-4 text-center text-slate-600">
                    <p>Explore Washington State • Test Your Geography Skills • Have Fun!</p>
                </div>
            </footer>
        </div>
    );
}