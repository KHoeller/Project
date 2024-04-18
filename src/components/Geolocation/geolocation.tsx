

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
  activeGeoloc: boolean;
}


// basi

export default function GeolocationComp ({map, activeGeoloc}: GeolocationCompProps) {
 
  const [geolocation, setGeolocation] = useState<Geolocation | null>(null);
  const [tracking, setTracking] = useState(false);
  const [vectorLayer, setVectorLayer] = useState<VectorLayer | null>(null);
  const [vectorSource, setVectorSource] = useState<VectorSource | null>(null);


  
      // console.log('map', map); // ist auch da
      // console.log('button', activeGeoloc);  // active prop wird richtig weitergegeben 

    // Kontrolle: wird die Component gerendert? 
      // useEffect(() => { // wird gemountet
      //   console.log('geolocation: mount');

      //   return () => {
      //       console.log('geolocation: unmount')
      //   };
      // }, []);


  useEffect(() => {

    if (activeGeoloc) {
      
      setTracking(true);
     
      const geolocation = new Geolocation({
        trackingOptions: {
          enableHighAccuracy: true,
        },
        tracking: true,
        projection: map.getView().getProjection(),
      });  
      
      setGeolocation(geolocation);
  
      // for geolocationError 
      geolocation?.on('error', function (error) {
        // console.log('error', error);
      });

      const accuracyFeature = new Feature();

      geolocation.on('change:accuracyGeometry', () => {
        const accuracyGeometry = geolocation.getAccuracyGeometry();
      
        // Check if accuracyGeometry is not null before setting it as the feature's geometry
        if (accuracyGeometry !== null) {
          accuracyFeature.setGeometry(accuracyGeometry);
        } else { // (optional)
            // Handle the case where accuracyGeometry is null 
          // accuracyFeature.setGeometry(undefined);
          console.log('error');
        }
      });
  
      // Symbol for showing location 
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
  
      // geolocation.on('change:position', () => {
      //   const coordinates = geolocation.getPosition();
      //   positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
      // });

      geolocation.on('change:position', () => {
        const coordinates = geolocation.getPosition();
      
        // Check if coordinates is not null before setting it as the feature's geometry
        if (coordinates !== null) {
          const pointGeometry = new Point(coordinates);
          positionFeature.setGeometry(pointGeometry);
        } else {
          // Handle the case where coordinates is null (optional)
          positionFeature.setGeometry(undefined);
        }
      });

      const newVectorSource = new VectorSource({
        features: [accuracyFeature, positionFeature],
      });

      const newVectorLayer = new VectorLayer({
        map: map,
        source: newVectorSource,
      });

      setVectorLayer(newVectorLayer);
      setVectorSource(newVectorSource); 

      return () => {
        // Entferne die Geolokationsverfolgung und den Vektor-Layer beim Deaktivieren
        if (geolocation) {
          geolocation.setTracking(false);
          setGeolocation(null);
        }
        if (newVectorLayer) {
          map.removeLayer(newVectorLayer);
          setVectorLayer(null);
        }
        if(newVectorSource){
          newVectorSource.clear();
          setVectorSource(null)

        }
        setTracking(false);
      };



    } else {
      setTracking(false);
      setGeolocation(null);

      // Entferne den Vektor-Layer, falls vorhanden
      if (vectorLayer) {
        map.removeLayer(vectorLayer);
        setVectorLayer(null);
        
      }; 

      if (vectorSource) {
        vectorSource.clear(); // Leere die VectorSource, um alle Features zu entfernen
        setVectorSource(null);
      };
    }
  }, [map, activeGeoloc]);



  return null;
};


