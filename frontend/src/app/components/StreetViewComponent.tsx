import { useRef, useEffect, useState } from "react";
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import {Coordinate} from "...@/app/types/mapTypes";
import api from "...@/app/api";


const StreetViewComponent = ({lat, lng} : Coordinate) => {


    const streetViewLib = useMapsLibrary('streetView');


    const guessNumberRef = useRef(1)
    const [location, setLocation] = useState("");
    const streetViewRef = useRef<HTMLDivElement | null>(null);
    const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

    const getLocation = async() => {
        console.log("Calling getLocation")
        const location = await api.get("game/get-location", {
                    params: {
                        lat: lat,
                        lng: lng,
                        guess_number: guessNumberRef.current
            }


        })
        console.log(location.data);
        setLocation(location.data);
        guessNumberRef.current += 1
        return location;


    }


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

        if (panoramaRef.current && streetViewLib) {
            panoramaRef.current.setPosition({lat, lng});
            getLocation()

        }
    }, [lat, lng, streetViewLib])

    return (
        <div>
            <div
                ref={streetViewRef}
                style={{width: "70vw", height: "100vh"}}
            >


            </div>


            {location && <h1>{location}</h1>}

        </div>


    )

}

export default StreetViewComponent;



