"use client"

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RegisterFormCard } from "@/app/components/auth/RegisterFormCard";
import { LoginFormCard } from "@/app/components/auth/LoginFormCard";

const AuthToggle = () => {
    const [activeTab, setActiveTab] = useState("Login");

    // Function to switch to a specific tab
    const switchToTab = (tabValue: string) => {
        setActiveTab(tabValue);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 pt-24 pb-12 px-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-slate-200/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-md mx-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    {/* Custom Tab Navigation */}
                    <div className="flex justify-center mb-8">
                        <div className="backdrop-blur-md bg-white/80 p-2 rounded-2xl shadow-lg border border-white/20">
                            <TabsList className="bg-transparent border-0 p-0 h-auto gap-2">
                                <TabsTrigger
                                    value="Login"
                                    className="px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-900 data-[state=inactive]:hover:bg-slate-100/50"
                                >
                                    Sign In
                                </TabsTrigger>
                                <TabsTrigger
                                    value="Register"
                                    className="px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-900 data-[state=inactive]:hover:bg-slate-100/50"
                                >
                                    Register
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="relative">
                        <TabsContent value="Login" className="mt-0 focus-visible:outline-none">
                            <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-300">
                                <LoginFormCard/>
                            </div>
                        </TabsContent>

                        <TabsContent value="Register" className="mt-0 focus-visible:outline-none">
                            <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-300">
                                <RegisterFormCard onRegisterSuccess={() => switchToTab("Login")}/>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            {/* Footer Text */}
            <div className="relative text-center mt-12">
                <p className="text-slate-500 text-sm">
                    Ready to explore Washington state?
                    <span className="text-emerald-600 font-medium"> Join thousands of explorers!</span>
                </p>
            </div>
        </div>
    );
};

export default AuthToggle;