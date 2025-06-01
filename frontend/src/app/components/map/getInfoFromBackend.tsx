"use client";

import React from "react";
import {APIProvider} from "@vis.gl/react-google-maps";
import StreetViewComponent from "@/app/components/map/StreetViewComponent";
import ResultMapComponent from "@/app/components/map/ResultMapComponent";

export const GetInfoFromBackend = () => {

    return (
        <div className="flex flex-col p-4">


            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY} libraries={["streetView"]}>
                <StreetViewComponent />



            </APIProvider>


        </div>
    );
};
