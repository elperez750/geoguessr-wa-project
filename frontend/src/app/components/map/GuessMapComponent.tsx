"use client"

import { Map, Marker, MapMouseEvent } from "@vis.gl/react-google-maps";
import React, { useState } from "react"; // Added useRef import
import { CoordinateType } from "@/app/types/mapTypes";
import {useGame} from "@/app/context/GameContext";

const MapComponent = () => {
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    const [clickCoords, setClickCoords] = useState<CoordinateType | null>(null); // Fixed initialization
    const {setGuessCoords} = useGame()
    // Fixed typing for the map parameter


    const handleClickOnMap = (e: MapMouseEvent) => {
        if (e.detail.latLng) {
            const latLng = e.detail.latLng;
            const lat = latLng.lat;
            const lng = latLng.lng;


            setGuessCoords({lat: lat, lng: lng})
            setClickCoords({ lat: lat, lng: lng });
        }
    }

    if (!googleMapsApiKey) {
        return <p className="text-red-500">Cannot find the Apikey</p>
    }

    // Washington State center coordinates for consistent alignment
    const washingtonCenter = { lat: 47.751076, lng: -120.740135 };

    return (
        <>
            <Map
                style={{ width: "100%", height: "100%" }}
                defaultCenter={washingtonCenter}
                defaultZoom={7}
                gestureHandling="greedy"
                disableDefaultUI={true}
                onClick={handleClickOnMap}
                draggableCursor="pointer"
                draggingCursor="crosshair"
            >

                {clickCoords && <Marker position={clickCoords} />}
            </Map>
        </>
    );
}

export default MapComponent;