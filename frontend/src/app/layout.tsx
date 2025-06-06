import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import {AuthProvider} from "@/app/context/AuthContext";
import { Toaster } from "sonner";
import Navbar from "@/app/components/Navbar";
import {GameProvider} from "@/app/context/GameContext";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "GeoGuessr WA",
    description: "Explore and guess locations across Washington State!",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${inter.variable} ${jetbrainsMono.variable} font-inter antialiased bg-gray-100 text-gray-900 min-h-screen`}>

        <GameProvider>
        <AuthProvider>



            <Navbar />

        <Toaster richColors closeButton position="bottom-right" />


        <main className="">{children}</main>


        </AuthProvider>
        </GameProvider>

        </body>
        </html>
    );
}
