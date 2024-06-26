
// // Measurement: Area and Line (Vorlage OpenLayers)


import React, { useEffect, useState } from 'react';
import Overlay from 'ol/Overlay';
import Draw from 'ol/interaction/Draw';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { LineString, Polygon } from 'ol/geom';
import { Feature, MapBrowserEvent } from 'ol';
import { unByKey } from 'ol/Observable';
import {getArea, getLength} from 'ol/sphere.js';
import { Map } from 'ol';

type MeasurementProps = {
  map: Map;
  source: any;
  active: boolean;
  measureType: 'line' | 'polygon';
};

const Measurement: React.FC<MeasurementProps> = 
({ 
  map, 
  source, 
  active, 
  measureType 
}) => {

  const [drawInteraction, setDrawInteraction] = useState<Draw | null>(null);
  const [helpTooltip, setHelpTooltip] = useState<Overlay | null>(null);
  const [measureTooltip, setMeasureTooltip] = useState<Overlay | null>(null);

  // control mount and unmount:
    //   useEffect(() => {
    //         console.log('measurement: mount');
    
    //         return () => {
    //             console.log('measurement: unmount')
    //         };
    //       }, []);

  
  useEffect(() => {
    let draw: Draw | null = null;
    let helpTooltipElement: HTMLElement | null = null;
    let sketch: Feature <LineString | Polygon>;

    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'ol-tooltip hidden';

    const helpTooltip = new Overlay({
      element: helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left',
    });

    const continueLineMsg = 'Click to continue drawing the line';
    const continuePolygonMsg = 'Click to continue drawing the polygon';

    const pointerMoveHandler = (evt: MapBrowserEvent<any>) => {
      if (evt.dragging) {
        return;
      }

      let helpMsg: string = 'Click to start drawing';

      if (sketch) {
        const geom = sketch.getGeometry();
    
        if (geom instanceof Polygon) {
          helpMsg = continuePolygonMsg;
        } else if (geom instanceof LineString) {
          helpMsg = continueLineMsg;
        }
      }
         

      helpTooltipElement.innerHTML = helpMsg;
      
      helpTooltip!.setPosition(evt.coordinate);

      helpTooltipElement.classList.remove('hidden');
    };

    map.on('pointermove', pointerMoveHandler);

    map.getViewport().addEventListener('mouseout', function () {
      helpTooltipElement.classList.add('hidden');
    });

    if (active) {
        const type = measureType === 'line' ? 'LineString' : 'Polygon';
        draw = new Draw({
          source: source,
          type: type,
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
    
      // Zeicheninteraktion der Map hinzufuegen
      map.addInteraction(draw);

    
      draw.on('drawstart', (evt) => {
        sketch = evt.feature as Feature <LineString | Polygon>;

        const geometry = sketch.getGeometry();

        const listener = geometry?.on('change', (evt) => {
          const geom = evt.target as LineString | Polygon;
          let output = geometry instanceof LineString ? formatLength(geom) : formatArea(geom);

          let tooltipCoord = geom.getLastCoordinate();
          if (geom instanceof Polygon) {
            output = formatArea(geom);
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
          } else if (geom instanceof LineString) {
            output = formatLength(geom);
            tooltipCoord = geom.getLastCoordinate();
          }
          measureTooltipElement!.innerHTML = output;
          measureTooltip!.setPosition(tooltipCoord);
        });

        draw!.on('drawend', () => {
          measureTooltipElement!.className = 'ol-tooltip ol-tooltip-static';
          measureTooltip!.setOffset([0, -7]);
          
          
          unByKey(listener);
        });
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
  }, [map, source, active, measureType]);



  // Zeichnen Line + Angabe der Flaeche 
  const formatLength = (line: LineString) => {
    const length = getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
    } else {
      output = Math.round(length * 100) / 100 + ' ' + 'm';
    }
    return output;
  };

  // Zeichnen Polygon + Angabe der Flaeche
  const formatArea = function (polygon: Polygon) {
    const area = getArea(polygon);
    let output;
    if (area > 10000) {
      output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
    } else {
      output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
    }
    return output;
  };


  return null;
};

export default Measurement;

