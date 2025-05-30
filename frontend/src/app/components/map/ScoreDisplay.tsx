import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card";

export const ScoreDisplay = () => {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Your Score</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <div className={`text-4xl font-bold}`}>500</div>
                    <div className="text-sm text-gray-600">out of 1000 points</div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-1000"
                        ></div>
                    </div>
                    <div className="text-sm font-medium">50% Accuracy</div>
                </CardContent>
            </Card>


        </div>
    )
}