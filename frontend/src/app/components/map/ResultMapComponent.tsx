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

    // Calculate center point between the two locations
    const centerLat = (actualLocation.lat + guessLocation.lat) / 2;
    const centerLng = (actualLocation.lng + guessLocation.lng) / 2;

    if (!googleMapsApiKey) {
        return <p className="text-red-500">Cannot find the API key</p>;
    }

    return (
        <>
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY} libraries={["streetView"]}>

            <Map
                style={{ width: "100vw", height: "60vh" }}
                defaultCenter={{ lat: centerLat, lng: centerLng }}
                defaultZoom={4}
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

            <div className="mt-4 p-4 bg-gray-100 rounded">
                <h2 className="text-xl font-bold mb-2">Round Result</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-medium text-green-600">Actual Location:</h3>
                        <p>Lat: {actualLocation.lat.toFixed(4)}</p>
                        <p>Lng: {actualLocation.lng.toFixed(4)}</p>
                    </div>
                    <div>
                        <h3 className="font-medium text-red-600">Your Guess:</h3>
                        <p>Lat: {guessLocation.lat.toFixed(4)}</p>
                        <p>Lng: {guessLocation.lng.toFixed(4)}</p>
                    </div>
                </div>

            </div>
                </APIProvider>
        </>
    );
};

export default ResultMapComponent;