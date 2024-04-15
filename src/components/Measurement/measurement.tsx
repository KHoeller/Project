
// // Measurement

import React, { useEffect, useState } from 'react';
import Overlay from 'ol/Overlay';
import Draw from 'ol/interaction/Draw';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { LineString } from 'ol/geom';
import { Feature } from 'ol';
import { unByKey } from 'ol/Observable';

type MeasurementProps = {
  map: any,
  source: any,
  active: boolean,
  measureType: 'line' | 'polygon'
};

const Measurement: React.FC<MeasurementProps> = ({ map, source, active }) => {
  const [drawInteraction, setDrawInteraction] = useState<Draw | null>(null);
  const [helpTooltip, setHelpTooltip] = useState<Overlay | null>(null);
  const [measureTooltip, setMeasureTooltip] = useState<Overlay | null>(null);

  useEffect(() => {
    let draw: Draw | null = null;
    let helpTooltipElement: HTMLElement | null = null;
    let measureTooltipElement: HTMLElement | null = null;

    const continueLineMsg = 'Click to continue drawing the line';

    const pointerMoveHandler = (evt: any) => {
      if (evt.dragging) {
        return;
      }

      let helpMsg = 'Click to start drawing';

      if (draw?.sketchFeature_) {
        const geom = draw?.sketchFeature_.getGeometry();
        if (geom instanceof LineString) {
          helpMsg = continueLineMsg;
        }
      }

      helpTooltipElement!.innerHTML = helpMsg;
      helpTooltip!.setPosition(evt.coordinate);

      helpTooltipElement!.classList.remove('hidden');
    };

    if (active) {
      draw = new Draw({
        source: source,
        type: 'LineString',
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2,
          }),
          image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
              color: 'rgba(0, 0, 0, 0.7)',
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.2)',
            }),
          }),
        }),
      });

      map.addInteraction(draw);

      draw.on('drawstart', (evt) => {
        const feature = evt.feature as Feature<LineString>;

        const geometry = feature.getGeometry();

        const listener = geometry.on('change', (evt) => {
          const geom = evt.target as LineString;
          const output = formatLength(geom);

          const tooltipCoord = geom.getLastCoordinate();
          measureTooltipElement!.innerHTML = output;
          measureTooltip!.setPosition(tooltipCoord);
        });

        draw!.on('drawend', () => {
          measureTooltipElement!.className = 'ol-tooltip ol-tooltip-static';
          measureTooltip!.setOffset([0, -7]);

          unByKey(listener);
        });
      });

      const helpTooltipElement = document.createElement('div');
      helpTooltipElement.className = 'ol-tooltip hidden';
      const helpTooltip = new Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left',
      });
      map.addOverlay(helpTooltip);
      setHelpTooltip(helpTooltip);

      const measureTooltipElement = document.createElement('div');
      measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
      const measureTooltip = new Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
        stopEvent: false,
        insertFirst: false,
      });
      map.addOverlay(measureTooltip);
      setMeasureTooltip(measureTooltip);

      map.on('pointermove', pointerMoveHandler);

      setDrawInteraction(draw);
    } else {
      source.clear();
      map.removeOverlay(measureTooltip);
    }

    return () => {
      if (draw) {
        map.removeInteraction(draw);
      }
      if (helpTooltip) {
        map.removeOverlay(helpTooltip);
      }
      if (measureTooltip) {
        map.removeOverlay(measureTooltip);
      }
      map.un('pointermove', pointerMoveHandler);
    };
  }, [map, source, active]);

  const formatLength = (line: LineString) => {
    const length = line.getLength();
    return length > 1000 ? `${(length / 1000).toFixed(2)} km` : `${length.toFixed(2)} m`;
  };

  return null;
};

export default Measurement;






// import React, { useEffect, useState } from 'react';
// import Overlay from 'ol/Overlay';
// import Draw from 'ol/interaction/Draw';
// import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
// import { LineString, Polygon } from 'ol/geom';
// import { unByKey } from 'ol/Observable';
// import { Feature, MapBrowserEvent } from 'ol';

// export type MeasurementProps = {
//   map: any, // Hier den genauen Typ von 'map' spezifizieren
//   source: any, // Hier den genauen Typ von 'source' spezifizieren
//   active: boolean,
// };

// export default function Measurement({ map, source, active }: MeasurementProps) {



//   useEffect(() => {
//     let draw: Draw;
//     let sketch: Feature<LineString> | undefined;
//     let helpTooltipElement: HTMLElement;
//     let helpTooltip : Overlay;
//     let measureTooltipElement: HTMLElement;
//     let measureTooltip: Overlay;
//     let drawLine; 

//     const continueLineMsg = 'Click to continue drawing the line';

//     const pointerMoveHandler = (evt: MapBrowserEvent<any>) => {
//       if (evt.dragging) {
//         return;
//       }

//       let helpMsg = 'Click to start drawing';

//       if (sketch) {
//         const geom = sketch.getGeometry();
//         if (geom instanceof LineString) {
//             helpMsg = continueLineMsg;
//         }
//       }

//       helpTooltipElement.innerHTML = helpMsg;
//       helpTooltip.setPosition(evt.coordinate);

//       helpTooltipElement.classList.remove('hidden');
//     };

//     if (active) {

//       map.on('pointermove', pointerMoveHandler);

//       const createHelpTooltip = () => {
//         helpTooltipElement = document.createElement('div');
//         helpTooltipElement.className = 'ol-tooltip hidden';
//         helpTooltip = new Overlay({
//           element: helpTooltipElement,
//           // offset: [15, 0],
//           // positioning: 'center-left',
//           offset: [0, -15],
//           positioning: 'center-left',
//           // stopEvent: false,
//           // insertFirst: false,
//         });
//         map.addOverlay(helpTooltip);
//       };

//       const createMeasureTooltip = () => {
//         measureTooltipElement = document.createElement('div');
//         measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
//         measureTooltip = new Overlay({
//           element: measureTooltipElement,
//           offset: [0, -15],
//           positioning: 'bottom-center',
//           stopEvent: false,
//           insertFirst: false,
//         });
//         map.addOverlay(measureTooltip);
//       };

//       const addInteraction = () => {
//         draw = new Draw({
//           source: source,
//           type: 'LineString',
//           style: new Style({
//             fill: new Fill({
//               color: 'rgba(255, 255, 255, 0.2)',
//             }),
//             stroke: new Stroke({
//               color: 'rgba(0, 0, 0, 0.5)',
//               lineDash: [10, 10],
//               width: 2,
//             }),
//             image: new CircleStyle({
//               radius: 5,
//               stroke: new Stroke({
//                 color: 'rgba(0, 0, 0, 0.7)',
//               }),
//               fill: new Fill({
//                 color: 'rgba(255, 255, 255, 0.2)',
//               }),
//             }),
//           }),
//         });
//         map.addInteraction(draw);

//         drawLine = draw.on('drawstart', (evt) => {
//           const feature = evt.feature as Feature<LineString>;

//           if (!feature || !feature.getGeometry()) return;

//           const geometry = feature.getGeometry();

//           const listener = geometry.on('change', (evt) => {
//             const geom = evt.target;
//             const output = formatLength(geom);

//             const tooltipCoord = geom.getLastCoordinate();
//             measureTooltipElement.innerHTML = output;
//             measureTooltip.setPosition(tooltipCoord);
//           });

//           draw.on('drawend', () => {
//             measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
//             measureTooltip.setOffset([0, -7]);

//             unByKey(listener);
//           });
//         });
//       };

//       createHelpTooltip();
//       createMeasureTooltip();
//       addInteraction();

//   //     return () => {
//   //       map.removeInteraction(draw);
//   //       map.removeOverlay(helpTooltip);
//   //       map.removeOverlay(measureTooltip);
//   //       map.un('pointermove', pointerMoveHandler);
//   //     };
//   //   }
//   // }, [map, source, active]);
//     return () => {
//       if (draw) {
//         map.removeInteraction(draw);
//       }
//       map.removeOverlay(helpTooltip);
//       map.removeOverlay(measureTooltip);
//       map.un('pointermove', pointerMoveHandler);
//       map.remove(drawLine);
//     };
//   }}, [map, source, active]);

//   const formatLength = (line: LineString) => {
//     const length = line.getLength();
//     let output;
//     if (length > 100) {
//       output = (length / 1000).toFixed(2) + ' km';
//     } else {
//       output = length.toFixed(2) + ' m';
//     }
//     return output;
//   };

//   return null;
// }

// import Draw from 'ol/interaction/Draw.js';
// import Map from 'ol/Map.js';
// import Overlay from 'ol/Overlay.js';
// import View from 'ol/View.js';
// import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
// import {LineString, Polygon} from 'ol/geom.js';
// import {OSM, Vector as VectorSource} from 'ol/source.js';
// import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
// import {getArea, getLength} from 'ol/sphere.js';
// import {unByKey} from 'ol/Observable.js';
// import { MapBrowserEvent } from 'ol';
// import React, { useEffect, useState } from 'react';

// export type MeasurementProps = {
//   map: Map,
//   source: VectorSource,
//   active: boolean,
// }

// export default function Measurement ({map, source, active}: MeasurementProps){
  
//   console.log('active:', active);
//   useEffect(() => {
//         console.log('measurement: mount');

//         return () => {
//             console.log('measurement: unmount')
//         };
//       }, []);

// useEffect(() => {
//   if(active){
    

//     let sketch;

//     let helpTooltipElement: HTMLElement;

//     let helpTooltip: Overlay;

//     let measureTooltipElement: HTMLElement;

//     let measureTooltip: Overlay;
    
//     const continuePolygonMsg = 'Click to continue drawing the polygon';

//     const continueLineMsg = 'Click to continue drawing the line';



//     const pointerMoveHandler = function (evt: any /*MapBrowserEvent*/) {
//       if (evt.dragging) {
//         return;
//       }

//       let helpMsg: string = 'Click to start drawing';

//       if (sketch) {
//         const geom = sketch.getGeometry();
//         if (geom instanceof Polygon) {
//           helpMsg = continuePolygonMsg;
//         } else if (geom instanceof LineString) {
//           helpMsg = continueLineMsg;
//         }
//       }

//       helpTooltipElement.innerHTML = helpMsg;
//       helpTooltip.setPosition(evt.coordinate);

//       helpTooltipElement.classList.remove('hidden');
//     };

//     map.on('pointermove', pointerMoveHandler);

//     map.getViewport().addEventListener('mouseout', function () {
//       helpTooltipElement.classList.add('hidden');
//     });

//     const typeSelect = document.getElementById('type');

//     let draw; 


//     const formatLength = function (line) {
//       const length = getLength(line);
//       let output;
//       if (length > 100) {
//         output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
//       } else {
//         output = Math.round(length * 100) / 100 + ' ' + 'm';
//       }
//       return output;
//     };

//     const style = new Style({
//       fill: new Fill({
//         color: 'rgba(255, 255, 255, 0.2)',
//       }),
//       stroke: new Stroke({
//         color: 'rgba(0, 0, 0, 0.5)',
//         lineDash: [10, 10],
//         width: 2,
//       }),
//       image: new CircleStyle({
//         radius: 5,
//         stroke: new Stroke({
//           color: 'rgba(0, 0, 0, 0.7)',
//         }),
//         fill: new Fill({
//           color: 'rgba(255, 255, 255, 0.2)',
//         }),
//       }),
//     });

//     function addInteraction() {

//       draw = new Draw({
//         source: source,
//         type: 'LineString', //type
//         style: style

//       });
//       map.addInteraction(draw);

//       let listener;
//       draw.on('drawstart', function (evt) {
//         sketch = evt.feature;

//         listener = sketch.getGeometry().on('change', function (evt) {
//           const geom = evt.target;
//           let output = formatLength(geom);

//           const tooltipCoord = geom.getLastCoordinate();
//           measureTooltipElement.innerHTML = output;
//           measureTooltip.setPosition(tooltipCoord);
//         });
//       });

//       draw.on('drawend', function () {
//         measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
//         measureTooltip.setOffset([0, -7]);

//         unByKey(listener);
//       });
//     }


//     function createHelpTooltip() {
//       helpTooltipElement = document.createElement('div');
//       helpTooltipElement.className = 'ol-tooltip hidden';
//       helpTooltip = new Overlay({
//         element: helpTooltipElement,
//         offset: [15, 0],
//         positioning: 'center-left',
//       });
//       map.addOverlay(helpTooltip);
//     }
    
//     function createMeasureTooltip() {
//       measureTooltipElement = document.createElement('div');
//       measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
//       measureTooltip = new Overlay({
//         element: measureTooltipElement,
//         offset: [0, -15],
//         positioning: 'bottom-center',
//         stopEvent: false,
//         insertFirst: false,
//       });
//       map.addOverlay(measureTooltip);
//     };


//     addInteraction();
//     createHelpTooltip();
//     createMeasureTooltip();
    
//     return () => {
//       map.removeInteraction(draw);
//     };
//   }
// }, [map]); 
  
//   return (
//     <div>
      
//     </div>
//   )

// }



  

  


  
 





// // Measurement

// import Draw from 'ol/interaction/Draw.js';
// import Map from 'ol/Map.js';
// import Overlay from 'ol/Overlay.js';
// import View from 'ol/View.js';
// import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
// import {LineString, Polygon} from 'ol/geom.js';
// import {OSM, Vector as VectorSource} from 'ol/source.js';
// import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
// import {getArea, getLength} from 'ol/sphere.js';
// import {unByKey} from 'ol/Observable.js';
// import { MapBrowserEvent } from 'ol';
// import React, { useEffect, useState } from 'react';

// export type MeasurementProps = {
//   map: Map,
//   source: VectorSource,
//   active: boolean,
// }

// export default function Measurement ({map, source, active}: MeasurementProps){
  
//   console.log('active:', active);
  
// if(active){
//   useEffect(() => {
//     console.log('measurement: mount');

//     return () => {
//         console.log('measurement: unmount')
//     };
// }, []);

// useEffect(() => {

// })

//   // const source = new VectorSource();

//   // const vector = new VectorLayer({
//   //   source: source,
//   //   style: {
//   //     'fill-color': 'rgba(255, 255, 255, 0.2)',
//   //     'stroke-color': '#ffcc33',
//   //     'stroke-width': 2,
//   //     'circle-radius': 7,
//   //     'circle-fill-color': '#ffcc33',
//   //   },
//   // });

//   // map.addLayer(vector) // zur Map erstellten Vector-Layer hinzufügen

//   useEffect(() => {
//     addInteraction();
//     createHelpTooltip();
//     createMeasureTooltip();
    
//     return () => {
//       map.removeInteraction(draw);
//     };
//   }, [map]);

//   let sketch;

//   let helpTooltipElement: HTMLElement;

//   let helpTooltip: Overlay;

//   let measureTooltipElement: HTMLElement;

//   let measureTooltip: Overlay;

//   const continuePolygonMsg = 'Click to continue drawing the polygon';

//   const continueLineMsg = 'Click to continue drawing the line';


//   const pointerMoveHandler = function (evt: any /*MapBrowserEvent*/) {
//     if (evt.dragging) {
//       return;
//     }

//     let helpMsg: string = 'Click to start drawing';

//     if (sketch) {
//       const geom = sketch.getGeometry();
//       if (geom instanceof Polygon) {
//         helpMsg = continuePolygonMsg;
//       } else if (geom instanceof LineString) {
//         helpMsg = continueLineMsg;
//       }
//     }

//     helpTooltipElement.innerHTML = helpMsg;
//     helpTooltip.setPosition(evt.coordinate);

//     helpTooltipElement.classList.remove('hidden');
//   };

//   map.on('pointermove', pointerMoveHandler);

//   map.getViewport().addEventListener('mouseout', function () {
//     helpTooltipElement.classList.add('hidden');
//   });

//   const typeSelect = document.getElementById('type');

//   let draw; // global so we can remove it later

//   /**
//    * Format length output.
//    * @param {LineString} line The line.
//    * @return {string} The formatted length.
//    */
//   const formatLength = function (line) {
//     const length = getLength(line);
//     let output;
//     if (length > 100) {
//       output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
//     } else {
//       output = Math.round(length * 100) / 100 + ' ' + 'm';
//     }
//     return output;
//   };

//   /**
//    * Format area output.
//    * @param {Polygon} polygon The polygon.
//    * @return {string} Formatted area.
//    */
//   // const formatArea = function (polygon) {
//   //   const area = getArea(polygon);
//   //   let output;
//   //   if (area > 10000) {
//   //     output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
//   //   } else {
//   //     output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
//   //   }
//   //   return output;
//   // };

//   const style = new Style({
//     fill: new Fill({
//       color: 'rgba(255, 255, 255, 0.2)',
//     }),
//     stroke: new Stroke({
//       color: 'rgba(0, 0, 0, 0.5)',
//       lineDash: [10, 10],
//       width: 2,
//     }),
//     image: new CircleStyle({
//       radius: 5,
//       stroke: new Stroke({
//         color: 'rgba(0, 0, 0, 0.7)',
//       }),
//       fill: new Fill({
//         color: 'rgba(255, 255, 255, 0.2)',
//       }),
//     }),
//   });

//   function addInteraction() {
//     // const type = /*typeSelect?.value == 'area' ? 'Polygon' :*/ 'LineString';
//     // console.log('type:', type);
//     draw = new Draw({
//       source: source,
//       type: 'LineString', //type
//       style: style
//       // style: function (feature) {
//       //   const geometryType = feature.getGeometry().getType();
//       //   if (geometryType === type || geometryType === 'Point') {
//       //     return style;
//         // }
//       // },
//     });
//     map.addInteraction(draw);

//     // createMeasureTooltip();
//     // createHelpTooltip();

//     let listener;
//     draw.on('drawstart', function (evt) {
//       // set sketch
//       sketch = evt.feature;

//       // /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
//       // let tooltipCoord = evt.coordinate;

//       listener = sketch.getGeometry().on('change', function (evt) {
//         const geom = evt.target;
//         let output = formatLength(geom);

//         const tooltipCoord = geom.getLastCoordinate();
//         measureTooltipElement.innerHTML = output;
//         measureTooltip.setPosition(tooltipCoord);
//         // if (geom instanceof Polygon) {
//         //   output = formatArea(geom);
//         //   tooltipCoord = geom.getInteriorPoint().getCoordinates();
//         // } else if (geom instanceof LineString) {
//         //   output = formatLength(geom);
//         //   tooltipCoord = geom.getLastCoordinate();
//         // }
//         // measureTooltipElement.innerHTML = output;
//         // measureTooltip.setPosition(tooltipCoord);
//       });
//     });

//     draw.on('drawend', function () {
//       measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
//       measureTooltip.setOffset([0, -7]);
//       // // unset sketch
//       // sketch = null;
//       // unset tooltip so that a new one can be created
//       // measureTooltipElement = null;
//       // createMeasureTooltip();
//       unByKey(listener);
//     });
//   }

//   /**
//    * Creates a new help tooltip
//    */
//   function createHelpTooltip() {
//     helpTooltipElement = document.createElement('div');
//     helpTooltipElement.className = 'ol-tooltip hidden';
//     helpTooltip = new Overlay({
//       element: helpTooltipElement,
//       offset: [15, 0],
//       positioning: 'center-left',
//     });
//     map.addOverlay(helpTooltip);
//     // if (helpTooltipElement) {
//     //   helpTooltipElement.parentNode.removeChild(helpTooltipElement);
//     // }
//     // helpTooltipElement = document.createElement('div');
//     // helpTooltipElement.className = 'ol-tooltip hidden';
//     // helpTooltip = new Overlay({
//     //   element: helpTooltipElement,
//     //   offset: [15, 0],
//     //   positioning: 'center-left',
//     // });
//     // map.addOverlay(helpTooltip);
//   }

//   /**
//    * Creates a new measure tooltip
//    */
//   function createMeasureTooltip() {
//     measureTooltipElement = document.createElement('div');
//     measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
//     measureTooltip = new Overlay({
//       element: measureTooltipElement,
//       offset: [0, -15],
//       positioning: 'bottom-center',
//       stopEvent: false,
//       insertFirst: false,
//     });
//     map.addOverlay(measureTooltip);
//   };


//     // if (measureTooltipElement) {
//     //   measureTooltipElement.parentNode.removeChild(measureTooltipElement);
//     // }
//     // measureTooltipElement = document.createElement('div');
//     // measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
//     // measureTooltip = new Overlay({
//     //   element: measureTooltipElement,
//     //   offset: [0, -15],
//     //   positioning: 'bottom-center',
//     //   stopEvent: false,
//     //   insertFirst: false,
//     // });
//     // map.addOverlay(measureTooltip);
//   // }

//   /**
//    * Let user change the geometry type.
//    */
//   // typeSelect.onchange = function () {
//   //   map.removeInteraction(draw);
//   //   addInteraction();
//   // };

//   // function formatLength(line) {
//   //   const length = getLength(line);
//   //   return length > 1000 ? (length / 1000).toFixed(2) + ' km' : length.toFixed(2) + ' m';
//   // }

//   // addInteraction();
//   return(
//     <div>
      
//     </div>
//   )
// }
// }