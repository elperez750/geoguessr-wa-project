import { useRef, useEffect } from "react";
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import {Button} from "@/components/ui/button";

import { useGame} from "@/app/context/GameContext";
import GuessMapComponent from "@/app/components/map/GuessMapComponent";

const StreetViewComponent = () => {

    const streetViewLib = useMapsLibrary('streetView');


    const { startGame, isLoading, panoId, submitGuess, guessCoords, roundNumber, gameStatus, gameInitialized } = useGame();
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
        if (!gameInitialized && gameStatus === "idle") {
            console.log("Starting new game...");
            startGame();
        } else {
            console.log("Game already initialized, skipping startGame");
        }
    }, [gameInitialized, gameStatus, startGame]);


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
        <div className="relative w-screen h-[90vh]">
            {/* Round number display at the top */}
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white px-6 py-3 rounded-lg font-bold text-lg shadow-lg border-2 border-white">
                Round {roundNumber || 1}
            </div>

            {/* Street View container */}
            <div ref={streetViewRef} className="w-full h-full rounded-lg" />

            {/* MapComponent overlay in bottom-right corner */}
            <div className="absolute bottom-4 left-4 z-20 flex flex-col items-center">
                <div className="w-[300px] h-[200px] rounded-lg overflow-hidden shadow-lg">
                    <GuessMapComponent />
                </div>
                <div className="mt-2">
                    <Button className={'w-[300px] cursor-pointer'} onClick={handleGuessSubmit} disabled={isLoading}>Guess</Button>
                </div>
            </div>
        </div>
    );


}

export default StreetViewComponent;



