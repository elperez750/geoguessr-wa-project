import {RoundResultsHeader} from "@/app/components/map/RoundResultsHeader";
import {ScoreDisplay} from "@/app/components/map/ScoreDisplay";
import {LocationDetails} from "@/app/components/map/LocationDetails";
import {useGame} from "@/app/context/GameContext";
import ResultMapComponent from "@/app/components/map/ResultMapComponent";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export const RoundResults = () => {
    const {roundCoordinates, roundDistanceOff, guessCoords, nextRound, roundNumber, gameResults, isLoading} = useGame()
    const router = useRouter();

    const goToNextRound = () => {
        router.push("/loading")
    }

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 pt-20">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-160px)]">

                    {/* Left Side - Results Info */}
                    <div className="space-y-6 flex flex-col">
                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
                            <RoundResultsHeader/>
                        </div>

                        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
                            <ScoreDisplay/>
                        </div>

                        <div
                            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 flex-1">
                            <LocationDetails/>
                        </div>

                        <div className="mt-auto">
                            {
                                roundNumber < 5 ? (
                                    <Button
                                        onClick={goToNextRound}
                                        className="w-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-700 hover:from-emerald-700 hover:via-emerald-800 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer text-lg"
                                    >
                                        Next Round
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={gameResults}
                                        className="w-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-700 hover:from-emerald-700 hover:via-emerald-800 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer text-lg"
                                    >
                                        Game Results
                                    </Button>
                                )
                            }
                        </div>
                    </div>

                    {/* Right Side - Map */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
                        <div className="h-full w-full rounded-xl overflow-hidden">
                            {
                                roundDistanceOff && roundCoordinates && guessCoords && (
                                    <ResultMapComponent actualLocation={roundCoordinates} guessLocation={guessCoords}/>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )

}