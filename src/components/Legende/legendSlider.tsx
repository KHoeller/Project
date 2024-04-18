import React from 'react';
import { Image } from 'antd';

import './legend_all.css';


import { Layer } from '../../../types/types';

export type LegendeProps = {
    group: Layer[];
    groupName: string;
    checked: boolean;
       
}

export default function Legende({ group, groupName, checked }: LegendeProps) {
    const layernames = group.map(layer => layer.name);

    const baseUrlLegend = group.map(layer => layer.urlLegend); 
    
    const firstLayerName = layernames[0]; // Legende nur für den ersten Layer, weil alle Layer haben die gleiche Legende, und dann wechselt Legende bei Verschieben des Sliders nicht 
    const firstBaseUrl = baseUrlLegend[0];

    const layerSrc = firstBaseUrl + firstLayerName;

    return (
        <div className="sliderLegendContainer"> {/* Container für die Legende */}
            <Image className='sliderLegend' src={layerSrc} preview={false}/>
        </div>
    );
}
