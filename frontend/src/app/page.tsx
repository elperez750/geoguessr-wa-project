"use client"

import { GetInfoFromBackend } from "@/app/components/getInfoFromBackend";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import api from "@/app/api";
export default function Home() {
    const router = useRouter();

    const handlePlayGame = () => {
        router.push("/play");
    }

    const registerUser = async() => {

        console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}`)
        try {
            const response = await api.post("auth/register", {
                username: "michael_jordan23",
                password: "hello",
                email: "michael@gmail.com"
            })

            console.log(response)

        }
        catch (error: any) {
            console.log('=== ERROR DETAILS ===');
            console.log('Status:', error.response?.status);
            console.log('Error data:', error.response?.data);
            console.log('Error detail:', error.response?.data?.detail);
        }
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


                <Button onClick={registerUser}>
                    Register User
                </Button>


        </div>
    );
}