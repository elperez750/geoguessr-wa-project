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
    gameInitialized: boolean
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
    setGameInitialized: (initialized: boolean) => void
    setRoundDistanceOff: (distance: number | null) => void
    setGuessCoords: (coords: Coordinate | null) => void
    setActualLocation: (location: string | null) => void
    setGuessLocation: (location: string | null) => void
    // Actions
    startGame: () => Promise<void>
    submitGuess: (coords: Coordinate) => void
    nextRound: () => Promise<void>
    gameResults: () => void
    resetGame: () => void
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
            setGameInitialized(true)
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
            setGuessCoords(guessCoords)
            setRoundCoordinates({lat: gameResults.round_lat, lng: gameResults.round_lng})
            setGuessLocation(gameResults.guess_location_string)
            setActualLocation(gameResults.actual_location_string)
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

        try {
            // Call your next round endpoint
            const response = await api.post(`game/next-round`)
            const data = response.data
            console.log(data)

            setPanoId(data.current_pano_id)
            setRoundId(data.round_id)
            setRoundNumber(data.current_round)
            setRoundScore(0)


            setGuessCoords(null)
            setRoundDistanceOff(null)
            setActualLocation(null)
            setGuessLocation(null)
            setRoundCoordinates(null)

            router.push('/play')
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



    const gameResults = async() => {
        try {
            const response = await api.get('game/get-game-results')
            const data = response.data
            console.log(response)
            setTotalScore(data.total_score)

            router.push('/results')

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
    const resetGame = () => {
        try {
            api.post('game/reset-game')
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
        // Actions
        startGame,
        submitGuess,
        nextRound,
        resetGame,
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