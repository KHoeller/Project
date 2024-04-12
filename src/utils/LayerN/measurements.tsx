// import { LineString, Polygon } from 'ol/geom';
// import { getArea, getLength } from 'ol/sphere';

// export const formatLength = (line: LineString) => {
//     const length = getLength(line);
//     return length > 1000 ? `${(length / 1000).toFixed(2)} km` : `${length.toFixed(2)} m`;
// };

// export const formatArea = (polygon: Polygon) => {
//     const area = getArea(polygon);
//     return area > 10000 ? `${(area / 1000000).toFixed(2)} km²` : `${area.toFixed(2)} m²`;
// };



// export default function MeasureArea () {
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

//                 // Messen beenden
//                 map.removeInteraction(drawRef.current);
//                 map.removeOverlay(measureTooltipRef.current);
//             });

//             return () => {
//                 map.removeLayer(vectorLayer);
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
// }