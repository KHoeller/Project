
import React, {useEffect} from 'react';
import './featureInfo.css';
import TileWMS from 'ol/source/TileWMS.js';
import TileLayer from 'ol/layer/Tile';
import { Map } from 'ol';

import Layers from "/home/khoeller/Dokumente/OpenLayers/src/components/LayerN/LayerN";
import { MapBrowserEvent, MapBrowserEventHandler } from 'ol';
import { MapEventHandler } from 'ol/Map';


function infos (evt: MapBrowserEvent<MouseEvent>, map:Map){
    console.log(evt.coordinate)                               // Coordinaten des Events werden ausgegeben 
        const infoElement = document.getElementById('info')
        if(infoElement) {               
            infoElement.innerHTML = '';
            const viewResolution = evt.map.getView().getResolution() ?? 0;      // aktueller Kartenausschnitt und aktuelle Auflösung um den geclickten Punkt möglichst genau an GeoServer zurückzugeben
            const layersArray = Layers();
            const foundLayer = layersArray.find(layer => layer.get('R_NO2_2014') === 'R_NO2_2014');                               // Quelle des Layers (auf position 1 des Arrays)
            if (foundLayer) {  
                const source = foundLayer.getSource();                                 
                if (source instanceof TileWMS){// sofern die Quelle TileWMS ist -> kann getFeatureInfo abgerufen werden 
                const url = source.getFeatureInfoUrl(                             // mit der Eventkoordinate, der aktuellen Auflösung/Kartenausschnitt, dem CRS und dem Format für die Ausgabe 
                    evt.coordinate,
                    viewResolution,
                    'EPSG:3857',
                    { 'INFO_FORMAT': 'application/json' }                           // am besten und einfachsten zu lesen 
                );
                console.log(url)                                                   // url zu den Features 
                if (url) {
                    fetch(url)                                                          // url abrufen und den Text zurückgeben lassen also object 
                        .then((response) => response.json())
                        .then((responseObject) => {
                        console.log(responseObject);                                   // Object anzeigen lassen 
                    
                        let fet = responseObject.features[0].properties.GRAY_INDEX;
                        console.log(fet);
                            
                        infoElement.innerHTML = `GRAY_INDEX: ${fet}`;
                        })
                        .catch(error => {
                        console.log('my error is ', error)                             // falls url fehlerhaft ist wird ein Fehler gemeldet 
                        });
                 }
                }
            }
        }
}

export default function addFeatureInfo (map: Map) {
    
    map.on('singleclick', evt => handleClick(evt,map));

 
} 


//     return (
//         <div id = "info" className="featureInfo" >&nbsp;</div>
//     );
// }

// mit usestate? 
    // map.on('singleclick', function (evt) {                      // map.on - Arbeiten auf der map; on ist die Methode -> zwei Argumente - vordefiniertes Event! singeclick/dblclick/click; 
    //                                                             //funktion mit einem Event und ist eine Callbackfunktion, weil sie erst abgerufen wird, wenn geclickt wird
    //   console.log(evt.coordinate)                               // Coordinaten des Events werden ausgegeben 
    //   const infoElement = document.getElementById('info')
    //   if(infoElement) {               
    //     infoElement.innerHTML = '';
    //     const viewResolution = evt.map.getView().getResolution() ?? 0;      // aktueller Kartenausschnitt und aktuelle Auflösung um den geclickten Punkt möglichst genau an GeoServer zurückzugeben
    //     const source = layers[7]?.getSource();                               // Quelle des Layers (auf position 1 des Arrays)
    //     if (source instanceof TileWMS) {                                    // sofern die Quelle TileWMS ist -> kann getFeatureInfo abgerufen werden 
    //       const url = source.getFeatureInfoUrl(                             // mit der Eventkoordinate, der aktuellen Auflösung/Kartenausschnitt, dem CRS und dem Format für die Ausgabe 
    //         evt.coordinate,
    //         viewResolution,
    //         'EPSG:3857',
    //         { 'INFO_FORMAT': 'application/json' }                           // am besten und einfachsten zu lesen 
    //       );
    //       console.log(url)                                                   // url zu den Features 
    //     if (url) {
    //       fetch(url)                                                          // url abrufen und den Text zurückgeben lassen also object 
    //         .then((response) => response.json())
    //         .then((responseObject) => {
    //           console.log(responseObject);                                   // Object anzeigen lassen 

    //           let fet = responseObject.features[0].properties.GRAY_INDEX;
    //           console.log(fet);
            
    //           infoElement.innerHTML = `GRAY_INDEX: ${fet}`;
    //         })
    //         .catch(error => {
    //           console.log('my error is ', error)                             // falls url fehlerhaft ist wird ein Fehler gemeldet 
    //         });
    //     }
    //     }
    //   }
    //   target: infoElement
    // });

// Hinzufügen in dok.css 
    // #info{
    //     position: fixed;
    //     bottom: 30px;
    //     right: 15px;
        
        
    //     /* padding: 5px; */
    //     border: 1px solid black; 
    //     z-index: 100; 
    //     background-color: cornsilk;
    //   }