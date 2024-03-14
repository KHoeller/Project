import React, {useEffect} from "react";
import './baseboard.css';
import MousePosition, { MousePositionProps } from "../MousePosition/mousePosition"; // Übrlegung die Angabe in die Fußleiste zu packen 
import { CopyrightCircleOutlined } from "@ant-design/icons";
import Map from 'ol/Map';
import About from '../About/about';


export type BaseboardProp = {
    map: Map;
};

export default function Baseboard({map}: BaseboardProp) {

    return (
        <>
        <div className='baseboard'>
            <MousePosition map = {map}/> 
            
            <div></div>
            { /* ESPG 3857*/ }
            <div>
                <About/>
            </div>
            
            <div></div>
            
            <div>
                <CopyrightCircleOutlined /> 
                &nbsp;
                OpenStreetMap contributors
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