// components/ResultMapComponent.tsx
"use client"

import { Map, Marker, useMap } from "@vis.gl/react-google-maps";
import React, { useRef, useEffect } from "react";
import { CoordinateType } from "@/app/types/mapTypes";
import {APIProvider} from "@vis.gl/react-google-maps";

interface ResultMapComponentProps {
    actualLocation: CoordinateType;
    guessLocation: CoordinateType;
}

const Polyline = ({ path, options }: {
    path: { lat: number; lng: number }[];
    options?: google.maps.PolylineOptions;
}) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const polyline = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#0066CC',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            ...options
        });

        polyline.setMap(map);

        // Cleanup when component unmounts
        return () => {
            polyline.setMap(null);
        };
    }, [map, path, options]);

    return null; // This component doesn't render anything
};



const ResultMapComponent: React.FC<ResultMapComponentProps> = ({
                                                                   actualLocation,
                                                                   guessLocation,
                                                               }) => {
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const mapRef = useRef<google.maps.Map | null>(null);

    // Washington State center coordinates for consistent alignment
    const washingtonCenter = { lat: 47.751076, lng: -120.740135 };
    
    // Calculate appropriate zoom based on distance between points
    const calculateZoom = (loc1: CoordinateType, loc2: CoordinateType) => {
        const distance = Math.sqrt(
            Math.pow(loc1.lat - loc2.lat, 2) + Math.pow(loc1.lng - loc2.lng, 2)
        );
        
        // Adjust zoom based on distance (these values work well for Washington state)
        if (distance > 5) return 6;  // Far apart
        if (distance > 2) return 7;  // Medium distance
        if (distance > 1) return 8;  // Close
        return 9; // Very close
    };

    const zoom = calculateZoom(actualLocation, guessLocation);

    if (!googleMapsApiKey) {
        return <p className="text-red-500">Cannot find the API key</p>;
    }

    return (
        <>
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""}
                         libraries={["streetView"]}>
            <Map
                style={{ width: "100%", height: "100%" }}
                defaultCenter={washingtonCenter}
                defaultZoom={zoom}
                gestureHandling="greedy"
                disableDefaultUI={true}
                ref={mapRef}
            >
                {/* Actual location marker (green) */}
                <Marker
                    position={actualLocation}
                    options={{
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: '#00FF00',
                            fillOpacity: 1,
                            strokeColor: '#006600',
                            strokeWeight: 2,
                            scale: 8
                        }
                    }}
                />

                {/* Guess location marker (red) */}
                <Marker
                    position={guessLocation}
                    options={{
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: '#FF0000',
                            fillOpacity: 1,
                            strokeColor: '#660000',
                            strokeWeight: 2,
                            scale: 8
                        }
                    }}
                />

                {/* Line connecting the two points */}
                <Polyline
                    path={[actualLocation, guessLocation]}
                    options={{
                        strokeColor: '#0066CC',
                        strokeOpacity: 0.8,
                        strokeWeight: 3,
                        geodesic: true
                    }}
                />
            </Map>
            </APIProvider>
        </>
    );
};

export default ResultMapComponent;