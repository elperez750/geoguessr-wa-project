import { useRef, useEffect, useState } from "react";
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import api from "@/app/api";
import {Button} from "@/components/ui/button";
import MapComponent from "@/app/components/map/MapComponent";
const StreetViewComponent = () => {


    const streetViewLib = useMapsLibrary('streetView');


    const guessNumberRef = useRef(1)
    const [panoId, setPanoId] = useState();
    const streetViewRef = useRef<HTMLDivElement | null>(null);
    const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);


    async function fetchPano() {
        console.log("Calling getLocation");
        const response = await api.get("game/get-location-from-db");
        console.log(response);
        const newPano = response.data;
        console.log("Got pano:", newPano);
        setPanoId(newPano);
        guessNumberRef.current += 1;
    }

    useEffect(() => {

        fetchPano();
    }, []);


    useEffect(() => {
        if (!streetViewLib || !streetViewRef.current || !panoId) return;

        if (!panoramaRef.current) {
            panoramaRef.current = new streetViewLib.StreetViewPanorama(streetViewRef.current, {
                pano: panoId,
                pov: {heading: 100, pitch: 0},
                visible: true,
                addressControl: false,
                showRoadLabels: false,
            });

        }
        else{
            panoramaRef.current.setPano(panoId)
        }



    },[streetViewLib, panoId]);





    return (
        <div className="relative w-screen h-[90vh]">
            {/* Street View container */}
            <div ref={streetViewRef} className="w-full h-full rounded-lg" />

            {/* MapComponent overlay in bottom-right corner */}
            <div className="absolute bottom-4 left-4 z-20 flex flex-col items-center">
                <div className="w-[300px] h-[200px] rounded-lg overflow-hidden shadow-lg">
                    <MapComponent />
                </div>
                <div className="mt-2">
                    <Button className={'w-[300px]'} onClick={fetchPano}>Guess</Button>
                </div>
            </div>
        </div>
    );


}

export default StreetViewComponent;



