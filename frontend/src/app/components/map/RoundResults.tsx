import {RoundResultsHeader} from "@/app/components/map/RoundResultsHeader";
import {ScoreDisplay} from "@/app/components/map/ScoreDisplay";
import {LocationDetails} from "@/app/components/map/LocationDetails";
import {useGame} from "@/app/context/GameContext";
import ResultMapComponent from "@/app/components/map/ResultMapComponent";
export const RoundResults = () => {
    const {roundCoordinates, roundDistanceOff, guessCoords} = useGame()

    return (
        <div className={"flex flex-col gap-6"} style={{height: "100vh"}}>

            <RoundResultsHeader />
            {
                roundDistanceOff && roundCoordinates && guessCoords && (
                    <ResultMapComponent actualLocation={roundCoordinates} guessLocation={guessCoords} />


                )

            }<ScoreDisplay />
            <LocationDetails />
        </div>





    //     <GuessComparisonMap />
    //     <ScoreDisplay />
    // <LocationDetails />
    // <RoundNavigation/>

    )
}