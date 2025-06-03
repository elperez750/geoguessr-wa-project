import {RoundResultsHeader} from "@/app/components/map/RoundResultsHeader";
import {ScoreDisplay} from "@/app/components/map/ScoreDisplay";
import {LocationDetails} from "@/app/components/map/LocationDetails";
import {useGame} from "@/app/context/GameContext";
import ResultMapComponent from "@/app/components/map/ResultMapComponent";
import { Button } from "@/components/ui/button";
export const RoundResults = () => {
    const {roundCoordinates, roundDistanceOff, guessCoords, nextRound, roundNumber, gameResults} = useGame()

    return (
        <div className={"flex flex-col gap-6"} style={{height: "100vh"}}>

            <RoundResultsHeader />

            {
                roundDistanceOff && roundCoordinates && guessCoords && (
                    <ResultMapComponent actualLocation={roundCoordinates} guessLocation={guessCoords} />

                )

            }<ScoreDisplay />
            <LocationDetails />
            {
                roundNumber < 5 ? (
        <Button onClick={nextRound} className={"cursor-pointer"}>
            Next Round
        </Button>
    ) : (
        <Button onClick={gameResults} className={"cursor-pointer"}>
            Game Results
        </Button>
    )
}

        </div>





    //     <GuessComparisonMap />
    //     <ScoreDisplay />
    // <LocationDetails />
    // <RoundNavigation/>

    )
}