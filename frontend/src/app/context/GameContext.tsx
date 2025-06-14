"use client"

import React, { createContext, useContext, useState,  ReactNode } from "react"
import api from "@/app/api"
import { toast } from "sonner"
import {useRouter} from "next/navigation";
import axios from "axios"



type Coordinate = {
    lat: number
    lng: number
}

// Define the GameContext type
type GameContextType = {
    panoId: string
    gameId: number | null
    userId: number | null
    roundId: number | null
    roundNumber: number
    roundScore: number
    roundCoordinates: Coordinate | null
    totalScore: number
    totalRounds: number
    totalDistance: number
    gameStatus: "idle" | "loading" | "active" | "finished"
    gameInitialized: boolean
    isLoading: boolean
    guessCoords: Coordinate  | null
    roundDistanceOff: number | null
    guessLocation: string | null
    actualLocation: string | null
    allLocations: string[]
    allScores: number[]
    allDistances: number[]
    averageDistance: number

    // Setters
    setRoundNumber: (round: number) => void
    setRoundScore: (score: number) => void
    setPanoId: (panoId: string) => void
    setGameId: (gameId: number | null) => void
    setUserId: (userId: number | null) => void
    setRoundId: (roundId: number | null) => void
    setTotalScore: (score: number) => void
    setRoundCoordinates: (coords: Coordinate | null) => void
    setGameStatus: (status: "idle" | "loading" | "active" | "finished") => void
    setGameInitialized: (initialized: boolean) => void
    setRoundDistanceOff: (distance: number | null) => void
    setGuessCoords: (coords: Coordinate | null) => void
    setActualLocation: (location: string | null) => void
    setGuessLocation: (location: string | null) => void
    setAllScores: (scores: number[]) => void
    setAllLocations: (locations: string[]) => void
    setAllDistances: (distances: number[]) => void
    setTotalDistance: (distance: number) => void
    setAverageDistance: (distance: number) => void

    // Actions
    startGame: () => Promise<void>
    submitGuess: (coords: Coordinate) => void
    nextRound: () => Promise<void>
    gameResults: () => void
    resetGame: () => void
    restoreGame: () => Promise<boolean>
}

// Creating the Game Context
const GameContext = createContext<GameContextType | undefined>(undefined)

// Create the GameProvider component
export const GameProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter()
    // Define default values
    const defaultValues = {
        roundScore: 0,
        roundNumber: 1,
        roundCoordinates: null,
        totalScore: 0,
        totalRounds: 5,
        guessCoords: null,
        roundDistanceOff: null,
        panoId: "",
        gameId: null,
        userId: null,
        roundId: null,
        gameStatus: "idle" as const,
        isLoading: false,
        actualLocation: null,
        guessLocation: null,
        gameInitialized: false
    }

    // State variables
    const [roundScore, setRoundScore] = useState<number>(defaultValues.roundScore)
    const [roundNumber, setRoundNumber] = useState<number>(defaultValues.roundNumber)
    const [roundCoordinates, setRoundCoordinates] = useState<Coordinate | null>(defaultValues.roundCoordinates)
    const [totalScore, setTotalScore] = useState<number>(defaultValues.totalScore)
    const [totalRounds, setTotalRounds] = useState<number>(defaultValues.totalRounds)
    const [guessCoords, setGuessCoords] = useState<Coordinate | null>(defaultValues.guessCoords);
    const [roundDistanceOff, setRoundDistanceOff] = useState<number | null>(defaultValues.roundDistanceOff);
    const [panoId, setPanoId] = useState<string>(defaultValues.panoId)
    const [gameId, setGameId] = useState<number | null>(defaultValues.gameId)
    const [userId, setUserId] = useState<number | null>(defaultValues.userId)
    const [roundId, setRoundId] = useState<number | null>(defaultValues.roundId)
    const [gameStatus, setGameStatus] = useState<"idle" | "loading" | "active" | "finished">(defaultValues.gameStatus)
    const [isLoading, setIsLoading] = useState<boolean>(defaultValues.isLoading)
    const [actualLocation, setActualLocation] = useState<string | null>(defaultValues.actualLocation)
    const [guessLocation, setGuessLocation] = useState<string | null>(defaultValues.guessLocation)
    const [gameInitialized, setGameInitialized] = useState<boolean>(defaultValues.gameInitialized)
    const [allScores, setAllScores] = useState<number[]>([])
    const [allDistances, setAllDistances] = useState<number[]>([])
    const [averageDistance, setAverageDistance] = useState<number>(0)
    const [allLocations, setAllLocations] = useState<string[]>([])
    const [totalDistance, setTotalDistance] = useState<number>(0)
    //Function to start the game
    // We are getting the pano id, game id, round id, user id, current round, and total rounds
    // This just sets the following attributes for use in the map components
    const startGame = async () => {
        setIsLoading(true)
        setGameStatus("loading")
        
        // Only navigate to loading if we're not already there



        try {
            const response = await api.post('game/start-game')
            const data = response.data
            console.log(data)
            setPanoId(data.all_pano_ids[0])
            setGameId(data.game_id)
            setUserId(data.user_id)
            setRoundId(data.round_id)
            setRoundNumber(data.current_round)
            setTotalRounds(data.total_rounds || 5)
            setRoundCoordinates({lat: data.game_lats[0], lng: data.game_lngs[0]})
            setActualLocation(data.all_actual_string_locations[0])
            setGameInitialized(true)
            setGameStatus("active")

            toast.success("Game started!")

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.detail || "Failed to start game")
                setGameStatus("idle")
            } else {
                toast.error("Unknown error occurred")
                setGameStatus("idle")
            }
        }
        finally {
            setIsLoading(false)
        }
    }



    //This is where we send our guess coordinates to the backend
    //we will get the actual coordinates back and calculate the total distance away

    const submitGuess = async (guessCoords: Coordinate) => {
        if (!gameId || !roundId) {
            toast.error("No active game found")
            return null
        }

        setIsLoading(true)
        console.log("This is the guess", guessCoords)


        try {
            const response = await api.get('game/get-round-results', {
                params: {
                lat: guessCoords.lat,
                lng: guessCoords.lng,

            }
            })
            const gameResults = response.data

            setRoundDistanceOff(gameResults.distance_off)
            setGuessCoords(guessCoords)
            setGuessLocation(gameResults.guess_location_string)
            setRoundScore(gameResults.round_score)


            console.log(gameResults)

            router.push('/results')
            setIsLoading(false)

        }
        catch(e) {
            console.error("Error submitting guess:", e)
        }

    }

    // We move to the round and get a new map
    const nextRound = async () => {
        // Check if we have a game id
        // We will generate a new round
        // We will get a new pano id and increment the round number

        if (roundNumber >= totalRounds) {
            setGameStatus("finished")
            toast.success("Game completed!")
            return
        }


        setIsLoading(true)
        setGameStatus("loading")

        try {
            // Call your next round endpoint
            const response = await api.post(`game/next-round`)
            const data = response.data
            console.log(data)
            const curr = data.current_round - 1

            setPanoId(data.all_pano_ids[curr])
            setRoundId(data.round_id)
            setRoundNumber(data.current_round)
            setRoundScore(0)
            setGuessCoords(null)
            setRoundCoordinates({lat: data.game_lats[curr], lng: data.game_lngs[curr]})
            setActualLocation(data.all_actual_string_locations[curr])
            setGameStatus("active")
            toast.success("Next round loaded!")

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.detail || "Failed to load next round")
            } else {
                toast.error("Unknown error occurred")
            }
        }
        finally {
            setIsLoading(false)
        }
    }



    const gameResults = async() => {
        try {
            const gameStats = await api.get('game/get-game-results')
            console.log(gameStats)
            const data = gameStats.data
            setTotalScore(data.total_score)
            setTotalDistance(data.total_distance)
            setAllScores(data.all_scores)
            setAllDistances(data.all_distances)
            setAverageDistance(data.average_distance)
            setAllLocations(data.all_locations)


            router.push('/game-results')

        }
        catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.detail || "Failed to start game")
            } else {
                toast.error("Unknown error occurred")
            }
        }
    }



    // Reset game to default values
    const resetGame = async() => {
        try {
            await api.post('game/reset-game')
            setRoundScore(defaultValues.roundScore)
            setRoundNumber(defaultValues.roundNumber)
            setTotalScore(defaultValues.totalScore)
            setPanoId(defaultValues.panoId)
            setGameId(defaultValues.gameId)
            setUserId(defaultValues.userId)
            setRoundId(defaultValues.roundId)
            setGameStatus(defaultValues.gameStatus)
            setIsLoading(defaultValues.isLoading)
            setGuessCoords(defaultValues.guessCoords)
            setRoundDistanceOff(defaultValues.roundDistanceOff)
            setGuessLocation(defaultValues.guessLocation)
            setActualLocation(defaultValues.actualLocation)
            setRoundCoordinates(defaultValues.roundCoordinates)
            setGameInitialized(defaultValues.gameInitialized)
            setTotalRounds(defaultValues.totalRounds)

        }
        catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.detail || "Failed to start game")
            } else {
                toast.error("Unknown error occurred")
            }
        }


    }


    const restoreGame = async () => {
        console.log("🔄 Attempting to restore game state...");
        setIsLoading(true);
        setGameStatus("loading");

        try {
            // Check if there's an active game session on the backend
            const response = await api.get('game/get-current-game');
            const data = response.data;

            console.log("Backend response:", data);

            if (data.has_active_game) {
                console.log("✅ Active game found, restoring state...");

                // Restore all game state from backend
                setPanoId(data.current_pano_id || "");
                setGameId(data.game_id);
                setUserId(data.user_id);
                setRoundId(data.round_id);
                setRoundNumber(data.current_round || 1);
                setTotalRounds(data.total_rounds || 5);

                // Set coordinates if available
                if (data.current_lat && data.current_lng) {
                    setRoundCoordinates({
                        lat: data.current_lat,
                        lng: data.current_lng
                    });
                }

                setActualLocation(data.current_location || "");
                setTotalScore(data.total_score || 0);
                setTotalDistance(data.total_distance || 0);

                // Mark game as initialized and active
                setGameInitialized(true);
                setGameStatus("active");

                // Reset round-specific state (since we don't know if user was mid-guess)
                setRoundScore(0);
                setGuessCoords(null);
                setRoundDistanceOff(null);
                setGuessLocation(null);

                console.log(`✅ Game restored successfully - Round ${data.current_round}`);
                toast.success(`Game restored! You're on round ${data.current_round}`);

                return true; // Game was successfully restored

            } else {
                console.log("❌ No active game found on backend");

                // Reset to default state
                resetGame();

                return false; // No game to restore
            }

        } catch (error) {
            console.error("❌ Error restoring game:", error);

            // Reset to safe defaults
            resetGame();

            if (axios.isAxiosError(error)) {
                // Handle authentication errors specifically
                if (error.response?.status === 401) {
                    console.log("🔐 User not authenticated - no game to restore");
                    // Don't show error toast for auth issues
                    return false;
                }
                // Don't show error toast for 404 - these are expected when no game exists
                else if (error.response?.status !== 404) {
                    toast.error("Failed to restore game session");
                }
            } else {
                toast.error("Error connecting to game server");
            }

            return false;

        } finally {
            setIsLoading(false);
        }
    };





    const value: GameContextType = {
        panoId,
        gameId,
        userId,
        roundId,
        roundNumber,
        roundScore,
        totalScore,
        totalRounds,
        gameStatus,
        isLoading,
        guessCoords,
        roundCoordinates,
        roundDistanceOff,
        guessLocation,
        actualLocation,
        gameInitialized,
        allDistances,
        allScores,
        allLocations,
        averageDistance,
        totalDistance,

        // Setters
        setRoundNumber,
        setRoundScore,
        setPanoId,
        setGameId,
        setUserId,
        setRoundId,
        setTotalScore,
        setGameStatus,
        setGuessCoords,
        setGameInitialized,
        setRoundCoordinates,
        setRoundDistanceOff,
        setActualLocation,
        setGuessLocation,
        setAllDistances,
        setAllScores,
        setAverageDistance,
        setAllLocations,
        setTotalDistance,
        // Actions
        startGame,
        submitGuess,
        nextRound,
        resetGame,
        restoreGame,
        gameResults
    }

    return (
        <GameContext.Provider value ={value}>
            {children}
        </GameContext.Provider>
    )
}

// Custom hook to use the game context
export const useGame = () => {
    const context = useContext(GameContext)
    if (context === undefined) {
        throw new Error("useGame must be used within a GameProvider")
    }
    return context
}