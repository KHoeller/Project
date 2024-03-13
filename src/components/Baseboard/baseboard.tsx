import React from "react";
import './baseboard.css';
import MousePosition, { MousePositionProps } from "../MousePosition/mousePosition";
import { CopyrightCircleOutlined } from "@ant-design/icons";


export default function Baseboard() {

    return (
        <>
        <div className='baseboard'>
            <div>
                
            </div>
            <div/>
            <div/>
            <div> 
                <button >About</button>
            </div>
            <div >{/*EPSG3857: Koordinaten*/} </div>
            <div>
                <CopyrightCircleOutlined /> 
                &nbsp;
                OpenStreetMap contributors
            </div>
        </div>
    </>
    )
}
// {< MousePosition map={map}/>}
// &nbsp - Befehl für Leerzeichen 