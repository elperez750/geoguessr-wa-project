import {useEffect} from "react";

import { useGame } from "@/app/context/GameContext";
import { useRouter} from "next/navigation";



export default function LoadingRound() {
    const { isLoading, gameStatus, gameInitialized } = useGame();
    const router = useRouter();




    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-bounce"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center">
                {/* Loading spinner */}
                <div className="mb-6">
                    <div className="relative">
                        <div className="w-16 h-16 mx-auto border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-transparent border-l-white/50 rounded-full animate-spin animate-reverse"></div>
                    </div>
                </div>

                {/* Loading text */}
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                    Loading Next Round
                </h2>
                
                <p className="text-white/90 text-lg font-light">
                    Preparing your next location...
                </p>

                {/* Progress dots */}
                <div className="mt-6">
                    <div className="flex justify-center space-x-2">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}