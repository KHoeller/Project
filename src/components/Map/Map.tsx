
// Component Map 

import React, { useEffect, useState } from 'react';
import Map from 'ol/Map';

// Map style laden 
import './Map.css';

// import FeatureInfo from '../FeatureInfo/featureInfo'; --> hier unnötig, Beispiel für relativen Pfad

export type MapCompProps = {
    map: Map;
};

export default function MapComp ({ map }: MapCompProps) {

    // console.log(map)
    // Beispiel: 
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

    useEffect(() => {       // function wird nur einmal initial aufgerufen; in den eckigen Klammern kann man eine Bedingung eingeben, bei der es erneut aufgerufen wird z.B. map, wenn sich die map ändert
        map.setTarget('map');
    }, []); 

    return (
            <div 
                id='map' 
                className ='map'>
                    Umwelt-Gesundheitskarte 
            </div>
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

    