import {RoundResultsHeader} from "@/app/components/map/RoundResultsHeader";
import {ScoreDisplay} from "@/app/components/map/ScoreDisplay";
import {LocationDetails} from "@/app/components/map/LocationDetails";
import {GuessComparisonMap} from "@/app/components/map/GuessComparisonMap";
export const RoundResults = () => {


    return (
        <div className={"flex flex-col gap-6"} style={{height: "100vh"}}>

            <RoundResultsHeader />
            <GuessComparisonMap/>

            <ScoreDisplay />
            <LocationDetails />
        </div>


    //     <GuessComparisonMap />
    //     <ScoreDisplay />
    // <LocationDetails />
    // <RoundNavigation/>

    )
}