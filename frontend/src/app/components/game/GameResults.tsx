"use client"

import { useGame } from "@/app/context/GameContext";
import { useRouter } from "next/navigation";
import { Home, RotateCcw, Trophy, MapPin, Target, Zap } from "lucide-react";

export const GameResults = () => {
  const { 
    totalScore,
    allScores = [],
    allDistances = [],
    allLocations = [],
    resetGame
  } = useGame();
  
  const router = useRouter();

  // Calculate average distance with proper rounding
  const averageDistance = allDistances.length > 0 
    ? (allDistances.reduce((sum, distance) => sum + distance, 0) / allDistances.length).toFixed(2)
    : "0.00";

  // Generate round details using for loop
  const roundDetails = [];
  for (let i = 0; i < allScores.length; i++) {
    roundDetails.push({
      round: i + 1,
      score: allScores[i],
      distance: Number(allDistances[i]).toFixed(2), // Round to 2 decimal places
      location: allLocations[i]
    });
  }

  const handlePlayAgain = () => {
    resetGame();
    router.push("/play");
  };

  const handleGoHome = () => {
    resetGame();
    router.push("/");
  };

  // Calculate performance rating
  const getPerformanceRating = (score: number) => {
    if (score >= 1000) return { text: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50" };
    if (score >= 750) return { text: "Great", color: "text-green-600", bg: "bg-green-50" };
    if (score >= 500) return { text: "Good", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { text: "Try Again", color: "text-orange-600", bg: "bg-orange-50" };
  };

  const overallRating = getPerformanceRating(totalScore / roundDetails.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <div className="max-w-5xl mx-auto px-4 py-8 mt-20">
        
        {/* Header with Hero Section */}
        <div className="text-center mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 blur-3xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                Game Complete!
              </h1>
              <p className="text-lg text-slate-600 mb-6">
                You have explored {roundDetails.length} amazing locations across Washington State
              </p>
              
              {/* Performance Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${overallRating.bg} ${overallRating.color} font-semibold`}>
                <Zap className="w-4 h-4" />
                {overallRating.text} Performance
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Total Score */}
          <div className="group hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium mb-1">Total Score</p>
                  <p className="text-3xl font-bold">{totalScore.toLocaleString()}</p>
                  <p className="text-emerald-200 text-sm">points earned</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Average Distance */}
          <div className="group hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm font-medium mb-1">Average Distance</p>
                  <p className="text-3xl font-bold">{averageDistance}</p>
                  <p className="text-teal-200 text-sm">miles off target</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <Target className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Round Details */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600" />
            Round Breakdown
          </h2>
          
          <div className="space-y-4">
            {roundDetails.map((round) => {
              const rating = getPerformanceRating(round.score);
              return (
                <div key={round.round} className="group hover:scale-[1.02] transition-all duration-200">
                  <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg border border-slate-200 relative overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    
                    <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Round Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                          <span className="text-white font-bold">{round.round}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-slate-800 mb-1">Round {round.round}</h3>
                          <p className="text-slate-600 flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{round.location}</span>
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-col sm:flex-row gap-4 lg:gap-8">
                        <div className="text-center lg:text-right">
                          <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Score</p>
                          <p className="text-2xl font-bold text-emerald-600">{round.score.toLocaleString()}</p>
                        </div>
                        <div className="text-center lg:text-right">
                          <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide">Distance off</p>
                          <p className="text-2xl font-bold text-teal-600">{round.distance} mi</p>
                        </div>
                        <div className="text-center lg:text-right">
                          <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${rating.bg} ${rating.color}`}>
                            {rating.text}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handlePlayAgain}
            className="cursor-pointer group flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
          >
            <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
            Play Again
          </button>
          
          <button
            onClick={handleGoHome}
            className="cursor-pointer group flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-slate-200 hover:border-slate-300"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            Go Home
          </button>
        </div>

        {/* Footer Message */}


      </div>
    </div>
  );
};