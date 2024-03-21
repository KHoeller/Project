
// SliderCode - 4 Slider, die man mit Checkbox an und ausschalten kann und mit verschieben des pucks auch zwischen Jahren Switchen kann


// TODO -> Einbindung in LayerTree an die entsprechende Stelle
// TODO -> Übergang bei changes geschmeidiger 
import React, { useState, useEffect } from 'react';
import { Slider, Checkbox } from 'antd';
import Map from 'ol/Map';
import './slider.css';

export type SliderProps = {
    map: Map;
}




export default function RasterSlider({ map }: SliderProps) {
    const layers = map.getLayers().getArray();
    const [groupsWithSlider, setGroupsWithSlider] = useState<string[]>([]);
    const [selectedLayerIndexes, setSelectedLayerIndexes] = useState<{ [key: string]: number }>({});
    const [sliderEnabled, setSliderEnabled] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const groupsWithSlider: string[] = [];
        const selectedLayerIndexes: { [key: string]: number } = {};
        const sliderEnabled: { [key: string]: boolean } = {};

        layers.forEach((layer: any) => {
            const groupName = layer.get('groupName');
            const enableSlider = layer.get('enableSlider');

            if (enableSlider && groupName && !groupsWithSlider.includes(groupName)) {
                groupsWithSlider.push(groupName);
                selectedLayerIndexes[groupName] = 0;
                sliderEnabled[groupName] = false;
            }
        });

        setGroupsWithSlider(groupsWithSlider);
        setSelectedLayerIndexes(selectedLayerIndexes);
        setSliderEnabled(sliderEnabled);
    }, [layers]);

    const onChange = (groupName: string, newValue: number) => {
        setSelectedLayerIndexes(prevState => ({
            ...prevState,
            [groupName]: newValue
        }));
    }

    useEffect(() => {
        groupsWithSlider.forEach(groupName => {
            const groupLayers = layers.filter(layer => layer.get('groupName') === groupName);
            const selectedLayerIndex = selectedLayerIndexes[groupName];
            const selectedLayer = groupLayers[selectedLayerIndex];
    
            
            groupLayers.forEach((layer: any) => {
                if (sliderEnabled[groupName]) {
                    if (layer === selectedLayer) {
                        layer.setVisible(true);
                    } else {
                        layer.setVisible(false);
                    }
                } else {
                    layer.setVisible(false);
                }
            });
        });
    }, [groupsWithSlider, layers, selectedLayerIndexes, sliderEnabled]);

    const toggleSlider = (groupName: string, checked: boolean) => {
        setSliderEnabled(prevState => ({
            ...prevState,
            [groupName]: checked
        }));
    }

    return (
        <div className='Slider'>
            {groupsWithSlider.map((groupName, index) => {
                const groupLayers = layers.filter(layer => layer.get('groupName') === groupName);

                const marks: any = {};
                groupLayers.forEach((layer: any, index: number) => {
                    const fullYear = layer.get('year');
                    marks[index] = "'" + fullYear.toString().slice(-2); // Extrahiere die letzten beiden Ziffern
                });

                return (
                    <div key={groupName}>
                        <h3>{groupName}</h3>
                        <Checkbox
                            checked={sliderEnabled[groupName]}
                            onChange={(e) => toggleSlider(groupName, e.target.checked)}
                            style={{ marginBottom: '1rem' }}
                        >
                            {groupName} ein
                        </Checkbox>
                        {sliderEnabled[groupName] && (
                            <Slider
                                onChange={(newValue: number) => onChange(groupName, newValue)}
                                style={{ width: '100%' }}
                                max={groupLayers.length - 1}
                                value={selectedLayerIndexes[groupName]}
                                marks={marks}
                                tooltip={{ open: false }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}


// import React, { useState, useEffect } from 'react';
// import { Slider, Switch } from 'antd';
// import Map from 'ol/Map';
// import './slider.css';

// export type SliderProps = {
//     map: Map;
// }

// export default function RasterSlider({ map }: SliderProps) {
//     const layers = map.getLayers().getArray();
//     const [groupsWithSlider, setGroupsWithSlider] = useState<string[]>([]);
//     const [selectedLayerIndexes, setSelectedLayerIndexes] = useState<{ [key: string]: number }>({});
//     const [sliderEnabled, setSliderEnabled] = useState<{ [key: string]: boolean }>({});

//     useEffect(() => {
//         const groupsWithSlider: string[] = [];
//         const selectedLayerIndexes: { [key: string]: number } = {};
//         const sliderEnabled: { [key: string]: boolean } = {};

//         layers.forEach((layer: any) => {
//             const groupName = layer.get('groupName');
//             const enableSlider = layer.get('enableSlider');

//             if (enableSlider && groupName && !groupsWithSlider.includes(groupName)) {
//                 groupsWithSlider.push(groupName);
//                 selectedLayerIndexes[groupName] = 0;
//                 sliderEnabled[groupName] = true;
//             }
//         });

//         setGroupsWithSlider(groupsWithSlider);
//         setSelectedLayerIndexes(selectedLayerIndexes);
//         setSliderEnabled(sliderEnabled);
//     }, [layers]);

//     const onChange = (groupName: string, newValue: number) => {
//         setSelectedLayerIndexes(prevState => ({
//             ...prevState,
//             [groupName]: newValue
//         }));
//     }

//     useEffect(() => {
//         groupsWithSlider.forEach(groupName => {
//             const groupLayers = layers.filter(layer => layer.get('groupName') === groupName);
//             const selectedLayerIndex = selectedLayerIndexes[groupName];
//             const selectedLayer = groupLayers[selectedLayerIndex];
    
//             groupLayers.forEach((layer: any) => {
//                 if (sliderEnabled[groupName]) {
//                     if (layer === selectedLayer) {
//                         layer.setVisible(true);
//                     } else {
//                         layer.setVisible(false);
//                     }
//                 } else {
//                     layer.setVisible(false);
//                 }
//             });
//         });
//     }, [groupsWithSlider, layers, selectedLayerIndexes, sliderEnabled]);

//     const toggleSlider = (groupName: string, checked: boolean) => {
//         setSliderEnabled(prevState => ({
//             ...prevState,
//             [groupName]: checked
//         }));
//     }

//     return (
//         <div className='Slider'>
//             {groupsWithSlider.map((groupName, index) => {
//                 const groupLayers = layers.filter(layer => layer.get('groupName') === groupName);

//                 const marks: any = {};
//                 groupLayers.forEach((layer: any, index: number) => {
//                     const fullYear = layer.get('year');
//                     marks[index] = "'" + fullYear.toString().slice(-2); // Extrahiere die letzten beiden Ziffern
//                 });

//                 return (
//                     <div key={groupName}>
//                         <h3>{groupName}</h3>
//                         <Switch
//                             checkedChildren="Slider an"
//                             unCheckedChildren="Slider aus"
//                             checked={sliderEnabled[groupName]}
//                             onChange={(checked: boolean) => toggleSlider(groupName, checked)}
//                             style={{ marginBottom: '1rem' }}
//                         />
//                         {sliderEnabled[groupName] && (
//                             <Slider
//                                 onChange={(newValue: number) => onChange(groupName, newValue)}
//                                 style={{ width: '100%' }}
//                                 max={groupLayers.length - 1}
//                                 value={selectedLayerIndexes[groupName]}
//                                 marks={marks}
//                                 tooltip={{ open: false }}
//                             />
//                         )}
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }


// // funktioniert: erstellt Slider für die vier Gruppen mit enableSlider=true -> aber ein Block mit allen SLidern 
// import React, { useState, useEffect } from 'react';
// import { Slider } from 'antd';
// import Map from 'ol/Map';
// import './slider.css';

// export type SliderProps = {
//     map: Map;
// }

// export default function RasterSlider({ map }: SliderProps) {
//     const layers = map.getLayers().getArray();
//     const [groupsWithSlider, setGroupsWithSlider] = useState<string[]>([]);
//     const [selectedLayerIndexes, setSelectedLayerIndexes] = useState<{ [key: string]: number }>({});

//     useEffect(() => {
//         const groupsWithSlider: string[] = [];
//         const selectedLayerIndexes: { [key: string]: number } = {};

//         layers.forEach((layer: any) => {
//             const groupName = layer.get('groupName');
//             const enableSlider = layer.get('enableSlider');

//             if (enableSlider && groupName && !groupsWithSlider.includes(groupName)) {
//                 groupsWithSlider.push(groupName);
//                 selectedLayerIndexes[groupName] = 0;
//             }
//         });

//         setGroupsWithSlider(groupsWithSlider);
//         setSelectedLayerIndexes(selectedLayerIndexes);
//     }, [layers]);

//     const onChange = (groupName: string, newValue: number) => {
//         setSelectedLayerIndexes(prevState => ({
//             ...prevState,
//             [groupName]: newValue
//         }));
//     }

//     useEffect(() => {
//         groupsWithSlider.forEach(groupName => {
//             const groupLayers = layers.filter(layer => layer.get('groupName') === groupName);
//             const selectedLayerIndex = selectedLayerIndexes[groupName];
//             const selectedLayer = groupLayers[selectedLayerIndex];
    
//             groupLayers.forEach((layer: any) => {
//                 if (layer === selectedLayer) {
//                     layer.setVisible(true);
//                 } else {
//                     layer.setVisible(false);
//                 }
//             });
//         });
//     }, [groupsWithSlider, layers, selectedLayerIndexes]);

//     return (
//         <div>
//             {groupsWithSlider.map((groupName, index) => {
//                 const groupLayers = layers.filter(layer => layer.get('groupName') === groupName);

//                 const marks: any = {};
//                 groupLayers.forEach((layer: any, index: number) => {
//                     const fullYear = layer.get('year');
//                     marks[index] = "'" + fullYear.toString().slice(-2); // Extrahiere die letzten beiden Ziffern
//                 });

//                 return (
//                     <div key={groupName}>
//                         <h3>{groupName}</h3>
//                         <Slider
//                             onChange={(newValue: number) => onChange(groupName, newValue)}
//                             style={{ width: '100%' }}
//                             max={groupLayers.length - 1}
//                             value={selectedLayerIndexes[groupName]}
//                             marks={marks}
//                             tooltip={{ open: false }}
//                         />
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }


// import React, { useState, useEffect } from 'react';
// import { Slider } from 'antd';
// import Map from 'ol/Map';
// import './slider.css';

// export type SliderProps = {
//     map: Map;
// }

// export default function RasterSlider({ map }: SliderProps) {
//     const layers = map.getLayers().getArray();
//     const [groupsWithSlider, setGroupsWithSlider] = useState<string[]>([]);
//     const [selectedLayerIndexes, setSelectedLayerIndexes] = useState<{ [key: string]: number }>({});

//     useEffect(() => {
//         const groupsWithSlider: string[] = [];
//         const selectedLayerIndexes: { [key: string]: number } = {};

//         layers.forEach((layer: any) => {
//             const groupName = layer.values_.groupName;
//             const enableSlider = layer.values_.enableSlider;

//             if (enableSlider && groupName && !groupsWithSlider.includes(groupName)) {
//                 groupsWithSlider.push(groupName);
//                 selectedLayerIndexes[groupName] = 0;
//             }
//         });

//         setGroupsWithSlider(groupsWithSlider);
//         setSelectedLayerIndexes(selectedLayerIndexes);
//     }, [layers]);

//     const onChange = (groupName: string, newValue: number) => {
//         setSelectedLayerIndexes(prevState => ({
//             ...prevState,
//             [groupName]: newValue
//         }));
//     }

//     return (
//         <div>
//             {groupsWithSlider.map((groupName, index) => {
//                 const groupLayers = layers.filter(layer => layer.values_.groupName === groupName);

//                 const marks: any = {};
//                 groupLayers.forEach((layer: any, index: number) => {
//                     marks[index] = layer.get('year');
//                 });

//                 useEffect(() => {
//                     const selectedLayerIndex = selectedLayerIndexes[groupName];
//                     const selectedLayer = groupLayers[selectedLayerIndex];

//                     selectedLayer.setVisible(true);

//                     groupLayers.forEach((layer: any) => {
//                         if (layer !== selectedLayer) {
//                             layer.setVisible(false);
//                         }
//                     });
//                 }, [groupName, groupLayers, selectedLayerIndexes]);

//                 return (
//                     <div key={groupName}>
//                         <h3>{groupName}</h3>
//                         <Slider
//                             onChange={(newValue: number) => onChange(groupName, newValue)}
//                             style={{ width: '100%' }}
//                             max={groupLayers.length - 1}
//                             value={selectedLayerIndexes[groupName]}
//                             marks={marks}
//                             tooltipVisible={false}
//                         />
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }





// // slider: Aktueller Zustand: Erstellen eines Sliders am oberen Rand, der die Layer der Gruppe NO2 enthält und bei ändern der Position die Daten/den Layer des gewählten Jahres anzeigt 
// import React, { useState, useEffect } from 'react';
// import { Slider } from 'antd';
// import Map from 'ol/Map';
// import './slider.css';

// export type SliderProps = {
//     map: Map;
// }

// export default function RasterSlider ({ map }: SliderProps) {

//     const layers = map.getLayers().getArray();   
//     console.log(layers);
    

//     const no2Layers: any = [];

//     const [selectedLayerIndex, setSelectedLayerIndex] = useState(0); // Zustandsvariable erstellen 

//     layers.forEach((layer: any) => {
//         const groupName = layer.values_.groupName;          // Gruppennamen aus Layern filtern und nur die für NO2 nehmen und zur Karte hinzufügen 
        
//         if(groupName === 'NO2') {
//             no2Layers.push(layer);
//         }

//     }); 

//     const onChange = (newValue: number) => {            // bei click newValue aktualisieren 
//         setSelectedLayerIndex(newValue);
//     }

//     const marks: any = {};
//     no2Layers.forEach((layer: any, index: any) => {
//         marks[index] = layer.get('year');
//     });

//     useEffect(() => {
//         const selectedLayer = no2Layers[selectedLayerIndex];

//         console.log(selectedLayer);
//         selectedLayer.setVisible(true); // Setzen der Sichtbarkeit des ausgewählten Layers auf true

//         // Entfernen Sichtbarkeit der anderen Layer
//         no2Layers.forEach((layer:any) => {
//             if (layer !== selectedLayer) {
//                 layer.setVisible(false);
//             }
//         });
//     }, [selectedLayerIndex, no2Layers]);

//     return (
//         <div>
//             <Slider
//                 onChange={onChange}
//                 style={{ width: '100%' }}
//                 max={no2Layers.length - 1}
//                 value={selectedLayerIndex}
//                 marks={marks}
//                 tooltipVisible={false}
//                 // tipFormatter={index => typeof index === 'number' ? no2Layers[index]?.get('year'): ''}
//             />
                
//         </div>
//     );
// }





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