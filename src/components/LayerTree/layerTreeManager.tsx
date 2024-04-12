
import React from 'react';
import Map from 'ol/Map';

import LayerTree from './layerTree'; // Import LayerTree component
import LayerTreeSlider from './layerTreeSlider'; // Import LayerTreeSlider component

export type LayerManagerProps = {
    map: Map;
}

export default function LayerManager ({ map }: LayerManagerProps) {
    const layers = map.getLayers().getArray();

    const sliderLayers = layers.filter(layer => layer.get('enableSlider') === true); // Layers with enableSlider === true
    const normalLayers = layers.filter(layer => layer.get('enableSlider') !== true); // Layers with enableSlider !== true

    return (
        <>
            
            
            {sliderLayers.length > 0 ? (
                <LayerTreeSlider map={map} />
            ) : null}
            
            {normalLayers.length > 0 ? (
                <LayerTree map={map} 
                />
            ) : null} 
        </>
    );
};




