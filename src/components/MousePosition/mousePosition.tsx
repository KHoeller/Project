
// Component MousePosition
import React, { useEffect } from 'react';
import './mousePosition.css';
import Map from 'ol/Map';

import MousePosition from 'ol/control/MousePosition';       // für Koordinaten mithilfe der Mausposition 
import {createStringXY} from 'ol/coordinate'; 

export type MousePositionProps = {                          // Typen für Props festlegen 
    map: Map;
};

export default function MousePositionControl ({map}: MousePositionProps) {
    
    useEffect(() => {                                           // useEffect -> erst wird das div unten im html body erstellt und dann der Befehl ausgeführt, sodass die Koordinaten ins div eingetragen werden können 
        const mousePosition = new MousePosition({           //aktuelle Mausposition 
        coordinateFormat: createStringXY(5),                // Koordinaten auf 7 Nachkommastellen 
        projection: 'EPSG:3857',
        target: 'mousePosition',                           // Eintragen in html bei div mouse-position -> in File Map
        });
        
        map.addControl(mousePosition);  // auf der Karte die aktuellen Koordinaten der Maus anzeigen 

        return () => {
            map.removeControl(mousePosition);
        };

    }, [map])

    return(
        <>
            <div id='mousePosition'></div>
        </>
    )
};      


    