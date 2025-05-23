import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
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
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-900 min-h-screen`}
        >


        <main className="">{children}</main>

        <footer className="w-full p-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} GeoGuessr WA. All rights reserved.
        </footer>
        </body>
        </html>
    );
}
