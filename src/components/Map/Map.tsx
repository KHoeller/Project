
// Component Map: Map + Headline + Baseboard 

import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import Baseboard from '../Baseboard/baseboard';

// import style for MapComp
import './Map.css';


// Define Types for Component function 
export type MapCompProps = {
    map: Map;
};

export default function MapComp ({ map }: MapCompProps) {

    

    useEffect(() => {       // function wird nur einmal initial aufgerufen; in den eckigen Klammern kann man eine Bedingung/Anhaengigkeit eingeben, bei der es erneut aufgerufen wird z.B. map, wenn sich die map ändert
        map.setTarget('map');
    }, [map]); 


    return (
            <div className='mapContainer'>
              
                <h1 className='map-heading'>Umwelt-Gesundheitskarte für Deutschland</h1>
                <div id='map' className ='map'></div>

                <Baseboard map={map}/> {/* baseboard hier, damit sich Groeße von Map automatisch anpasst */}
                
            </div>
    );
}


    