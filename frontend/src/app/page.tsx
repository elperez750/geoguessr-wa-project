"use client"

import { GetInfoFromBackend } from "@/app/components/getInfoFromBackend";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function Home() {
    const router = useRouter();

    const handlePlayGame = () => {
        router.push("/play");
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center text-xl font-bold mb-4">
                <h1 className="text-bold text-3xl">
                    Explore the State of Washington, Test Your Geography Skills
                </h1>
                <h2 className="text-italic text-xl">
                    Drop into random location around Washington and guess where you are. The closer the guess, the more points you earn
                </h2>
            </div>


                <Button onClick={handlePlayGame}>
                    Play Now
                </Button>


        </div>
    );
}