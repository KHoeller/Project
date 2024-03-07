
// Component MousePosition
import './mousePosition.css';
import Map from 'ol/Map';

import MousePosition from 'ol/control/MousePosition'; // für Koordinaten mithilfe der Mausposition 
import {createStringXY} from 'ol/coordinate'; 


export default function addMousePositionControl (map: Map) {
    const targetElement = document.getElementById('mouse-position');
        if (targetElement !== null) {
            const mousePositionControl = new MousePosition({      //aktuelle Mausposition 
                coordinateFormat: createStringXY(5),                // Koordinaten auf 7 Nachkommastellen 
                projection: 'EPSG:3857',
                target: targetElement,                              // Eintragen in html bei div mouse-position -> in File Map
                });
            map.addControl(mousePositionControl);  // auf der Karte die aktuellen Koordinaten der Maus anzeigen 
        }
};      


// Herausforderung:
// bei Klick für featureinfo auch die aktuellen Koordinaten festhalten? 
    
    
// return (
//     <div id = "location">
//         <div id = 'mouse-position' className = "Custom-mouse-position">Koordinaten:</div>
//     </div>

    // );


    

// <div id="wrapper">
    
// #wrapper{
//     /* padding: 5px; */
//     border: 1px solid black; 
//     z-index: 100; 
//     background-color: white;
//   } 