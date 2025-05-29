import { useGame } from "@/app/context/GameContext";

export const RoundResultsHeader = () => {

    const { roundNumber } = useGame()
    return (
        <div>
            {roundNumber}
        </div>
    )
}