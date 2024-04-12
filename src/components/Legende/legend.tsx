
import React, { useState, useEffect } from 'react';
import { Image } from 'antd';


import { Layer } from '../../../types/types';
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
                        {/* Prüfe, ob der Layernamen am Ende der URL erforderlich ist */}
                        <Image
                            src={
                                layer.groupName === 'WMS-Laerm'
                                    ? layer.urlLegend
                                    : `${layer.urlLegend}${layer.name}`
                            }
                            preview={false}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}