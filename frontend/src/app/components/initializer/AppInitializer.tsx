"use client"

import { useGame } from "@/app/context/GameContext";
import { useAuth } from "@/app/context/AuthContext"; // Add this import
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppInitializer({ children }: { children: React.ReactNode }) {
    const { restoreGame, gameStatus, gameInitialized } = useGame();
    const { isAuthenticated, isLoading: authLoading } = useAuth(); // Add this
    const router = useRouter();
    const pathname = usePathname();
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initializeApp = async () => {
            console.log("🚀 Initializing app...");

            // Wait for auth to finish loading
            if (authLoading) {
                console.log("⏳ Waiting for auth to load...");
                return;
            }

            try {
                // Only try to restore game if user is authenticated
                if (isAuthenticated) {
                    console.log("✅ User is authenticated, trying to restore game...");

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
                } else {
                    console.log("❌ User not authenticated");

                    // If user is not authenticated and on protected pages, redirect to login/home
                    if (['/play', '/results', '/loading'].includes(pathname)) {
                        router.push('/login'); // or wherever your login page is
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
    }, [authLoading, isAuthenticated]); // Add authLoading and isAuthenticated as dependencies

    // Show loading screen while initializing or auth is loading
    if (isInitializing || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        {authLoading ? "Checking authentication..." : "Initializing..."}
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}