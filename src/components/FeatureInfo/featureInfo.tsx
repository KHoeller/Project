
import React, {useEffect, useState} from 'react';
import Layers from '../LayerN/LayerN';
import TileWMS from 'ol/source/TileWMS.js';
import { MapBrowserEvent } from 'ol';
import Map from 'ol/Map';

import './featureInfo.css';

export type FeatureInfoProps = {
    map: Map
};

export default function FeatureInfo ({ map}: FeatureInfoProps){

    console.log(map)
    
    const [feature, setFeature] = useState('');
 
        useEffect(() => {
            const handleClick = (evt: MapBrowserEvent<any>) => {
                // console.log(evt.coordinate);
                const viewResolution = map.getView().getResolution() ?? 0;      // aktueller Kartenausschnitt und aktuelle Auflösung um den geclickten Punkt möglichst genau an GeoServer zurückzugeben
                const source = Layers()[7]?.getSource();
                    
                if (source instanceof TileWMS) {                                    // sofern die Quelle TileWMS ist -> kann getFeatureInfo abgerufen werden 
                    const url = source?.getFeatureInfoUrl(                             // mit der Eventkoordinate, der aktuellen Auflösung/Kartenausschnitt, dem CRS und dem Format für die Ausgabe 
                        evt.coordinate,
                        viewResolution,
                        'EPSG:3857',
                        { 'INFO_FORMAT': 'application/json' }                          
                    );
                    console.log(url)  
            
                    if (url) {
                        fetch(url)
                            .then((response) => response.json())
                            .then((responseObject) => {
                                console.log(responseObject);
                                if (responseObject.features && responseObject.features.length > 0) {
                                    const grayIndex = responseObject.features[0].properties.GRAY_INDEX;
                                    console.log(grayIndex);
                                    setFeature(`GRAY_INDEX: ${grayIndex}`);
                                }
                            })
                            .catch(error => {
                                console.log('my error is ', error);
                            });
                    }
                }
            };
    
            map.on('singleclick', handleClick); //
        }, []);
    
        
    return (
            <div id='info' className ='info'>value: {feature} </div>            
    )
}



// map.on('singleclick', function (evt) {                      // map.on - Arbeiten auf der map; on ist die Methode -> zwei Argumente - vordefiniertes Event! singeclick/dblclick/click; 
//     //funktion mit einem Event und ist eine Callbackfunktion, weil sie erst abgerufen wird, wenn geclickt wird
//  console.log(evt.coordinate)                               // Coordinaten des Events werden ausgegeben 
//  const infoElement = document.getElementById('info')
//  if(infoElement) {               
//      infoElement.innerHTML = '';
//      const viewResolution = evt.map.getView().getResolution() ?? 0;      // aktueller Kartenausschnitt und aktuelle Auflösung um den geclickten Punkt möglichst genau an GeoServer zurückzugeben
//      const source = layers[7]?.getSource();                               // Quelle des Layers (auf position 1 des Arrays)
//      if (source instanceof TileWMS) {                                    // sofern die Quelle TileWMS ist -> kann getFeatureInfo abgerufen werden 
//          const url = source.getFeatureInfoUrl(                             // mit der Eventkoordinate, der aktuellen Auflösung/Kartenausschnitt, dem CRS und dem Format für die Ausgabe 
//                      evt.coordinate,
//                      viewResolution,
//                      'EPSG:3857',
//                      { 'INFO_FORMAT': 'application/json' }                           // am besten und einfachsten zu lesen 
//          );
//          console.log(url)                                                   // url zu den Features 
//           if (url) {
//          fetch(url)                                                          // url abrufen und den Text zurückgeben lassen also object 
//              .then((response) => response.json())
//              .then((responseObject) => {
//          console.log(responseObject);                                   // Object anzeigen lassen 

//          let fet = responseObject.features[0].properties.GRAY_INDEX;
//          console.log(fet);

//          infoElement.innerHTML = `GRAY_INDEX: ${fet}`;
//      })
//              .catch(error => {
//          console.log('my error is ', error)                             // falls url fehlerhaft ist wird ein Fehler gemeldet 
//          });
//      }
//     }
// }
// target: infoElement
// });


// export default function addFeatureInfo() {
    
    // function handleClick(){
    //     alert('You clicked me')
    // }
   
    // console.log(info(onclick));
    // const [info, setInfo] = useState('');

    // function handleClick(){
    //     // setInfo(info, );
    // }

 
    // const layers = Layers(); 
    
    


//     return(
//         <button id='info' className ='info' onClick={}>value: {}</button>
//     )
// }


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