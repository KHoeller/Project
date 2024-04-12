
// // Component Map: Map + Headline (+ css for ol-zoom)


// import React, { useEffect, useRef, useState } from 'react';
// import Map from 'ol/Map';
// import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector';
// import Draw from 'ol/interaction/Draw';
// import Overlay from 'ol/Overlay';
// import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
// import { LineString, Polygon } from 'ol/geom';
// import { getArea, getLength } from 'ol/sphere';

// import './Map.css';

// export type MapCompProps = {
//     map: Map;
// };

// export default function MapComp({ map }: MapCompProps) {
//     const vectorSourceRef = useRef<VectorSource>(new VectorSource());
//     const [drawType, setDrawType] = useState<string | null>(null); // State für den ausgewählten Zeichnungstyp
//     const drawRef = useRef<Draw | null>(null);
//     const measureTooltipRef = useRef<Overlay | null>(null);
//     const sketchRef = useRef<any>(null);

//     useEffect(() => {
//         map.setTarget('map');
//     }, [map]);

//     useEffect(() => {
//         if (drawType) {
//             const vectorLayer = new VectorLayer({
//                 source: vectorSourceRef.current,
//                 style: new Style({
//                     fill: new Fill({
//                       color: 'rgba(255, 255, 255, 0.2)',
//                     }),
//                     stroke: new Stroke({
//                       color: 'rgba(0, 0, 0, 0.5)',
//                       lineDash: [10, 10],
//                       width: 2,
//                     }),
//                     image: new CircleStyle({
//                       radius: 5,
//                       stroke: new Stroke({
//                         color: 'rgba(0, 0, 0, 0.7)',
//                       }),
//                       fill: new Fill({
//                         color: 'rgba(255, 255, 255, 0.2)',
//                       }),
//                     }),
//                   })
//             });

//             map.addLayer(vectorLayer);

//             const draw = new Draw({
//                 source: vectorSourceRef.current,
//                 type: drawType as any, // 'LineString' or 'Polygon'
//             });
//             map.addInteraction(draw);
//             drawRef.current = draw;

//             const measureTooltipElement = document.createElement('div');
//             measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
//             const measureTooltip = new Overlay({
//                 element: measureTooltipElement,
//                 offset: [0, -15],
//                 positioning: 'bottom-center',
//                 stopEvent: false,
//                 insertFirst: false,
//             });
//             map.addOverlay(measureTooltip);
//             measureTooltipRef.current = measureTooltip;

//             let listener: any;

//             draw.on('drawstart', (event: any) => {
//                 sketchRef.current = event.feature;

//                 listener = sketchRef.current.getGeometry().on('change', (evt: any) => {
//                     const geom = evt.target;
//                     let output;
//                     if (geom instanceof Polygon) {
//                         output = formatArea(geom);
//                     } else if (geom instanceof LineString) {
//                         output = formatLength(geom);
//                     }
//                     measureTooltipElement.innerHTML = output;
//                     measureTooltip.setPosition(geom.getLastCoordinate());
//                 });
//             });

//             draw.on('drawend', () => {
//                 measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
//                 measureTooltip.setOffset([0, -7]);
//                 sketchRef.current = null;
//                 measureTooltipElement.innerHTML = '';
//             });

//             return () => {
//                 map.removeLayer(vectorLayer);
//                 map.removeInteraction(draw);
//                 if (measureTooltipRef.current) {
//                     map.removeOverlay(measureTooltipRef.current);
//                 }
//             };
//         }
//     }, [map, drawType]);

//     const toggleDrawType = (type: string) => {
//         if (drawRef.current) {
//             map.removeInteraction(drawRef.current);
//         }
//         setDrawType(type);
//     };

//     const formatLength = function (line) {
//         const length = getLength(line);
//         let output;
//         if (length > 100) {
//           output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
//         } else {
//           output = Math.round(length * 100) / 100 + ' ' + 'm';
//         }
//         return output;
//       };

//       const formatArea = function (polygon) {
//         const area = getArea(polygon);
//         let output;
//         if (area > 10000) {
//           output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
//         } else {
//           output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
//         }
//         return output;
//       };

//     return (
//         <div className='mapContainer'>
//             <h1 className='map-heading'>Umwelt-Gesundheitskarte für Deutschland</h1>
//             <div className='buttonContainer'>
//                 <button onClick={() => toggleDrawType('LineString')}>Measure Line</button>
//                 <button onClick={() => toggleDrawType('Polygon')}>Measure Polygon</button>
//             </div>
//             <div id='map' className='map'></div>
//         </div>
//     );
// }

// import React, { useEffect, useRef } from 'react';
// import Map from 'ol/Map';
// import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector';
// import Draw from 'ol/interaction/Draw';
// import Overlay from 'ol/Overlay';
// import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
// import { LineString, Polygon } from 'ol/geom';
// import { getArea, getLength } from 'ol/sphere';

// import './Map.css';

// export type MapCompProps = {
//     map: Map;
//     isLengthButtonClicked: boolean;
//     isAreaButtonClicked: boolean;
// };

// export default function MapComp({ map, isLengthButtonClicked, isAreaButtonClicked}: MapCompProps) {
//     const vectorSourceRef = useRef<VectorSource>(new VectorSource());
//     const measureTooltipRef = useRef<Overlay | null>(null);
//     const sketchRef = useRef<any>(null); // Variable zum Speichern des aktuell gezeichneten Features
//     const drawRef = useRef<Draw | null>(null);

//     useEffect(() => {
//         map.setTarget('map');
//     }, [map]);

//     useEffect(() => {
//         if (isLengthButtonClicked) {
//             const vectorLayer = new VectorLayer({
//                 source: vectorSourceRef.current,
//                 style: new Style({
//                     fill: new Fill({
//                         color: 'rgba(255, 255, 255, 0.2)',
//                     }),
//                     stroke: new Stroke({
//                         color: 'rgba(0, 0, 0, 0.5)',
//                         width: 2,
//                     }),
//                     image: new CircleStyle({
//                         radius: 5,
//                         stroke: new Stroke({
//                             color: 'rgba(0, 0, 0, 0.7)',
//                         }),
//                         fill: new Fill({
//                             color: 'rgba(255, 255, 255, 0.2)',
//                         }),
//                     }),
//                 }),
//             });

//             map.addLayer(vectorLayer);

//             const draw = new Draw({
//                 source: vectorSourceRef.current,
//                 type: 'Polygon', // You can change this to 'LineString' for length measurement
//             });
//             map.addInteraction(draw);

            

//             const measureTooltipElement = document.createElement('div');
//             measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
//             const measureTooltip = new Overlay({
//                 element: measureTooltipElement,
//                 offset: [0, -15],
//                 positioning: 'bottom-center',
//                 stopEvent: false,
//                 insertFirst: false,
//             });
//             map.addOverlay(measureTooltip);

//             measureTooltipRef.current = measureTooltip;

//             let listener: any;

//             draw.on('drawstart', (event: any) => {
//                 sketchRef.current = event.feature;

//                 listener = sketchRef.current.getGeometry().on('change', (evt: any) => {
//                     const geom = evt.target;
//                     let output;
//                     if (geom instanceof Polygon) {
//                         output = formatArea(geom);
//                     } else if (geom instanceof LineString) {
//                         output = formatLength(geom);
//                     }
//                     measureTooltipElement.innerHTML = output;
//                     measureTooltip.setPosition(geom.getLastCoordinate());
//                 });
//             });

//             draw.on('drawend', () => {
//                 measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
//                 measureTooltip.setOffset([0, -7]);
//                 sketchRef.current = null;
//                 measureTooltipElement.innerHTML = '';
//             });

//             return () => {
//                 map.removeLayer(vectorLayer);
//                 map.removeInteraction(draw);
//                 if (measureTooltipRef.current) {
//                     map.removeOverlay(measureTooltipRef.current);
//                 }
//             };
//             console.log('Length button clicked:', isLengthButtonClicked);
//         } else {
//             // Fügen Sie hier die Logik ein, um die Messfunktion zu deaktivieren
//             console.log('Length button not clicked:', isLengthButtonClicked);
//         }
//     }, [map, isLengthButtonClicked]);

//     const formatLength = (line: LineString) => {
//         const length = getLength(line);
//         return length > 1000 ? `${(length / 1000).toFixed(2)} km` : `${length.toFixed(2)} m`;
//     };

//     const formatArea = (polygon: Polygon) => {
//         const area = getArea(polygon);
//         return area > 10000 ? `${(area / 1000000).toFixed(2)} km²` : `${area.toFixed(2)} m²`;
//     };

//     return (
//         <div className='mapContainer'>
//             <h1 className='map-heading'>Umwelt-Gesundheitskarte für Deutschland</h1>
//             <div id='map' className='map'></div>
//         </div>
//     );
// }

import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map';




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

//     const vectorSourceRef = useRef<VectorSource>(new VectorSource());

    return (
            <div className='mapContainer'>
              
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

    