import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, Target } from "lucide-react";

export const GuessComparisonMap = () => {
    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2">
                <Card className="h-[500px]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Your Guess vs Actual Location
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-full p-0">
                        <div className="relative w-full h-[400px] bg-gradient-to-br from-green-200 via-blue-200 to-blue-300 rounded-lg overflow-hidden">
                            {/* Simulated map background */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="w-full h-full bg-[url('/placeholder.svg?height=400&width=600')] bg-cover bg-center"></div>
                            </div>

                            {/* Actual location marker */}
                            <div className="absolute top-[30%] left-[45%] transform -translate-x-1/2 -translate-y-1/2">
                                <div className="relative">
                                    <Target className="h-8 w-8 text-green-600 drop-shadow-lg" />
                                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                                        Actual Location
                                    </div>
                                </div>
                            </div>

                            {/* Guess location marker */}
                            <div className="absolute top-[60%] left-[65%] transform -translate-x-1/2 -translate-y-1/2">
                                <div className="relative">
                                    <MapPin className="h-8 w-8 text-red-600 drop-shadow-lg" />
                                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                                        Your Guess
                                    </div>
                                </div>
                            </div>

                            {/* Distance line */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                <line
                                    x1="45%"
                                    y1="30%"
                                    x2="65%"
                                    y2="60%"
                                    stroke="#374151"
                                    strokeWidth="2"
                                    strokeDasharray="5,5"
                                    className="drop-shadow-sm"
                                />
                            </svg>

                            {/* Distance label */}
                            <div className="absolute top-[45%] left-[55%] transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-full shadow-lg border">
                                <span className="text-sm font-semibold text-gray-700">5000 km</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}