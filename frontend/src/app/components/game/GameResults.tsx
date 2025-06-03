import { Button } from "@/components/ui/button";
import { useGame } from "@/app/context/GameContext";
import { useRouter } from "next/navigation";

export const GameResults = () => {
    const {
        totalScore,
        resetGame,
        // Mock data for demonstration - replace with actual round data from your context
        gameId
    } = useGame();

    const router = useRouter();

    // Mock round data - you'll need to replace this with actual data from your context or API
    const roundDetails = [
        {
            roundNumber: 1,
            score: 4850,
            distance: 12.3,
            actualLocation: "Paris, France",
            guessLocation: "Lyon, France"
        },
        {
            roundNumber: 2,
            score: 3200,
            distance: 89.5,
            actualLocation: "Tokyo, Japan",
            guessLocation: "Osaka, Japan"
        },
        {
            roundNumber: 3,
            score: 4950,
            distance: 2.1,
            actualLocation: "New York, USA",
            guessLocation: "Brooklyn, USA"
        },
        {
            roundNumber: 4,
            score: 4100,
            distance: 45.8,
            actualLocation: "Sydney, Australia",
            guessLocation: "Melbourne, Australia"
        },
        {
            roundNumber: 5,
            score: 2850,
            distance: 156.7,
            actualLocation: "São Paulo, Brazil",
            guessLocation: "Rio de Janeiro, Brazil"
        }
    ];

    const handlePlayAgain = () => {
        resetGame();
        router.push('/play');
    };

    const handleBackToMenu = () => {
        resetGame();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        GAME COMPLETE
                    </h1>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <p className="text-lg text-gray-600 mb-2">Total Score</p>
                        <p className="text-5xl font-bold text-blue-600">
                            {totalScore?.toLocaleString() || '23,450'}
                        </p>
                    </div>
                </div>

                {/* Round Details Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Round Details</h2>
                    <div className="space-y-6">
                        {roundDetails.map((round) => (
                            <div key={round.roundNumber} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Round {round.roundNumber}
                                    </h3>
                                    <div className="text-right">
                                        <span className="text-lg font-bold text-blue-600">
                                            {round.score.toLocaleString()}
                                        </span>
                                        <span className="text-gray-500 ml-2">
                                            • {round.distance} km
                                        </span>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>
                                        <span className="font-medium text-green-600">Actual:</span> {round.actualLocation}
                                    </p>
                                    <p>
                                        <span className="font-medium text-red-600">Your Guess:</span> {round.guessLocation}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={handlePlayAgain}
                        className="cursor-pointer px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                        Play Again
                    </Button>
                    <Button
                        onClick={handleBackToMenu}
                        variant="outline"
                        className="px-8 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors"
                    >
                        Back to Menu
                    </Button>
                </div>
            </div>
        </div>
    );
};