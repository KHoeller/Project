import React from 'react';
import { Image } from 'antd';

import './legendSlider.css';


import { Layer } from '../../../types/types';

export type LegendeProps = {
    group: Layer[];
    groupName: string;
    checked: boolean;
       
}

export default function Legende({ group, groupName, checked }: LegendeProps) {
    const layernames = group.map(layer => layer.name);

    const baseUrlLegend = group.map(layer => layer.urlLegend); 
    
    const firstLayerName = layernames[0];
    const firstBaseUrl = baseUrlLegend[0];

    const layerSrc = firstBaseUrl + firstLayerName;

    return (
        <div className="sliderLegendContainer"> {/* Container für die Legende */}
        <Image className='sliderLegend' src={layerSrc} preview={false}/>
    </div>
    );
}
