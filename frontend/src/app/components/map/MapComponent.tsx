"use client"

import { Map, Marker, MapMouseEvent } from "@vis.gl/react-google-maps";
import React, { useState } from "react"; // Added useRef import
import { CoordinateType } from "@/app/types/mapTypes";

const MapComponent = () => {
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    const [clickCoords, setClickCoords] = useState<CoordinateType | null>(null); // Fixed initialization

    // Fixed typing for the map parameter


    const handleClickOnMap = (e: MapMouseEvent) => {
        if (e.detail.latLng) {
            const latLng = e.detail.latLng;
            const lat = latLng.lat;
            const lng = latLng.lng;

            setClickCoords({ lat: lat, lng: lng });
        }
    }

    if (!googleMapsApiKey) {
        return <p className="text-red-500">Cannot find the Apikey</p>
    }

    return (
        <>
            <Map
                style={{ width: "80vw", height: "50vh" }}
                defaultCenter={{ lat: 40.0000, lng: -114.3342 }}
                defaultZoom={5} // Changed to 7 from 10
                gestureHandling="greedy"
                disableDefaultUI={true}
                onClick={handleClickOnMap}
                draggableCursor="pointer"
                draggingCursor="crosshair"
            >

                {clickCoords && <Marker position={clickCoords} />}
            </Map>

            {clickCoords && (
                <div className="mt-4">
                    <h2 className="text-lg font-medium">Selected Coordinates:</h2>
                    <p>Latitude: {clickCoords.lat.toFixed(4)}</p>
                    <p>Longitude: {clickCoords.lng.toFixed(4)}</p>
                </div>
            )}
        </>
    );
}

export default MapComponent;