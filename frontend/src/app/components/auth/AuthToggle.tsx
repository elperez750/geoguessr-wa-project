"use client"

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RegisterFormCard } from "@/app/components/auth/RegisterFormCard";
import { LoginFormCard } from "@/app/components/auth/LoginFormCard";

const AuthToggle = () => {
    // Create a state to track the current tab value
    const [activeTab, setActiveTab] = useState("Login");

    // Function to switch to a specific tab
    const switchToTab = (tabValue: string) => {
        setActiveTab(tabValue);
    };

    return (
        <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-center gap-4 mt-4">
                    <TabsList>
                        <TabsTrigger value="Login">Login</TabsTrigger>
                        <TabsTrigger value="Register">Register</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="Login">
                    <LoginFormCard/>
                </TabsContent>
                <TabsContent value="Register">
                    <RegisterFormCard onRegisterSuccess={() => switchToTab("Login")}/>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AuthToggle;