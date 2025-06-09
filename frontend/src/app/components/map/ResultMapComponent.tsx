// Alternative approach - using custom markers with useEffect
"use client"

import { Map, useMap } from "@vis.gl/react-google-maps";
import React, { useEffect } from "react";
import { CoordinateType } from "@/app/types/mapTypes";
import { APIProvider } from "@vis.gl/react-google-maps";

interface ResultMapComponentProps {
    actualLocation: CoordinateType;
    guessLocation: CoordinateType;
}

const CustomMarkers = ({ actualLocation, guessLocation }: {
    actualLocation: CoordinateType;
    guessLocation: CoordinateType;
}) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !window.google) return;

        // Create actual location marker (green)
        const actualMarker = new google.maps.Marker({
            position: actualLocation,
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#00FF00',
                fillOpacity: 1,
                strokeColor: '#006600',
                strokeWeight: 2,
                scale: 8
            },
            title: 'Actual Location'
        });

        // Create guess location marker (red)
        const guessMarker = new google.maps.Marker({
            position: guessLocation,
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: '#FF0000',
                fillOpacity: 1,
                strokeColor: '#660000',
                strokeWeight: 2,
                scale: 8
            },
            title: 'Your Guess'
        });

        // Create polyline
        const polyline = new google.maps.Polyline({
            path: [actualLocation, guessLocation],
            geodesic: true,
            strokeColor: '#0066CC',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            map: map
        });

        // Cleanup
        return () => {
            actualMarker.setMap(null);
            guessMarker.setMap(null);
            polyline.setMap(null);
        };
    }, [map, actualLocation, guessLocation]);

    return null;
};

const ResultMapComponent: React.FC<ResultMapComponentProps> = ({
                                                                   actualLocation,
                                                                   guessLocation,
                                                               }) => {
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

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
        <APIProvider
            apiKey={googleMapsApiKey}
            libraries={["streetView"]}
        >
            <Map
                style={{ width: "100%", height: "100%" }}
                defaultCenter={washingtonCenter}
                defaultZoom={zoom}
                gestureHandling="greedy"
                disableDefaultUI={true}
            >
                <CustomMarkers
                    actualLocation={actualLocation}
                    guessLocation={guessLocation}
                />
            </Map>
        </APIProvider>
    );
};

export default ResultMapComponent;