import React, { useState, useEffect } from 'react';
import Feature from 'ol/Feature.js';
import Geolocation from 'ol/Geolocation.js';
import Map from 'ol/Map.js';
import Point from 'ol/geom/Point.js';
import View from 'ol/View.js';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';

export type GeolocationCompProps = {
  map: Map; 
  active: boolean;
}


export default function GeolocationComp ({map, active}: GeolocationCompProps) {
  const [tracking, setTracking] = useState(false);
  const [geolocation, setGeolocation] = useState<Geolocation | null>(null);

  useEffect(() => {
    if (active) {
      const geo = new Geolocation({
        trackingOptions: {
          enableHighAccuracy: true,
        },
        projection: map.getView().getProjection(),
      });
  
      geo.on('change:position', () => {
        const coordinates = geo.getPosition();
        if (coordinates) {
          map.getView().setCenter(coordinates);
        }
      });
  
      setGeolocation(geo);
      setTracking(true); // Starte die Geolokationsverfolgung
  
      geolocation?.on('error', function (error) {
        const info = document.getElementById('info');
        info.innerHTML = error.message;
        info.style.display = '';
      });

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
  
      const vectorSource = new VectorSource({
        features: [accuracyFeature, positionFeature],
      });
  
      const vectorLayer = new VectorLayer({
        map: map,
        source: vectorSource,
      });

      console.log('hat funktioniert?')


      return () => {
        if (geolocation) {
          geolocation.setTracking(false); // Stoppe die Geolokationsverfolgung
          setGeolocation(null); // Setze die Geolokations-Instanz zurück
        }
        map.removeLayer(vectorLayer);
        setTracking(false);
      };
        // Cleanup: Entferne die Geolokationskomponenten beim Deaktivieren
        
    }
  }, [map, active]);

  // useEffect(() => {
  //   if(active){
    
  //   const geo = new Geolocation({
  //     trackingOptions: {
  //       enableHighAccuracy: true,
  //     },
  //     projection: map.getView().getProjection(),
  //   });
  //   setGeolocation(geo);

  //   const accuracyFeature = new Feature();
  //   geo.on('change:accuracyGeometry', () => {
  //     accuracyFeature.setGeometry(geo.getAccuracyGeometry());
  //   });

  //   const positionFeature = new Feature();
  //   positionFeature.setStyle(
  //     new Style({
  //       image: new CircleStyle({
  //         radius: 6,
  //         fill: new Fill({
  //           color: '#3399CC',
  //         }),
  //         stroke: new Stroke({
  //           color: '#fff',
  //           width: 2,
  //         }),
  //       }),
  //     })
  //   );

  //   geo.on('change:position', () => {
  //     const coordinates = geo.getPosition();
  //     positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
  //   });

  //   new VectorLayer({
  //     map: map,
  //     source: new VectorSource({
  //       features: [accuracyFeature, positionFeature],
  //     }),
  //   });

  //   return () => {
  //     // Cleanup when component unmounts
  //     map.setTarget(null);
  //     map.removeLayer(vectorLayer);
  //   };
  
  // }
  // }, [map, active]);

  const handleTrackToggle = () => {
    if (geolocation) {
      geolocation.setTracking(!tracking);
      setTracking(!tracking);
    }
  };


  return null;
};



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