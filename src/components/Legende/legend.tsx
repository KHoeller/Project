
import React, { useState, useEffect } from 'react';
import { Image } from 'antd';

import {Layer} from'../LayerTree/layerTree';
import './legendSlider.css';


export type LegendeProps = {
    layers: Layer[];
}
    

export default function Legende({ layers }: LegendeProps) {
    
    

    return (
        <div>
            {layers.map((layer, index) => (
                <div key={index} className='legend-item'>
                    <div className='legend-image'>
                        <Image src={`http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=15&STRICT=false&LAYER=${layer.name}`} preview={false}/>
                    </div>
                </div>
            ))}
        </div>
    );
}