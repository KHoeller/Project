// Legend 1 for LayerTree without slider

import React, { useState, useEffect } from 'react';
import { Image } from 'antd';


import { Layer } from '../../../types/types';
import './legend_all.css';


export type LegendeProps = {
    layers: Layer[];
}
    

export default function Legende({ layers }: LegendeProps) {

   
    return (
        <div>
            {layers.map((layer, index) => (
                <div key={index} className='legend-item'>
                    <div className='legend-image'>      
                        <Image
                            src={
                                layer.groupName === 'Lärmbelastung'
                                    ? layer.urlLegend
                                    : `${layer.urlLegend}${layer.name}` // erstellt die entsprechende URL mit der base urlLegend und dem Layernamen 
                            }
                            preview={false}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}