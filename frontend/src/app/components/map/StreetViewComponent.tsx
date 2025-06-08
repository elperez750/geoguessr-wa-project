import { useRef, useEffect } from "react";
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Button } from "@/components/ui/button";
import { MapPin, Target, Crosshair } from "lucide-react";
import { useGame } from "@/app/context/GameContext";
import GuessMapComponent from "@/app/components/map/GuessMapComponent";
import { useRouter } from "next/navigation";
const StreetViewComponent = () => {
    const router = useRouter();
    const streetViewLib = useMapsLibrary('streetView');


    const { startGame, isLoading, panoId, submitGuess, guessCoords, gameStatus, gameInitialized } = useGame();
    const streetViewRef = useRef<HTMLDivElement | null>(null);
    const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

    const handleGuessSubmit = async () => {
        if (!guessCoords) {
            alert("Please make a guess on the map first!");
            return;
        }

        try {
            const results = await submitGuess(guessCoords);
            if (results) {
                // Handle successful guess submission
                console.log("Guess results:", results);
                // You might want to show results or navigate to results page
            }
        } catch (error) {
            console.error("Error submitting guess:", error);
        }
    };





    useEffect(() => {
        if (!streetViewLib || !streetViewRef.current || !panoId) return;

        if (!panoramaRef.current) {
            panoramaRef.current = new streetViewLib.StreetViewPanorama(streetViewRef.current, {
                pano: panoId,
                pov: {heading: 100, pitch: 0},
                visible: true,
                addressControl: false,
                showRoadLabels: false,
            });

        }
        else{
            panoramaRef.current.setPano(panoId)
        }
    },[streetViewLib, panoId]);




    return (
        <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
            {/* Street View container with modern overlay */}
            <div className="relative w-full h-full">
                <div ref={streetViewRef} className="w-full h-full" />
                
                {/* Modern overlay with glass morphism */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Top gradient overlay */}
                    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/30 to-transparent"></div>
                    
                    {/* Bottom gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/40 to-transparent"></div>
                    
                    {/* Crosshair in center */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="relative">
                            <Crosshair className="w-8 h-8 text-white/70 drop-shadow-lg" strokeWidth={1.5} />
                            <div className="absolute inset-0 w-8 h-8 border border-white/30 rounded-full animate-ping"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced map overlay in bottom-left */}
            <div className="absolute bottom-6 left-6 z-20 pointer-events-auto">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 hover:shadow-emerald-500/20 transition-all duration-300">
                    {/* Map header - Properly positioned to avoid navbar */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                            <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-800 text-sm leading-tight">Make Your Guess</h3>
                            <p className="text-xs text-slate-600 leading-tight">Click on the map to place your guess</p>
                        </div>
                    </div>
                    
                    {/* Map container */}
                    <div className="w-[320px] h-[220px] rounded-xl overflow-hidden shadow-lg border border-slate-200/50">
                        <GuessMapComponent />
                    </div>
                    
                    {/* Guess button */}
                    <div className="mt-4">
                        <Button 
                            className="cursor-pointer w-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-700 hover:from-emerald-700 hover:via-emerald-800 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 group"
                            onClick={handleGuessSubmit} 
                            disabled={isLoading || !guessCoords}
                        >
                            <Target className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                            {isLoading ? "Submitting..." : "Submit Guess"}
                        </Button>
                    </div>
                    
                    {/* Status indicator */}
                    <div className="mt-3 flex items-center justify-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${guessCoords ? 'bg-emerald-500' : 'bg-slate-400'} transition-colors duration-200`}></div>
                        <span className="text-xs text-slate-600 font-medium">
                            {guessCoords ? "Guess placed" : "Place a guess on the map"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Modern UI elements */}
            <div className="absolute top-6 right-6 z-20 pointer-events-auto">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-white font-medium text-sm drop-shadow-lg">Exploring Washington</span>
                    </div>
                </div>
            </div>
        </div>
    );


}

export default StreetViewComponent;



