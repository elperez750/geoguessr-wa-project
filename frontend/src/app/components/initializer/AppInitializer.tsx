"use client"

import { useGame } from "@/app/context/GameContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppInitializer({ children }: { children: React.ReactNode }) {
    const { restoreGame, gameStatus, gameInitialized } = useGame();
    const router = useRouter();
    const pathname = usePathname();
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initializeApp = async () => {
            console.log("🚀 Initializing app...");

            try {
                // Try to restore game state
                const gameRestored = await restoreGame();

                if (gameRestored) {
                    console.log("✅ Game restored, redirecting to play page");

                    // If we're not already on the play page and game is active, redirect
                    if (pathname !== '/play' && pathname !== '/results') {
                        router.push('/play');
                    }
                } else {
                    console.log("❌ No active game found");

                    // If we're on a game page but no active game, redirect to home
                    if (['/play', '/results', '/loading'].includes(pathname)) {
                        router.push('/');
                    }
                }
            } catch (error) {
                console.error("Error initializing app:", error);

                // On error, redirect to home if on a game page
                if (['/play', '/results', '/loading'].includes(pathname)) {
                    router.push('/');
                }
            } finally {
                setIsInitializing(false);
            }
        };

        initializeApp();
    }, []); // Only run once on app load

    // Show loading screen while initializing
    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Initializing...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}