
import React, { EventHandler } from 'react';
import {createStringXY} from 'ol/coordinate'; 
import Layers from '/home/khoeller/Dokumente/OpenLayers/src/components/LayerN/LayerN';
import { useState } from 'react';
import './featureInfo.css'


function info (evt: EventHandler<any>){
    document.getElementById('info').innerHTML = '';
    const viewResolution = /** @type {number} */ (view.getResolution());
    const source = Layers()[7]?.getSource(); 
    const url = source?.getFeatureInfoUrl(
    evt.coordinate,
    viewResolution,
    'EPSG:3857',
    {'INFO_FORMAT': 'text/html'},
  );
}

export default function addFeatureInfo() {
    
    const [info, setInfo] = useState('');

    function handleClick(){
        // setInfo();
    }
    console.log(Layers());
    const layers = Layers(); 
    
    


    return(
        <div id='info' className ='info'>value:</div>
    )
}