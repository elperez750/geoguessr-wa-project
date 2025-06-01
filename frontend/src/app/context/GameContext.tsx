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
    gameStatus: "idle" | "loading" | "active" | "finished"
    isLoading: boolean
    guessCoords: Coordinate  | null
    roundDistanceOff: number | null
    guessLocation: string | null
    actualLocation: string | null


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
    setRoundDistanceOff: (distance: number | null) => void
    setGuessCoords: (coords: Coordinate | null) => void
    setActualLocation: (location: string | null) => void
    setGuessLocation: (location: string | null) => void
    // Actions
    startGame: () => Promise<void>
    submitGuess: (coords: Coordinate) => void
    nextRound: () => Promise<void>
    resetGame: () => void
}

// Creating the Game Context
const GameContext = createContext<GameContextType | undefined>(undefined)

// Create the GameProvider component
export const GameProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter()
    const [roundScore, setRoundScore] = useState<number>(0)
    const [roundNumber, setRoundNumber] = useState<number>(1)
    const [roundCoordinates, setRoundCoordinates] = useState<Coordinate | null>(null)
    const [totalScore, setTotalScore] = useState<number>(0)
    const [totalRounds, setTotalRounds] = useState<number>(5)
    const [guessCoords, setGuessCoords] = useState<Coordinate | null>(null);
    const [roundDistanceOff, setRoundDistanceOff] = useState<number | null>(null);
    const [panoId, setPanoId] = useState<string>("")
    const [gameId, setGameId] = useState<number | null>(null)
    const [userId, setUserId] = useState<number | null>(null)
    const [roundId, setRoundId] = useState<number | null>(null)
    const [gameStatus, setGameStatus] = useState<"idle" | "loading" | "active" | "finished">("idle")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [actualLocation, setActualLocation] = useState<string | null>(null)
    const [guessLocation, setGuessLocation] = useState<string | null>(null)

    //Function to start the game
    // We are getting the pano id, game id, round id, user id, current round, and total rounds
    // This just sets the following attributes for use in the map components
    const startGame = async () => {
        setIsLoading(true)
        setGameStatus("loading")

        try {
            const response = await api.post('game/start-game')
            const data = response.data
            console.log(data)
            setPanoId(data.current_pano_id)
            setGameId(data.game_id)
            setUserId(data.user_id)
            setRoundId(data.round_id)
            setRoundNumber(data.current_round)
            setTotalRounds(data.total_rounds || 5)
            setGameStatus("active")
            setActualLocation(data.current_string_location)


            toast.success("Game started!")

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.detail || "Failed to start game")
            } else {
                toast.error("Unknown error occurred")
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
            setRoundCoordinates({lat: gameResults.round_lat, lng: gameResults.round_lng})
            setGuessLocation(gameResults.guess_location_string)
            setRoundScore(gameResults.round_score)


            console.log(gameResults)

            router.push('/results')

        }
        catch(e) {
            console.error("Error submitting guess:", e)
        }

        // try {
        //     const response = await api.post('/round-results', {
        //         lat,
        //         lng,
        //         guess_number: roundNumber,
        //         game_id: gameId,
        //         round_id: roundId
        //     })
        //
        //     const results = response.data
        //     setRoundScore(results.score || 0)
        //     setTotalScore(prev => prev + (results.score || 0))
        //
        //     toast.success(`Round ${roundNumber} completed!`)
        //     return results
        //
        // } catch (error: any) {
        //     console.error("Error submitting guess:", error)
        //     toast.error(error.response?.data?.detail || "Failed to submit guess")
        //     return null
        // } finally {
        //     setIsLoading(false)
        // }
    }

    // We move to the round and get a new map
    const nextRound = async () => {
        if (roundNumber >= totalRounds) {
            setGameStatus("finished")
            toast.success("Game completed!")
            return
        }

        setIsLoading(true)

        try {
            // Call your next round endpoint
            const response = await api.get(`/next-round/${gameId}`)
            const data = response.data

            setPanoId(data.pano_id)
            setRoundId(data.round_id)
            setRoundNumber(prev => prev + 1)
            setRoundScore(0) // Reset round score

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.detail || "Failed to start game")
            } else {
                toast.error("Unknown error occurred")
            }
        }
        finally {
            setIsLoading(false)
        }
    }


    // This justs sets everything to its default, essentially reseting the game
    const resetGame = () => {
        setRoundScore(0)
        setRoundNumber(1)
        setTotalScore(0)
        setPanoId("")
        setGameId(null)
        setUserId(null)
        setRoundId(null)
        setGameStatus("idle")
        setIsLoading(false)
    }

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
        setRoundCoordinates,
        setRoundDistanceOff,
        setActualLocation,
        setGuessLocation,
        // Actions
        startGame,
        submitGuess,
        nextRound,
        resetGame
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