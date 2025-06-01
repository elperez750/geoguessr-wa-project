import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useGame } from "@/app/context/GameContext";

export const ScoreDisplay = () => {
    const { roundScore, distance } = useGame(); // Assuming distance is also available in context

    // Calculate percentage out of max score (5000)
    const maxScore = 5000;
    const scorePercentage = Math.max(0, Math.min((roundScore / maxScore) * 100, 100));

    // Calculate distance-based accuracy (how close to perfect distance)
    // Perfect = 0km, Worst = 10,000km (based on your scoring formula)
    const maxDistance = 10000; // km
    const distanceAccuracy = Math.max(0, Math.round((1 - (distance || 0) / maxDistance) * 100));

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="text-center text-xl">Your Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
                {/* Main Score Display */}
                <div>
                    <div className="text-4xl font-bold text-blue-600">
                        {roundScore?.toLocaleString() || 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                        out of {maxScore.toLocaleString()} points
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-500">{scorePercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-yellow-400 via-orange-500 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${scorePercentage}%` }}
                        >
                            {/* Subtle shine effect */}
                            <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Distance and Accuracy Display */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                    <div>
                        <div className="text-lg font-semibold text-gray-800">
                            {distanceAccuracy}%
                        </div>
                        <div className="text-xs text-gray-500">
                            Distance Accuracy
                        </div>
                    </div>
                    {distance !== undefined && (
                        <div>
                            <div className="text-lg font-semibold text-gray-800">
                                {distance.toFixed(1)} km
                            </div>
                            <div className="text-xs text-gray-500">
                                Distance Away
                            </div>
                        </div>
                    )}
                </div>

                {/* Score Rating based on actual scoring algorithm */}
                <div className="text-sm">
                    <span className={`inline-block px-3 py-1 rounded-full text-white font-medium ${
                        roundScore >= 4500 ? 'bg-green-500' :    // < 500km away
                            roundScore >= 3500 ? 'bg-blue-500' :     // < 1500km away  
                                roundScore >= 2000 ? 'bg-yellow-500' :   // < 3000km away
                                    roundScore >= 500 ? 'bg-orange-500' :    // < 4500km away
                                        'bg-red-500'                             // > 4500km away or negative
                    }`}>
                        {roundScore >= 4500 ? 'Amazing!' :
                            roundScore >= 3500 ? 'Excellent! ' :
                                roundScore >= 2000 ? 'Good!' :
                                    roundScore >= 500 ? 'Fair' :
                                        roundScore >= 0 ? 'Keep Trying!' : 'Oops!'}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};