
import React, { useState, useEffect } from 'react';
import { Slider } from 'antd';

import { Layer } from '../../../types/types';

export type SliderProps = {
    group: Layer[];
    groupName: string;
    checked: boolean;
    previousIndex: number | null; // previousIndex als Prop übergeben
}

export default function RasterSlider({ group, groupName, checked, previousIndex }: SliderProps) {
    const [inputValue, setInputValue] = useState<number | null>(0);

    useEffect(() => {
        if (checked) {
            const initialIndex = group.findIndex(layer => layer.year === 2021);
            setInputValue(previousIndex !== null ? previousIndex : initialIndex);
        }
    }, [group, checked, previousIndex]);

    useEffect(() => {
        if (checked) {
            group.forEach((layer, index) => {
                if (index === inputValue) {
                    layer.layer.setVisible(true);
                } else {
                    layer.layer.setVisible(false);
                }
            });
        } else {
            group.forEach(layer => layer.layer.setVisible(false));
        }
    }, [checked, group, inputValue]);

    const handleChange = (newValue: number) => {
        if (checked && newValue !== inputValue) {
            setInputValue(newValue);
        }
    };

    const years = group.map(layer => layer.year);

    const marks: { [key: number]: React.ReactNode } = years.reduce<{ [key: number]: React.ReactNode }>((acc, year, index) => {
        const shortYear = year?.toString().slice(-2);
        acc[index] = (
            <span>
                <sup>'</sup>
                {shortYear}
            </span>
        );
        return acc;
    }, {});

    const minYear = years.length > 0 ? years[0] : 0;
    const maxYear = years.length > 0 ? years[years.length - 1] : 0;

    return (
        <div>
            <h4 style={{ fontWeight: 'normal' }}>Jahresmittelwerte {groupName}<br />von {minYear} bis {maxYear}</h4>
            <Slider
                value={inputValue !== null ? inputValue : 0}
                onChange={handleChange}
                included={false}
                min={0}
                max={years.length - 1}
                marks={marks}
                style={{ width: '250px' }} />
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import Map from 'ol/Map';
import { Tree } from 'antd';
import RasterSlider from '../Slider_RasterData/slider'; 
import InfoIcon from '../LayerGroupInfo/layerGroupInfo';
import Legende from '../Legende/legendSlider';

export type LayerTreeSliderProps = {
    map: Map;
}

export default function LayerTreeSlider({ map }: LayerTreeSliderProps) {
    const [layerGroups, setLayerGroups] = useState<{ [groupName: string]: any[] }>({});
    const [checkedGroups, setCheckedGroups] = useState<string[]>([]);
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
    const [previousIndex, setPreviousIndex] = useState<number | null>(null); // previousIndex-Zustand für LayerTreeSlider

    useEffect(() => {
        const layers = map.getLayers().getArray();
        const reversedLayers = layers.slice().reverse();
        const updatedLayerGroups: { [groupName: string]: any[] } = {};

        reversedLayers.forEach(layer => {
            const groupName = layer.get('groupName');
            const enableSlider = layer.get('enableSlider');

            if (groupName && enableSlider === true) {
                if (!updatedLayerGroups[groupName]) {
                    updatedLayerGroups[groupName] = [];
                }

                updatedLayerGroups[groupName].push({
                    name: layer.get('name'),
                    title: layer.get('title'),
                    visible: layer.get('visible') || false,
                    info: layer.get('info') || false,
                    infoText: layer.get('infoText') || false,
                    infoTextTitle: layer.get('infoTextTitle') || false,
                    year: layer.get('year'),
                    enableSlider: enableSlider || false,
                    queryable: layer.get('queryable') || false, 
                    layerType: layer.get('layerType'),
                    layer: layer,
                    urlLegend: layer.get('urlLegend'),
                    legend: layer.get('legend'),
                });
            }
        });

        setLayerGroups(updatedLayerGroups);
    }, [map]);

    const onCheck = (checkedKeys: React.Key[] | { checked: React.Key[]; }) => {
        const checkedKeysArray = Array.isArray(checkedKeys) ? checkedKeys.map(key => String(key)) : checkedKeys.checked.map(key => String(key));
        const checkedKeyArray = [checkedKeysArray[checkedKeysArray.length - 1]];

        setCheckedGroups(checkedKeyArray);

        const newExpandedGroups = [...expandedGroups];
        checkedKeyArray.forEach(groupName => {
            if (!newExpandedGroups.includes(groupName)) {
                newExpandedGroups.push(groupName);
            }
        });
        setExpandedGroups(newExpandedGroups);
    };

    useEffect(() => {
        const uncheckedGroups = Object.keys(layerGroups).filter(groupName => !checkedGroups.includes(groupName));
        uncheckedGroups.forEach(groupName => {
            layerGroups[groupName].forEach(layerInfo => {
                layerInfo.layer.setVisible(false);
            });
        });
    }, [checkedGroups, layerGroups]);

    const treeData = Object.keys(layerGroups).map(groupName => ({
        title: (
            <>
                {groupName}
                <InfoIcon infoTextTitle={layerGroups[groupName][0].infoTextTitle} infoText={layerGroups[groupName][0].infoText} />
            </>
        ),
        key: groupName,
        children: [{
            title: (
                <>
                    <RasterSlider
                        group={layerGroups[groupName]}
                        groupName={groupName}
                        checked={checkedGroups.includes(groupName)}
                        previousIndex={previousIndex} // Übergeben Sie previousIndex an RasterSlider
                    />
                    <Legende
                        group={layerGroups[groupName]}
                        groupName={groupName}
                        checked={checkedGroups.includes(groupName)}
                    />
                </>
            ),
            key: `slider_${groupName}`,
            checkable: false,
        }],
    }));

    return (
        <Tree
            checkable
            selectable={false}
            treeData={treeData}
            checkedKeys={checkedGroups}
            expandedKeys={expandedGroups}
            onCheck={onCheck}
            onExpand={(expandedKeys) => setExpandedGroups(expandedKeys as string[])}
        />
    );
}



// Measurement

// // import Draw from 'ol/interaction/Draw.js';
// // import Map from 'ol/Map.js';
// // import Overlay from 'ol/Overlay.js';
// import View from 'ol/View.js';
// // import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
// // import {LineString, Polygon} from 'ol/geom.js';
// import {OSM, Vector as VectorSource} from 'ol/source.js';
// import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
// // import {getArea, getLength} from 'ol/sphere.js';
// // import {unByKey} from 'ol/Observable.js';

//           // const raster = new TileLayer({
//           //   source: new OSM(),
//           // });

//           // const source = new VectorSource();

//           // const vector = new VectorLayer({
//           //   source: source,
//           //   style: {
//           //     'fill-color': 'rgba(255, 255, 255, 0.2)',
//           //     'stroke-color': '#ffcc33',
//           //     'stroke-width': 2,
//           //     'circle-radius': 7,
//           //     'circle-fill-color': '#ffcc33',
//           //   },
//           // });

// /**
//  * Currently drawn feature.
//  * @type {import("../src/ol/Feature.js").default}
//  */
// let sketch;

// /**
//  * The help tooltip element.
//  * @type {HTMLElement}
//  */
// let helpTooltipElement;

// /**
//  * Overlay to show the help messages.
//  * @type {Overlay}
//  */
// let helpTooltip;

// /**
//  * The measure tooltip element.
//  * @type {HTMLElement}
//  */
// let measureTooltipElement;

// /**
//  * Overlay to show the measurement.
//  * @type {Overlay}
//  */
// let measureTooltip;

// /**
//  * Message to show when the user is drawing a polygon.
//  * @type {string}
//  */
// const continuePolygonMsg = 'Click to continue drawing the polygon';

// /**
//  * Message to show when the user is drawing a line.
//  * @type {string}
//  */
// const continueLineMsg = 'Click to continue drawing the line';

// /**
//  * Handle pointer move.
//  * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
//  */
// const pointerMoveHandler = function (evt) {
//   if (evt.dragging) {
//     return;
//   }
//   /** @type {string} */
//   let helpMsg = 'Click to start drawing';

//   if (sketch) {
//     const geom = sketch.getGeometry();
//     if (geom instanceof Polygon) {
//       helpMsg = continuePolygonMsg;
//     } else if (geom instanceof LineString) {
//       helpMsg = continueLineMsg;
//     }
//   }

//   helpTooltipElement.innerHTML = helpMsg;
//   helpTooltip.setPosition(evt.coordinate);

//   helpTooltipElement.classList.remove('hidden');
// };



// map.on('pointermove', pointerMoveHandler);

// map.getViewport().addEventListener('mouseout', function () {
//   helpTooltipElement.classList.add('hidden');
// });

// const typeSelect = document.getElementById('type');

// let draw; // global so we can remove it later

// /**
//  * Format length output.
//  * @param {LineString} line The line.
//  * @return {string} The formatted length.
//  */
// // const formatLength = function (line) {
// //   const length = getLength(line);
// //   let output;
// //   if (length > 100) {
// //     output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
// //   } else {
// //     output = Math.round(length * 100) / 100 + ' ' + 'm';
// //   }
// //   return output;
// // };

// /**
//  * Format area output.
//  * @param {Polygon} polygon The polygon.
//  * @return {string} Formatted area.
//  */
// // const formatArea = function (polygon) {
// //   const area = getArea(polygon);
// //   let output;
// //   if (area > 10000) {
// //     output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
// //   } else {
// //     output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
// //   }
// //   return output;
// };

// // const style = new Style({
// //   fill: new Fill({
// //     color: 'rgba(255, 255, 255, 0.2)',
// //   }),
// //   stroke: new Stroke({
// //     color: 'rgba(0, 0, 0, 0.5)',
// //     lineDash: [10, 10],
// //     width: 2,
// //   }),
// //   image: new CircleStyle({
// //     radius: 5,
// //     stroke: new Stroke({
// //       color: 'rgba(0, 0, 0, 0.7)',
// //     }),
// //     fill: new Fill({
// //       color: 'rgba(255, 255, 255, 0.2)',
// //     }),
// //   }),
// // });

// function addInteraction() {
//   const type = typeSelect.value == 'area' ? 'Polygon' : 'LineString';
//   draw = new Draw({
//     source: source,
//     type: type,
//     style: function (feature) {
//       const geometryType = feature.getGeometry().getType();
//       if (geometryType === type || geometryType === 'Point') {
//         return style;
//       }
//     },
//   });
//   map.addInteraction(draw);

//   createMeasureTooltip();
//   createHelpTooltip();

//   let listener;
//   draw.on('drawstart', function (evt) {
//     // set sketch
//     sketch = evt.feature;

//     /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
//     let tooltipCoord = evt.coordinate;

//     listener = sketch.getGeometry().on('change', function (evt) {
//       const geom = evt.target;
//       let output;
//       if (geom instanceof Polygon) {
//         output = formatArea(geom);
//         tooltipCoord = geom.getInteriorPoint().getCoordinates();
//       } else if (geom instanceof LineString) {
//         output = formatLength(geom);
//         tooltipCoord = geom.getLastCoordinate();
//       }
//       measureTooltipElement.innerHTML = output;
//       measureTooltip.setPosition(tooltipCoord);
//     });
//   });

//   draw.on('drawend', function () {
//     measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
//     measureTooltip.setOffset([0, -7]);
//     // unset sketch
//     sketch = null;
//     // unset tooltip so that a new one can be created
//     measureTooltipElement = null;
//     createMeasureTooltip();
//     unByKey(listener);
//   });
// }

// /**
//  * Creates a new help tooltip
//  */
// function createHelpTooltip() {
//   if (helpTooltipElement) {
//     helpTooltipElement.parentNode.removeChild(helpTooltipElement);
//   }
//   helpTooltipElement = document.createElement('div');
//   helpTooltipElement.className = 'ol-tooltip hidden';
//   helpTooltip = new Overlay({
//     element: helpTooltipElement,
//     offset: [15, 0],
//     positioning: 'center-left',
//   });
//   map.addOverlay(helpTooltip);
// }

// /**
//  * Creates a new measure tooltip
//  */
// function createMeasureTooltip() {
//   if (measureTooltipElement) {
//     measureTooltipElement.parentNode.removeChild(measureTooltipElement);
//   }
//   measureTooltipElement = document.createElement('div');
//   measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
//   measureTooltip = new Overlay({
//     element: measureTooltipElement,
//     offset: [0, -15],
//     positioning: 'bottom-center',
//     stopEvent: false,
//     insertFirst: false,
//   });
//   map.addOverlay(measureTooltip);
// }

// /**
//  * Let user change the geometry type.
//  */
// typeSelect.onchange = function () {
//   map.removeInteraction(draw);
//   addInteraction();
// };

// addInteraction();
