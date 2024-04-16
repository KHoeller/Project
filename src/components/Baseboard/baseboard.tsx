import React, {useEffect, useState} from "react";
import './baseboard.css';
import MousePosition, { MousePositionProps } from "../MousePosition/mousePosition"; // Übrlegung die Angabe in die Fußleiste zu packen 
import Map from 'ol/Map';
import About from '../About/about';



export type BaseboardProp = {
    map: Map;
};

export default function Baseboard({map}: BaseboardProp) {


    return (
        <>
        <div className='baseboard'>
            <div className="Koordinaten">
                Koordinaten: <MousePosition map = {map}/>
            </div> 
            
            <div>
                {/* <Attribution/> */}
            </div>
            { /* ESPG 3857*/ }
            <div className="buttonAbout">
                <About/>
            </div>
            
            <div className="attribution"></div>
                
            <div >
                
            </div>
            
        </div>
    </>
    )
}

// useEffect(() => {
//     const scaleControl = new ScaleLine();
//     map.addControl(scaleControl);

//     return () => {
//         map.removeControl(scaleControl);
//     };
// }, [map]);

// &nbsp - Befehl für Leerzeichen 