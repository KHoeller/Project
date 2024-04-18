// Root Document (App)

// imports from OSM 
import Map from 'ol/Map';   
import View from 'ol/View.js';
import { ScaleLine, defaults as defaultControls} from 'ol/control.js';

import React, { useMemo } from 'react';

// import Object with Layers 
import Layers from "./src/utils/LayerN/LayerN";
// import MapView and ZoomLevel
import { mapView } from './conf/config.json'; 

import './General.css';

import {Vector as VectorSource} from 'ol/source.js';
import {Vector as VectorLayer} from 'ol/layer.js';

// import Components 
import MapComp from './src/components/Map/Map';
import FeatureInfo from './src/components/FeatureInfo/featureInfoDrawer';
import Sidebar from './src/components/Sidebar/sidebar';
import NominatimSearch from './src/components/Search/search';


export default function App () {
    // console.log('mapView', mapView);

   
    const scaleControl = useMemo(() => new ScaleLine(
    ), []); // hinzufügen einer ScaleLine auf der Map 
   
    const map = useMemo(() => { 
        return new Map({  
            controls: defaultControls().extend([scaleControl]),                      
            layers: Layers(),                   // damit Array statt der Funktion verwendet wird; alle Layer (aus LayerN) hinzufuegen in Map (aber nicht alle sichtbar)
            view: new View({                    // initial view (zoom/Ausschnit)
                center: mapView.center,
                zoom: mapView.zoom            
            }),
        });
    }, [scaleControl]) // erstellen der Map 


    // add Vector Layer for drawing/measurement
    const source = new VectorSource();

    const vector = new VectorLayer({
        source: source,
            style: {
            'fill-color': 'rgba(255, 255, 255, 0.2)',
            'stroke-color': '#ffcc33',
            'stroke-width': 2,
            'circle-radius': 7,
            'circle-fill-color': '#ffcc33',
            },
    });

    vector.set('name', 'measurement'); // add a name for the vector layer for being able to search/filter later 

    map.addLayer(vector)

    return ( 
        <> 
    
            <NominatimSearch map={map}/>
            <MapComp map={map} />
            <Sidebar map={map}/>
            <FeatureInfo map={map} source={source}/>  

        </>
    )
}


