
// Component Map: Map + Headline (+ css for ol-zoom)

import React, { useEffect } from 'react';
import Map from 'ol/Map';

import Baseboard from '../Baseboard/baseboard';
import NominatimSearch from '../Search/search';
import FeatureInfo from '../FeatureInfo/featureInfo';
import Toolbar from '../Toolbar/toolbar';

// import style for MapComp
import './Map.css';

// Define Types for Component function 
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
    }, [map]); 

    return (
            <div className='mapContainer'>
                {/* <NominatimSearch map={map}/>
                <Toolbar/>
                <FeatureInfo map={map}/> */}
                {/* <Baseboard map={map}/> */}
              
                <h1 className='map-heading'>Umwelt-Gesundheitskarte für Deutschland</h1>
                <div id='map' className ='map'></div>
                
                
               
                
            </div>
    );
}

// MapContainer mit einer Überschrift (Heading 1) und einer Karte 


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

    