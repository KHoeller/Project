

// slider: Aktueller Zustand: Erstellen eines Sliders am oberen Rand, der die Layer der Gruppe NO2 enthält und bei ändern der Position die Daten/den Layer des gewählten Jahres anzeigt 
import React, { useState, useEffect } from 'react';
import { Slider, Switch } from 'antd';
import Map from 'ol/Map';
import Layers from '../../utils/LayerN/LayerN'; // TODO muss von Map kommen 
import './slider.css';

export type SliderProps = {
    map: Map;
}

export default function RasterSlider ({ map }:SliderProps) {

    const layers = Layers(); // habe die Layers genommen 
    const no2Layers: any = [];
    const [selectedLayerIndex, setSelectedLayerIndex] = useState(0); // Zustandsvariable erstellen 

    layers.forEach((layer: any) => {
        const groupName = layer.values_.groupName;          // Gruppennamen aus Layern filtern und nur die für NO2 nehmen und zur Karte hinzufügen 
        
        if(groupName === 'NO2') {
            no2Layers.push(layer);
            map.addLayer(layer); 
        }

    }); 

    const onChange = (newValue: number) => {            // bei click newValue aktualisieren 
        setSelectedLayerIndex(newValue);

        const selectedLayer = no2Layers[newValue];

        map.getLayers().forEach(layer => {
            if (layer !== selectedLayer && layer.getVisible()) {
                layer.setVisible(false);
            }
        });

        selectedLayer.setVisible(true); // ausgewählten Layer auf visible setzen 

        // console.log(selectedLayer);
    }

    const marks: any = {};
    no2Layers.forEach((layer: any, index: any) => {
        marks[index] = layer.get('year');
    });

    useEffect(() => {
        const selectedLayer = no2Layers[selectedLayerIndex];

        console.log(selectedLayer);
        selectedLayer.setVisible(true); // Setzen Sie die Sichtbarkeit des ausgewählten Layers auf true

        // Entfernen Sie die Sichtbarkeit der anderen Layers
        no2Layers.forEach((layer:any) => {
            if (layer !== selectedLayer) {
                layer.setVisible(false);
            }
        });
    }, [selectedLayerIndex, no2Layers]);

    return (
        <div>
            <Slider
                onChange={onChange}
                style={{ width: '100%' }}
                max={no2Layers.length - 1}
                value={selectedLayerIndex}
                marks={marks}
            />
                
        </div>
    );
}





// export default function RasterSlider ({onChange}){

//     return(
//         <Slider />
//     )
// }







    // const marks = {};

    //     const [year, setYear] = useState<number | undefined>(undefined);

    //     const handleChange = (newYear: number) => {
    //         setYear(newYear);
    //     };
    // className='raster-slider' 
    //     defaultValue={2010}
    
    // min={2000} // Mindestwert auf das früheste Jahr setzen
    // max={2022} // Höchstwert auf das späteste Jahr setzen
    // step={1} // Schritt von 1 Jahr
    // value={year}
    // marks={marks} // Verwenden Sie die vordefinierten Markierungen
    // onChange={handleChange}
    // tooltipVisible 