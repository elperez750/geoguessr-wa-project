import {APIProvider, Map,  Marker,
    useMarkerRef, MapMouseEvent} from "@vis.gl/react-google-maps";
import React, {useState} from "react";


type Coordinate = {

    lat: number;
    lng: number;

}


const MapComponent = () => {
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const [markerRef, setMarkerRef] = useMarkerRef();

    const [clickCoords, setClickCoords] = useState<Coordinate | null>();


    const handleClickOnMap = (e: MapMouseEvent) => {
        if (e.detail.latLng) {
            const latLng = e.detail.latLng;
            const lat = latLng.lat
            const lng = latLng.lng;

            setClickCoords({ lat: lat, lng: lng });
        }
    }


    if (!googleMapsApiKey) {
        return <p className="text-red-500">Cannot find the Apikey</p>
    }



return (
    <>
        <APIProvider apiKey={googleMapsApiKey}>
            <Map
                style={{ width: "100vw", height: "50vh" }}
                defaultCenter={{ lat: 22.54992, lng: 0 }}
                defaultZoom={3}
                gestureHandling="greedy"
                disableDefaultUI={true}
                onClick={handleClickOnMap}
            >
                <Marker ref={markerRef} position={{lat: 47.6061, lng: -122.3328}} />
                <Marker position={clickCoords} />
            </Map>
        </APIProvider>

        <h1>{clickCoords?.lat}</h1>
        <h1>{clickCoords?.lng}</h1>




    </>


)

}


export default MapComponent;