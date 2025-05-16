import { useState, useRef, useEffect } from "react";
import { useMapsLibrary } from '@vis.gl/react-google-maps';



type Coordinate = {
    lat: number;
    lng: number;
}
const StreetViewComponent = ({lat, lng} : Coordinate) => {


    const streetViewLib = useMapsLibrary('streetView');


    const streetViewRef = useRef<HTMLDivElement | null>(null);
    const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);



    useEffect(() => {
        if (!streetViewLib || !streetViewRef.current) return;

        if (!panoramaRef.current) {
            panoramaRef.current = new streetViewLib.StreetViewPanorama(streetViewRef.current, {
                position: {lat, lng},
                pov: {heading: 100, pitch: 0},
                visible: true,
            });

        }
        else{
            panoramaRef.current.setPosition({lat, lng})
        }



    },[streetViewLib]);



    useEffect(() => {

        if (panoramaRef.current) {
            panoramaRef.current.setPosition({lat, lng});

        }
    }, [lat, lng])

    return (
        <div
            ref={streetViewRef}
            style={{width: "100vw", height: "100vh"}}
        >

        </div>

    )

}

export default StreetViewComponent;



