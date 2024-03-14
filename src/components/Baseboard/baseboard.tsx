import React from "react";
import './baseboard.css';
// import MousePosition, { MousePositionProps } from "../MousePosition/mousePosition"; // Übrlegung die Angabe in die Fußleiste zu packen 
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
            <div>ESPG 3857</div>
            <div>Scalebar</div>
            {/* <div> 
                <button >About</button>
            </div> */}
            <div>
                <About/>
            </div>
            {/* <div> <MousePosition map = {map}/> </div> */}
            <div/>
            <div>
                <CopyrightCircleOutlined /> 
                &nbsp;
                OpenStreetMap contributors
            </div>
        </div>
    </>
    )
}



// &nbsp - Befehl für Leerzeichen 