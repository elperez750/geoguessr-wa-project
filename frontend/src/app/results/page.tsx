"use client"

import { RoundResults } from "@/app/components/map/RoundResults";
import { useGame } from "@/app/context/GameContext";
import {GameResults} from "@/app/components/game/GameResults";


export default function ResultsPage() {
    const { roundNumber, roundScore } = useGame();

    return (
        <>
            {
                roundNumber > 5 ? <GameResults /> :  <RoundResults key={`results-${roundNumber}-${roundScore}`} />

            }

        </>

    );
}