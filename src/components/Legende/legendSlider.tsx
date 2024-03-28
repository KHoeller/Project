import React, { useState, useEffect } from 'react';
import { Image } from 'antd';
// import Map from 'ol/Map';
import './legendSlider.css';


export type Layer = {
    name: string;
    title: string;
    visible: boolean;
    info: boolean;
    infoText: boolean;
    infoTextTitle: boolean;
    year: number;
    enableSlider: boolean;
    queryable: boolean;
    layerType: string;
    layer: any; 
}

export type LegendeProps = {
    group: Layer[];
    groupName: string;
    checked: boolean;
    onGroupCollapse: (groupName: string) => void;    
}

export default function Legende({ group, groupName, checked, onGroupCollapse }: LegendeProps) {
    const layernames = group.map(layer => layer.name);
    console.log('layer', layernames);
    const firstLayerName = layernames[0];

    const baseSrc = "http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=15&STRICT=false&LAYER=";
    const layerSrc = baseSrc + firstLayerName;
    

    // useEffect(() => {
    //     if (checked) {
    //         // Wenn checked ist, eine Legende nur für den ersten Layer erstellen
                
    //         }
    //     } else {
    //         // Aktionen, wenn nicht checked ist
    //     }
    // }, [checked, layernames]);

    return (
        <div className="sliderLegendContainer"> {/* Container für die Legende */}
        {/* <h3>{groupName}</h3> */}
        <Image className='sliderLegend' src={layerSrc} preview={false}/>
    </div>
    );
}
