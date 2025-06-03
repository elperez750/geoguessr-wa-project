"use client"

import {GetInfoFromBackend} from "@/app/components/map/getInfoFromBackend";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter} from "next/navigation";
import {useEffect} from "react";


export default function PlayPage() {
    const { isAuthenticated, isLoading } = useAuth();

    const router = useRouter();
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/authentication");
            
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <GetInfoFromBackend />
    )
}