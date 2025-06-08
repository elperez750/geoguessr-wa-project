"use client"

import { useGame } from "@/app/context/GameContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingRound from "@/app/components/loading/LoadingRound";
import LoadingGame from "@/app/components/loading/LoadingGame";

export default function LoadingPage() {
    const { gameInitialized, roundNumber, gameStatus, isLoading } = useGame();
    const router = useRouter();

    // Centralized navigation logic
    useEffect(() => {
        if (!isLoading && gameStatus === "active" && gameInitialized) {
            console.log(`🚀 Loading complete - navigating to play (Round ${roundNumber})`);
            router.push('/play');
        }
    }, [isLoading, gameStatus, gameInitialized, router, roundNumber]);

    // Determine which loading component to show
    const shouldShowRoundLoading = () => {
        // Show round loading ONLY when:
        // 1. Game is already initialized AND
        // 2. We're currently loading (transitioning between rounds) AND
        // 3. We're past round 1
        return gameInitialized && isLoading && roundNumber > 1;
    };

    // Debug logging
    console.log("🔍 Centralized Loading Page State:", {
        gameInitialized,
        roundNumber,
        gameStatus,
        isLoading,
        showingRoundLoading: shouldShowRoundLoading()
    });

    return (
        <>
            {shouldShowRoundLoading() ? (
                <LoadingRound />
            ) : (
                <LoadingGame />
            )}
        </>
    );
}