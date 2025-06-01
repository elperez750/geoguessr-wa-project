import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { MapPin, Target} from "lucide-react"
import { useGame } from "@/app/context/GameContext";
export const LocationDetails = () => {
    const { roundDistanceOff, actualLocation, guessLocation } = useGame()
    return(
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Location Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <div className="font-medium text-green-700">Actual Location</div>
                            <div className="text-sm text-gray-600">{actualLocation}</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                        <div>
                            <div className="font-medium text-red-700">Your Guess</div>
                            <div className="text-sm text-gray-600">{guessLocation}</div>
                        </div>
                    </div>
                    <div className="pt-2 border-t">
                        <div className="text-sm text-gray-600">Distance</div>
                        <div className="font-bold text-lg">{roundDistanceOff?.toFixed(2)} km</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}