import { useGame } from "@/app/context/GameContext";

export const RoundResultsHeader = () => {

    const { roundNumber } = useGame()
    return (
        <div className="text-center text-2xl font-bold">
            Round {roundNumber} results
            <h2>See how close your guess was!</h2>
        </div>
    )
}