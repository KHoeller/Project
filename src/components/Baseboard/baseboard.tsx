import React from "react";
import './baseboard.css';
import MousePosition from "../MousePosition/mousePosition";
import { CopyrightCircleOutlined } from "@ant-design/icons";


export default function Baseboard() {

    return (
        <>
            <div className = 'baseboard'>
                <div> EPSG: Coordinates/ Scalebar 
                    {/* <div className="mouse-position-container"> 
                    {/* {MousePosition} </div> */}
                </div>

                <div> 
                    <button>About</button> 
                </div>

                <div> 
                    <CopyrightCircleOutlined/>
                    &nbsp;
                    Copyright 
                </div>
                
            </div>
        </>
    )
}

// &nbsp - Befehl für Leerzeichen 