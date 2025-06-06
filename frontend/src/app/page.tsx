"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Play, UserPlus, Mountain, Target, Trophy, MapPin } from "lucide-react";
import Image from "next/image";
import WashingtonMountains from "@/assets/images/washington-mountains-hq.jpg";
import {useGame} from "@/app/context/GameContext";
import {useEffect} from "react";
export default function Home() {
    const router = useRouter();
    const {resetGame} = useGame();
    useEffect(() => {
        resetGame()
    }, []);


    const handlePlayGame = () => {
        resetGame();
        router.push("/loading");
    };

    const handleAuthenticateUser = () => {
        router.push("/authentication");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1),transparent_50%)]"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>

            {/* Main Content */}
            <main className="relative max-w-7xl mx-auto px-4 py-12 pt-28">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Side - Text Content */}
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full text-sm font-medium text-emerald-800 border border-emerald-200/50 backdrop-blur-sm">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                                    Geography Challenge Game
                                </div>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                                Explore the Beautiful
                                <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent block mt-2">
                                    State of Washington
                                </span>
                            </h1>
                            <p className="text-xl text-slate-600 leading-relaxed font-light max-w-lg">
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
                                className="cursor-pointer bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-700 hover:from-emerald-700 hover:via-emerald-800 hover:to-blue-800 text-white px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center gap-3 hover:-translate-y-1 hover:scale-105 group"
                            >
                                <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                Play Now
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleAuthenticateUser}
                                size="lg"
                                className="cursor-pointer border-2 border-emerald-600/50 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-600 backdrop-blur-sm bg-white/50 px-10 py-4 text-lg font-semibold transition-all duration-300 flex items-center gap-3 hover:-translate-y-1 hover:scale-105 group shadow-lg hover:shadow-xl"
                            >
                                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                                Create Account
                            </Button>
                        </div>

                        {/* Feature Points */}
                        <div className="grid sm:grid-cols-3 gap-8 pt-12">
                            <div className="group text-center hover:-translate-y-2 transition-all duration-300 cursor-default">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
                                    <Mountain className="w-8 h-8 text-emerald-600 group-hover:scale-110 transition-transform duration-200" />
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg mb-2">Scenic Locations</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">Explore mountains, forests, and pristine coastlines</p>
                            </div>
                            <div className="group text-center hover:-translate-y-2 transition-all duration-300 cursor-default">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
                                    <Target className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg mb-2">Test Skills</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">Challenge your geography knowledge</p>
                            </div>
                            <div className="group text-center hover:-translate-y-2 transition-all duration-300 cursor-default">
                                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
                                    <Trophy className="w-8 h-8 text-slate-600 group-hover:scale-110 transition-transform duration-200" />
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg mb-2">Earn Points</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">Compete and track your progress</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="relative group">
                        <div className="relative bg-gradient-to-br from-emerald-200 via-emerald-100 to-blue-200 rounded-3xl shadow-2xl overflow-hidden aspect-[4/5] hover:shadow-emerald-500/20 transition-all duration-500 group-hover:scale-[1.02]">
                            {/* Background Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 z-10"></div>

                            {/* Image */}
                            <Image
                                src={WashingtonMountains}
                                alt="Washington State Mountains"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Animated Decorative Elements */}
                            <div className="absolute top-6 right-6 w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full animate-pulse border border-white/20"></div>
                            <div className="absolute bottom-8 left-8 w-16 h-16 bg-emerald-500/20 backdrop-blur-sm rounded-full animate-bounce border border-emerald-200/30" style={{animationDelay: '1s'}}></div>
                            <div className="absolute top-1/3 left-6 w-8 h-8 bg-blue-500/20 backdrop-blur-sm rounded-full animate-pulse border border-blue-200/30" style={{animationDelay: '0.5s'}}></div>
                        </div>

                        {/* Enhanced Floating Card */}
                        <div className="absolute -bottom-8 -left-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/50 hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 group">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                                    <MapPin className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800 text-lg">Challenge Yourself</div>
                                    <div className="text-slate-600">Guess the location!</div>
                                </div>
                            </div>
                            <div className="mt-3 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
                        </div>

                        {/* Additional Floating Element */}
                        <div className="absolute -top-4 -right-4 bg-gradient-to-br from-blue-500 to-emerald-500 w-20 h-20 rounded-2xl shadow-xl opacity-20 rotate-12 hover:rotate-45 transition-all duration-500"></div>
                    </div>
                </div>
            </main>

            {/* Enhanced Footer */}
            <footer className="relative mt-24 py-12 bg-gradient-to-r from-slate-50 to-emerald-50 border-t border-slate-200/50 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5"></div>
                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <p className="text-slate-600 text-lg font-medium">
                        Explore Washington State • Test Your Geography Skills • Have Fun!
                    </p>
                    <div className="mt-4 flex justify-center items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
