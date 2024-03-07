
// Component Map 

import React, { useEffect, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View.js';

// Map style laden 
import './Map.css';

// layers für Map laden 
import Layers from "/home/khoeller/Dokumente/OpenLayers/src/components/LayerN/LayerN";

import MousePosition from "/home/khoeller/Dokumente/OpenLayers/src/components/MousePosition/mousePosition";
import '/home/khoeller/Dokumente/OpenLayers/src/components/MousePosition/mousePosition.css';



export default function MapComp () {

    // console.log('Hallo aus der Map');

    // const [myText, setMyText] = useState('Hallo Welt');

    // useEffect(() => {
    //     window.setTimeout(() => {
    //         setMyText('Gesundheit!');
    //     }, 4000);    
    // }, []);

    // const myFunc = () => {
    //     console.log('dwadd')
    // };

    // myFunc()


    // Basis Map und view 
    useEffect(() => {
        const map = new Map({
            layers: Layers(), // damit Array statt der Funktion verwendet wird 
            target: 'map',
            view: new View({
                center: [1141371, 6735169],
                zoom: 4,
            }),
        });
        MousePosition(map); 
    }) // wofür ist }, []); -> wofür sind die [] wie oben im Beispiel 
  

    return (
        <>
            <div 
                id='map' 
                className ='map'>
                    Umwelt-Gesundheitskarte 
            </div>
            <div 
                id = 'mouse-position' 
                className = 'mouse-position'>
            </div>
           
        </>
    );
}

// CSS
    // {
    //     position: fixed;
    //     top: 0; 
    //     left: 0;
    //     width: 100%;
    //     height: 100%;
    //     font-family: sans-serif;
    // }

// Alternative zu extra CSS-Datei:
    // export default function Map () {
    //     return (
    //         <div 
    //           id='map' 
    //           className ='map'
    //           style={{
    //             position: 'fixed',
    //             top: 0, 
    //             left: 0,
    //             width: '100%',
    //             height: '100%',
    //             fontFamily: 'sans-serif' 
    //           }}
    //         >
    
    //         </div>
    //     );
    // }