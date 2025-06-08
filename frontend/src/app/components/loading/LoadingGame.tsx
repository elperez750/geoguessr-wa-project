import {useGame} from "@/app/context/GameContext";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";


const washingtonFacts = [
    "Washington State is home to the only temperate rainforest in the continental United States.",
    "Mount Rainier is the tallest peak in Washington at 14,411 feet above sea level.",
    "Washington produces more apples than any other state in the US.",
    "The state is named after George Washington, the first President of the United States.",
    "Seattle is home to the first Starbucks coffee shop, opened in 1971.",
    "Washington has more than 3,000 miles of saltwater coastline.",
    "The Space Needle was built for the 1962 World's Fair in Seattle.",
    "Washington is the only state named after a US President.",
    "The Olympic Peninsula receives over 140 inches of rainfall annually.",
    "Microsoft and Amazon were both founded in Washington State.",
    "Washington has over 8,000 lakes and 40,000 miles of rivers and streams.",
    "The state flower is the coast rhododendron.",
    "Washington is home to three national parks: Olympic, Mount Rainier, and North Cascades.",
    "The Columbia River Gorge forms part of the border between Washington and Oregon.",
    "Washington produces about 60% of America's red raspberries.",
    "The San Juan Islands consist of over 170 islands and reefs.",
    "Washington's state motto is 'Al-ki,' meaning 'bye and bye' in Chinook.",
    "Pike Place Market in Seattle is one of the oldest continuously operated public farmers' markets.",
    "Washington is the leading producer of hydroelectric power in the United States.",
    "The Cascade Range divides Washington into distinct eastern and western regions."
];


export default function LoadingGame() {
    const {  gameStatus, startGame, gameInitialized } = useGame();
    const [currentFact, setCurrentFact] = useState("");
    const [fadeClass, setFadeClass] = useState("opacity-100");

    useEffect(() => {
        // Select a random fact when component mounts
        const randomFact = washingtonFacts[Math.floor(Math.random() * washingtonFacts.length)];
        setCurrentFact(randomFact);

        // Start the game
        if (!gameInitialized && gameStatus=== "idle") {
            startGame()

        }
    }, [gameInitialized, gameStatus, startGame]);



    useEffect(() => {
        // Change fact every 4 seconds with fade animation
        const factInterval = setInterval(() => {
            setFadeClass("opacity-0");
            setTimeout(() => {
                const randomFact = washingtonFacts[Math.floor(Math.random() * washingtonFacts.length)];
                setCurrentFact(randomFact);
                setFadeClass("opacity-100");
            }, 300);
        }, 4000);

        return () => clearInterval(factInterval);
    }, []);




    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-bounce"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 max-w-2xl mx-auto px-8 text-center">
                {/* Loading spinner */}
                <div className="mb-8">
                    <div className="relative">
                        <div className="w-20 h-20 mx-auto border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-transparent border-l-white/50 rounded-full animate-spin animate-reverse"></div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    Exploring Washington
                </h1>

                <p className="text-xl text-white/90 mb-12 font-light">
                    Preparing your geography adventure...
                </p>

                {/* Fact display */}
                <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/30">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Did you know?
                    </h3>
                    <p className={`text-white/95 text-lg leading-relaxed transition-opacity duration-300 ${fadeClass}`}>
                        {currentFact}
                    </p>
                </div>

                {/* Progress indicator */}
                <div className="mt-8">
                    <div className="flex justify-center space-x-2">
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}