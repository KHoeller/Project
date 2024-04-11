
// SliderCode - 4 Slider, die man mit Checkbox an und ausschalten kann und mit verschieben des pucks auch zwischen Jahren Switchen kann


import React, { useState, useEffect } from 'react';
import { Slider } from 'antd';

import { Layer } from '../../../types/types';

export type SliderProps = {
    group: Layer[];
    groupName: string;
    checked: boolean;
}

export default function RasterSlider({ group, groupName, checked }: SliderProps) {
    
    const [inputValue, setInputValue] = useState<number | null>(0);
    const [previousIndex, setPreviousIndex] = useState<number | null>(0);

    
    useEffect(() => {
        if (checked) {
            const initialIndex = group.findIndex(layer => layer.year === 2021); // Finde Index des Jahres 2021
            
            setInputValue(previousIndex !== null ? previousIndex : initialIndex); // sofern es einen previousIndex gibt wird dieser verwendet 
            
        }
    }, [group, checked]);

    // console.log('group:', group);
    
    useEffect(() => {
        if (checked) {
            
            group.forEach((layer, index) => {
                if (index === inputValue) {
                    layer.layer.setVisible(true);
                } else {
                    layer.layer.setVisible(false);
                    
                }
            });
        } else {
            group.forEach(layer => layer.layer.setVisible(false));          
            if (inputValue !== null) {
                setPreviousIndex(inputValue); // der zuletzt angezeigt Index wird gespeichert 
            }
            // console.log('length:', group.length);
        }
        // console.log('inputValue:', inputValue);
    }, [checked, group, inputValue, groupName, previousIndex]);
       
    
    const handleChange = (newValue: number) => {
        if (checked && newValue !== inputValue) {
            setInputValue(newValue); // inputvalue wird nur aktualisiert, wenn ein neuer Index ausgewählt wird und group checked ist 
        }
    };

    const years = group.map(layer => layer.year);
   
    const marks: { [key: number]: React.ReactNode } = years.reduce<{ [key: number]: React.ReactNode }>((acc, year, index) => {
        const shortYear = year?.toString().slice(-2);
        acc[index] = (
            <span>
                <sup>'</sup>
                {shortYear}
                
            </span>
        );
        return acc;
    }, {});

    const minYear = years.length > 0 ? years[0] : 0;
    const maxYear = years.length > 0 ? years[years.length - 1] : 0;

    return (
        <div>
            <h4 style={{ fontWeight: 'normal' }}> Jahresmittelwerte {groupName} <br/> von {minYear} bis {maxYear} </h4>
            <Slider
                value={inputValue !== null ? inputValue : 0}
                onChange={handleChange}
                included={false}
                min={0}
                max={years.length - 1}
                marks={marks}
               
                style={{ width: '250px'}}/>
                
        </div>
    );
}






// fontWeight: normal -> normal, nicht dick oder kursiv 


// import React, { useState, useEffect } from 'react';
// import { Slider, Checkbox } from 'antd';
// import Map from 'ol/Map';
// import './slider.css';

// export type SliderProps = {
//     map: Map;
// }

// export default function RasterSlider({ map }: SliderProps) {
//     const layers = map.getLayers().getArray();
//     const [groupsWithSlider, setGroupsWithSlider] = useState<string[]>([]);             // for groups with enableSlider = true
//     const [selectedLayerIndexes, setSelectedLayerIndexes] = useState<{ [key: string]: number }>({});    // renew the index of the group to change the year of the layer inside a group
//     const [sliderEnabled, setSliderEnabled] = useState<{ [key: string]: boolean }>({});     // to check and uncheck the slider 

//     useEffect(() => {
//         const groupsWithSlider: string[] = [];
//         const selectedLayerIndexes: { [key: string]: number } = {};
//         const sliderEnabled: { [key: string]: boolean } = {};

//         layers.forEach((layer: any) => {                                // Schleife fuer jeden Layer
//             const groupName = layer.get('groupName');                   // groupname von layern 
//             const enableSlider = layer.get('enableSlider');             // get Information for sliders 

//             if (enableSlider && groupName && !groupsWithSlider.includes(groupName)) { // wenn enableSlider und groupname true sind und der groupname noch nicht im Array groupsWithSlider vorhanden ist...
//                 groupsWithSlider.push(groupName);           // ... dann wird der groupname hinzugefügt; an array with according groupnames 
//                 selectedLayerIndexes[groupName] = 2;
//                 sliderEnabled[groupName] = false;
//             }
//         });

//         setGroupsWithSlider(groupsWithSlider);              // function for updating value 
//         setSelectedLayerIndexes(selectedLayerIndexes);
//         setSliderEnabled(sliderEnabled);
//     }, [layers]); // wird jedes Mal ausgeführt, wenn sich der Wert der layers ändert 

//     const onChange = (groupName: string, newValue: number) => { // function in case of changed slider; newValue: newIndex
//         setSelectedLayerIndexes(prevState => ({
//             ...prevState,
//             [groupName]: newValue           // enthält vorherigen Zustand und gibt neuen Zustand zurück; aktualisieren nur für betreffende Gruppe (Index der anderen Gruppen bleiben erhalten)
//         }));
//     }

//     // Rest nochmal nachvollziehen 

//     useEffect(() => {
//         groupsWithSlider.forEach(groupName => {
//             const groupLayers = layers.filter(layer => layer.get('groupName') === groupName); // für jeden Gruppennamen die Layer suchen 

//             const marks: any = {};
//             groupLayers.forEach((layer: any, index: number) => {
//                 const fullYear = layer.get('year');
//                 marks[index] = "'" + fullYear.toString().slice(-2); // Extrahiere die letzten beiden Ziffern
//             });

//             const selectedLayerIndex = selectedLayerIndexes[groupName];                         // der index des ausgewählten Layers in der jeweiligen Gruppe
//             const selectedLayer = groupLayers[selectedLayerIndex];                          // ausgerwählten Layer abrufen 
    
            
//             groupLayers.forEach((layer: any) => {
//                 if (sliderEnabled[groupName]) {                         // ist der slider aktiviert? 
//                     if (layer === selectedLayer) {                      // ist der aktuelle Layer der ausgewählte Layer? 
//                         layer.setVisible(true);                         // wenn es der gewählte Layer ist und der slider aktiv ist -> sieht man ihn 
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
//             [groupName]: checked // aktivieren und deaktivieren der slider -> prevState hat vorherigen Zustand, sodass nur die entsprechende Gruppe verändert wird
//         }));
//     }

//     return (
//         <div className='Slider'>
//             {groupsWithSlider.map((groupName) => {
//                 const groupLayers = layers.filter(layer => layer.get('groupName') === groupName); // Layer zur aktuellen Gruppe 

//                 const marks: any = {};
//                 groupLayers.forEach((layer: any, index: number) => {
//                     const fullYear = layer.get('year');
//                     marks[index] = "'" + fullYear.toString().slice(-2); // Extrahiere die letzten beiden Ziffern
//                 });

//                 return (
//                     <div key={groupName}> {/* für jede Gruppe rendern */}
//                        {/* <h3>{groupName}</h3>*/}
//                         <Checkbox 
//                             checked={sliderEnabled[groupName]}
//                             onChange={(e) => toggleSlider(groupName, e.target.checked)}
//                             style={{ marginBottom: '1rem' }}
//                         >
//                             {groupName} ein 
//                         </Checkbox>
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



// Code für Slider, die man an und ausschalten kann und Layer wechseln kann 
// import React, { useState, useEffect } from 'react';
// import { Slider, Checkbox } from 'antd';
// import Map from 'ol/Map';
// import './slider.css';

// export type SliderProps = {
//     map: Map;
// }

// export default function RasterSlider({ map }: SliderProps) {
//     const layers = map.getLayers().getArray();
//     const [groupsWithSlider, setGroupsWithSlider] = useState<string[]>([]);             // for groups with enableSlider = true
//     const [selectedLayerIndexes, setSelectedLayerIndexes] = useState<{ [key: string]: number }>({});    // renew the index of the group to change the year of the layer inside a group
//     const [sliderEnabled, setSliderEnabled] = useState<{ [key: string]: boolean }>({});     // to check and uncheck the slider 

//     useEffect(() => {
//         const groupsWithSlider: string[] = [];
//         const selectedLayerIndexes: { [key: string]: number } = {};
//         const sliderEnabled: { [key: string]: boolean } = {};

//         layers.forEach((layer: any) => {                                // Schleife fuer jeden Layer
//             const groupName = layer.get('groupName');                   // groupname von layern 
//             const enableSlider = layer.get('enableSlider');             // get Information for sliders 

//             if (enableSlider && groupName && !groupsWithSlider.includes(groupName)) { // wenn enableSlider und groupname true sind und der groupname noch nicht im Array groupsWithSlider vorhanden ist...
//                 groupsWithSlider.push(groupName);           // ... dann wird der groupname hinzugefügt; an array with according groupnames 
//                 selectedLayerIndexes[groupName] = 2;
//                 sliderEnabled[groupName] = false;
//             }
//         });

//         setGroupsWithSlider(groupsWithSlider);              // function for updating value 
//         setSelectedLayerIndexes(selectedLayerIndexes);
//         setSliderEnabled(sliderEnabled);
//     }, [layers]); // wird jedes Mal ausgeführt, wenn sich der Wert der layers ändert 

//     const onChange = (groupName: string, newValue: number) => { // function in case of changed slider; newValue: newIndex
//         setSelectedLayerIndexes(prevState => ({
//             ...prevState,
//             [groupName]: newValue           // enthält vorherigen Zustand und gibt neuen Zustand zurück; aktualisieren nur für betreffende Gruppe (Index der anderen Gruppen bleiben erhalten)
//         }));
//     }

//     // Rest nochmal nachvollziehen 

//     useEffect(() => {
//         groupsWithSlider.forEach(groupName => {
//             const groupLayers = layers.filter(layer => layer.get('groupName') === groupName); // für jeden Gruppennamen die Layer suchen 

//             const marks: any = {};
//             groupLayers.forEach((layer: any, index: number) => {
//                 const fullYear = layer.get('year');
//                 marks[index] = "'" + fullYear.toString().slice(-2); // Extrahiere die letzten beiden Ziffern
//             });

//             const selectedLayerIndex = selectedLayerIndexes[groupName];                         // der index des ausgewählten Layers in der jeweiligen Gruppe
//             const selectedLayer = groupLayers[selectedLayerIndex];                          // ausgerwählten Layer abrufen 
    
            
//             groupLayers.forEach((layer: any) => {
//                 if (sliderEnabled[groupName]) {                         // ist der slider aktiviert? 
//                     if (layer === selectedLayer) {                      // ist der aktuelle Layer der ausgewählte Layer? 
//                         layer.setVisible(true);                         // wenn es der gewählte Layer ist und der slider aktiv ist -> sieht man ihn 
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
//             [groupName]: checked // aktivieren und deaktivieren der slider -> prevState hat vorherigen Zustand, sodass nur die entsprechende Gruppe verändert wird
//         }));
//     }

//     return (
//         <div className='Slider'>
//             {groupsWithSlider.map((groupName) => {
//                 const groupLayers = layers.filter(layer => layer.get('groupName') === groupName); // Layer zur aktuellen Gruppe 

//                 const marks: any = {};
//                 groupLayers.forEach((layer: any, index: number) => {
//                     const fullYear = layer.get('year');
//                     marks[index] = "'" + fullYear.toString().slice(-2); // Extrahiere die letzten beiden Ziffern
//                 });

//                 return (
//                     <div key={groupName}> {/* für jede Gruppe rendern */}
//                        {/* <h3>{groupName}</h3>*/}
//                         <Checkbox 
//                             checked={sliderEnabled[groupName]}
//                             onChange={(e) => toggleSlider(groupName, e.target.checked)}
//                             style={{ marginBottom: '1rem' }}
//                         >
//                             {groupName} ein 
//                         </Checkbox>
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



// import React, { useState, useEffect } from 'react';
// import { Slider, Checkbox } from 'antd';
// import Map from 'ol/Map';
// import './slider.css';

// export type SliderProps = {
//     map: Map;
// }


// // 

// export default function RasterSlider({ map }: SliderProps) {
//     const layers = map.getLayers().getArray();
//     const [groupsWithSlider, setGroupsWithSlider] = useState<string[]>([]);             // for groups with enableSlider = true
//     const [selectedLayerIndexes, setSelectedLayerIndexes] = useState<{ [key: string]: number }>({});    // renew the index of the group to change the year of the layer inside a group
//     const [sliderEnabled, setSliderEnabled] = useState<{ [key: string]: boolean }>({});     // to check and uncheck the slider 

//     useEffect(() => {
//         const groupsWithSlider: string[] = [];
//         const selectedLayerIndexes: { [key: string]: number } = {};
//         const sliderEnabled: { [key: string]: boolean } = {};

//         layers.forEach((layer: any) => {                                // Schleife fuer jeden Layer
//             const groupName = layer.get('groupName');                   // groupname von layern 
//             const enableSlider = layer.get('enableSlider');             // get Information for sliders 

//             if (enableSlider && groupName && !groupsWithSlider.includes(groupName)) { // wenn enableSlider und groupname true sind und der groupname noch nicht im Array groupsWithSlider vorhanden ist...
//                 groupsWithSlider.push(groupName);           // ... dann wird der groupname hinzugefügt; an array with according groupnames 
//                 selectedLayerIndexes[groupName] = 2;
//                 sliderEnabled[groupName] = false;
//             }
//         });

//         setGroupsWithSlider(groupsWithSlider);              // function for updating value 
//         setSelectedLayerIndexes(selectedLayerIndexes);
//         setSliderEnabled(sliderEnabled);
//     }, [layers]); // wird jedes Mal ausgeführt, wenn sich der Wert der layers ändert 

//     const onChange = (groupName: string, newValue: number) => { // function in case of changed slider; newValue: newIndex
//         setSelectedLayerIndexes(prevState => ({
//             ...prevState,
//             [groupName]: newValue           // enthält vorherigen Zustand und gibt neuen Zustand zurück; aktualisieren nur für betreffende Gruppe (Index der anderen Gruppen bleiben erhalten)
//         }));
//     }

//     // Rest nochmal nachvollziehen 

//     useEffect(() => {
//         groupsWithSlider.forEach(groupName => {
//             const groupLayers = layers.filter(layer => layer.get('groupName') === groupName); // für jeden Gruppennamen die Layer suchen 

//             const marks: any = {};
//             groupLayers.forEach((layer: any, index: number) => {
//                 const fullYear = layer.get('year');
//                 marks[index] = "'" + fullYear.toString().slice(-2); // Extrahiere die letzten beiden Ziffern
//             });

//             const selectedLayerIndex = selectedLayerIndexes[groupName];                         // der index des ausgewählten Layers in der jeweiligen Gruppe
//             const selectedLayer = groupLayers[selectedLayerIndex];                          // ausgerwählten Layer abrufen 
    
            
//             groupLayers.forEach((layer: any) => {
//                 if (sliderEnabled[groupName]) {                         // ist der slider aktiviert? 
//                     if (layer === selectedLayer) {                      // ist der aktuelle Layer der ausgewählte Layer? 
//                         layer.setVisible(true);                         // wenn es der gewählte Layer ist und der slider aktiv ist -> sieht man ihn 
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
//             [groupName]: checked // aktivieren und deaktivieren der slider -> prevState hat vorherigen Zustand, sodass nur die entsprechende Gruppe verändert wird
//         }));
//     }

//     return (
//         <div className='Slider'>
//             {groupsWithSlider.map((groupName) => {
//                 const groupLayers = layers.filter(layer => layer.get('groupName') === groupName); // Layer zur aktuellen Gruppe 

//                 const marks: any = {};
//                 groupLayers.forEach((layer: any, index: number) => {
//                     const fullYear = layer.get('year');
//                     marks[index] = "'" + fullYear.toString().slice(-2); // Extrahiere die letzten beiden Ziffern
//                 });

//                 return (
//                     <div key={groupName}> {/* für jede Gruppe rendern */}
//                        {/* <h3>{groupName}</h3>*/}
//                         <Checkbox 
//                             checked={sliderEnabled[groupName]}
//                             onChange={(e) => toggleSlider(groupName, e.target.checked)}
//                             style={{ marginBottom: '1rem' }}
//                         >
//                             {groupName} ein 
//                         </Checkbox>
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











    