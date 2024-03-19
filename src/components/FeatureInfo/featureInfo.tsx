
import React, { useEffect, useState } from 'react'; 
import TileWMS from 'ol/source/TileWMS.js';
import TileLayer from 'ol/layer/Tile';
import { MapBrowserEvent } from 'ol';
import Map from 'ol/Map';
import './featureInfo.css';


export type FeatureInfoProps = {
    map: Map;
};

export default function FeatureInfo ({ map }: FeatureInfoProps){

    
    // useState (hook-function) um den Zustand einer Komponente zuverwalten -> updateValue = aktueller Zustandswert, setUpdatevalue = Funktion, um Zustand zu aktualisieren
    const [updatedValue, setUpdatedValue] = useState<{ layerName: string, attributeName: string, value: string }[]>([]); // (Typ des Zustands) Array, der Objekte enthält, die keys name und value haben
                                                                                            // ([]) -> inital state leerer Array 
    useEffect(() => {
        const handleClick = (evt: MapBrowserEvent<any>) => {                // function for dealing with a click in the Browser 
            
            const viewResolution = map.getView().getResolution() ?? 0;      // aktueller Kartenausschnitt und aktuelle Auflösung um den geclickten Punkt möglichst genau an GeoServer zurückzugeben
            // TODO make use of the existing layers in the map
               
            let tempUpdatedValue: { layerName: string, attributeName: string, value: string }[] = [];

            // console.log(map.getLayers());
            map.getLayers().forEach(layer =>  {      // iterate over all layers 
                
                if (layer instanceof TileLayer) {
                    const isLayerQueryable = layer.get('queryable') ?? false;
                    const isLayerVisible = layer.get('visible') ?? false;
                    const name = layer.get('name');

                    if (isLayerQueryable && isLayerVisible) {
                        const source = layer.getSource();

                        if (source instanceof TileWMS) {
                            const hitTolerance = 100;
                            const url = source?.getFeatureInfoUrl(
                                evt.coordinate,
                                viewResolution,
                                'EPSG:3857',
                                { 'INFO_FORMAT': 'application/json', 'BUFFER': hitTolerance.toString() }
                            );
                    // console.log(url)  
            
                            if (url) {                                              // sofern die URL true ist 
                                fetch(url)
                                .then((response) => {
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    return response.json();
                                })                                                  // response auf Anfrage der URL 
                                    .then((responseObject) => {
                                        // console.log(responseObject);
                                        if (responseObject.features && responseObject.features.length > 0) {
                            
                // !!! Gray Index gibt es für Vector-Daten auf jeden Fall nicht 
                // !!! Toleranz-Bereich für Vector-Data, da man diese sonst nie angezeigt bekommt?! 
                // !!! ToleranzBereich anzeigen lassen? 
                
                                            // const grayIndex = responseObject.features[0].properties.GRAY_INDEX; // von der response den Gray, index abfragen;
                                            
                                            const properties = responseObject.features[0].properties;       // alle Properties anzeigen lassen 
                                            Object.keys(properties).forEach(key => {
                                                const value = properties[key];

                                                // console.log(grayIndex);
                                                tempUpdatedValue.push({ layerName: name, attributeName: key, value: `${value}` });       // zum Array die neuen Informationen des Layers hinzufügen 
                                            });
                                            
                                            setUpdatedValue([...tempUpdatedValue]);                             // die updatedValues werden bei jeder Iteration dem Array hinzugefügt 
                                                    // setValue({name: name, value: `${grayIndex}`}); // Ursprünglich, dann wird immer nur der letzte Value festgehalten 
                                            
                                        }
                                    })

                                .catch(error => {

                                    console.log('my error is ', error);
                                    alert('Sorry, es ist ein Fehler aufgetreten') // TODO Show user an error -> kann man sicherlich noch etwas schöner gestalten 
                                });
                            }
                        }
                    }
                };
                
            });
            
            // To Do show results only for selected attributes 
        };
            
            

        map.on('singleclick', handleClick); //

        return () => {
            map.un('singleclick', handleClick); // TODO should be unregister something if the component unmounts?
        };
        
        
    }, [map]); // TODO what happens if the map prop has changed?
    
        
    return (
            <div id='info' className ='info'> 
                {updatedValue.map((item, index) => (
                <div key={index}>{item.layerName} / {item.attributeName}: {item.value}</div>
                ))}
            </div>            
    )
}

// was ist mit Einheiten zu den verschiedenen Eigenschaften???? 




// {updatedValue.map((item, index) => (
//     <div key={index}>{item.layerName} - {item.attributeName}: {item.value}</div>
// ))}

// Basis FeatureInfo für jeden sichtbaren und queryable Layer ausgeben lassen (aber nur der letzte in der Konsole!) 
// import React, { useEffect, useState } from 'react';
// import Layers from '../../utils/LayerN/LayerN';
// import TileWMS from 'ol/source/TileWMS.js';
// import { MapBrowserEvent } from 'ol';
// import Map from 'ol/Map';

// import './featureInfo.css';
// // import LayerConfig from '../../../conf/config.json';

// export type FeatureInfoProps = {
//     map: Map
// };

// export default function FeatureInfo ({ map }: FeatureInfoProps){

//     // console.log(map)
//     console.log(Layers);
    
//     const [value, setValue] = useState('');
 
//     useEffect(() => {
//         const handleClick = (evt: MapBrowserEvent<any>) => {
//             // console.log(evt.coordinate);
//             const viewResolution = map.getView().getResolution() ?? 0;      // aktueller Kartenausschnitt und aktuelle Auflösung um den geclickten Punkt möglichst genau an GeoServer zurückzugeben
//             // TODO make all* (config.json) layers queryable
//             const layersArray = Layers();

//             for (const layer of layersArray) {
                
//                 const isLayerQueryable = layer.get('queryable') ?? false;
//                 const isLayerVisible = layer.get('visible') ?? false; 
//                 console.log(isLayerVisible);

//                 if (isLayerQueryable && isLayerVisible) {
//                     const source = layer.getSource();
//                     console.log(source)
//                 if (source instanceof TileWMS) {                                    // sofern die Quelle TileWMS ist -> kann getFeatureInfo abgerufen werden 
//                 const url = source?.getFeatureInfoUrl(                             // mit der Eventkoordinate, der aktuellen Auflösung/Kartenausschnitt, dem CRS und dem Format für die Ausgabe 
//                     evt.coordinate,
//                     viewResolution,
//                     'EPSG:3857',
//                     { 'INFO_FORMAT': 'application/json' }                          
//                 );
//                 // console.log(url)  
        
//                 if (url) {
//                     fetch(url)
//                         .then((response) => response.json())
//                         .then((responseObject) => {
//                             console.log(responseObject);
//                             if (responseObject.features && responseObject.features.length > 0) {
//                                 const grayIndex = responseObject.features[0].properties.GRAY_INDEX;
//                                 console.log(grayIndex);
//                                 setValue(`${grayIndex}`); /*GRAY_INDEX: */
//                             }
//                         })
//                         .catch(error => {
                            
//                             console.log('my error is ', error);
//                             alert('Sorry, es ist ein Fehler aufgetreten') // TODO Show user an error -> kann man sicherlich noch etwas schöner gestalten 
//                         });
//                 }
//                 }
//                 };
//             }
//         }
            
            

//         map.on('singleclick', handleClick); //

//         return () => {
//             map.un('singleclick', handleClick); // TODO should be unregister something if the component unmounts?
//         };
        
        
//     }, [map]); // TODO what happens if the map prop has changed?
    
        
//     return (
//             <div id='info' className ='info'>Value: {value} </div>            
//     )
// }


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