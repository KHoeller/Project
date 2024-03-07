
import React from 'react';
import Layers from '/home/khoeller/Dokumente/OpenLayers/src/components/LayerN/LayerN';
import TileWMS from 'ol/source/TileWMS.js';
import './featureInfo.css';
import { MapBrowserEvent } from 'ol';
import Map from 'ol/Map';


export default function Info (evt:MapBrowserEvent<any>, map: Map){
    console.log(evt.coordinate);
    const infoElement = document.getElementById('info')
    if(infoElement) {               
        infoElement.innerHTML = '';
        const viewResolution = evt.map.getView().getResolution() ?? 0;      // aktueller Kartenausschnitt und aktuelle Auflösung um den geclickten Punkt möglichst genau an GeoServer zurückzugeben
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
          
                    let fet = responseObject.features[0].properties.GRAY_INDEX;
                    console.log(fet);
                   
                    infoElement.innerHTML = `GRAY_INDEX: ${fet}`;
                  })
                  .catch(error => {
                    console.log('my error is ', error)                             
                  });
            } 
        }
    }
    
}

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