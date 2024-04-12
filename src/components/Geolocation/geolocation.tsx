import React, { useState, useEffect } from 'react';
import Feature from 'ol/Feature.js';
import Geolocation from 'ol/Geolocation.js';
import Map from 'ol/Map.js';
import Point from 'ol/geom/Point.js';
import View from 'ol/View.js';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';

const MapComponent: React.FC = () => {
  const [tracking, setTracking] = useState(false);
  const [geolocation, setGeolocation] = useState<Geolocation | null>(null);

  useEffect(() => {
    const view = new View({
      center: [0, 0],
      zoom: 2,
    });

    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'map',
      view: view,
    });

    const geo = new Geolocation({
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: view.getProjection(),
    });
    setGeolocation(geo);

    const accuracyFeature = new Feature();
    geo.on('change:accuracyGeometry', () => {
      accuracyFeature.setGeometry(geo.getAccuracyGeometry());
    });

    const positionFeature = new Feature();
    positionFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({
            color: '#3399CC',
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 2,
          }),
        }),
      })
    );

    geo.on('change:position', () => {
      const coordinates = geo.getPosition();
      positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
    });

    new VectorLayer({
      map: map,
      source: new VectorSource({
        features: [accuracyFeature, positionFeature],
      }),
    });

    return () => {
      // Cleanup when component unmounts
      map.setTarget(null);
    };
  }, []);

  const handleTrackToggle = () => {
    if (geolocation) {
      geolocation.setTracking(!tracking);
      setTracking(!tracking);
    }
  };

  return (
    <div>
      <div id="geolocation" ></div>
      <div>
        <label htmlFor="track">
          Track position
          <input
            id="track"
            type="checkbox"
            checked={tracking}
            onChange={handleTrackToggle}
          />
        </label>
      </div>
      <p>
        Position accuracy: <code id="accuracy"></code>&nbsp;&nbsp;
        Altitude: <code id="altitude"></code>&nbsp;&nbsp;
        Altitude accuracy: <code id="altitudeAccuracy"></code>&nbsp;&nbsp;
        Heading: <code id="heading"></code>&nbsp;&nbsp;
        Speed: <code id="speed"></code>
      </p>
    </div>
  );
};

export default MapComponent;


// import Feature from 'ol/Feature.js';
// import Geolocation from 'ol/Geolocation.js';
// import Map from 'ol/Map.js';
// import Point from 'ol/geom/Point.js';
// import View from 'ol/View.js';
// import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';
// import {OSM, Vector as VectorSource} from 'ol/source.js';
// import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
// import React from 'react';

// export type GeolocationCompProps ={
//     map: Map; 
// }

// export default function GeolocationComp ({map}: GeolocationCompProps){

//     console.log(map);
//     const geolocation = new Geolocation({
//     // enableHighAccuracy must be set to true to have the heading value.
//     trackingOptions: {
//         enableHighAccuracy: true,
//     },
//     projection: map.View.getProjection(),
//     });

//     function el(id: any) {
//     return document.getElementById(id);
//     }

//     el('track')?.addEventListener('change', function () {
//     geolocation.setTracking(this.checked);
//     });

//     // update the HTML page when the position changes.
//     geolocation.on('change', function () {
//     el('accuracy').innerText = geolocation.getAccuracy() + ' [m]';
//     el('altitude').innerText = geolocation.getAltitude() + ' [m]';
//     el('altitudeAccuracy').innerText = geolocation.getAltitudeAccuracy() + ' [m]';
//     el('heading').innerText = geolocation.getHeading() + ' [rad]';
//     el('speed').innerText = geolocation.getSpeed() + ' [m/s]';
//     });

//     // handle geolocation error.
//     geolocation.on('error', function (error) {
//     const info = document.getElementById('info');
//     info.innerHTML = error.message;
//     info.style.display = '';
//     });

//     const accuracyFeature = new Feature();
//     geolocation.on('change:accuracyGeometry', function () {
//     accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
//     });

//     const positionFeature = new Feature();
//     positionFeature.setStyle(
//     new Style({
//         image: new CircleStyle({
//         radius: 6,
//         fill: new Fill({
//             color: '#3399CC',
//         }),
//         stroke: new Stroke({
//             color: '#fff',
//             width: 2,
//         }),
//         }),
//     }),
//     );

//     geolocation.on('change:position', function () {
//     const coordinates = geolocation.getPosition();
//     positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
//     });

//     new VectorLayer({
//     map: map,
//     source: new VectorSource({
//         features: [accuracyFeature, positionFeature],
//     }),
//     });
//     return(
//         <div></div>
//     )
// }