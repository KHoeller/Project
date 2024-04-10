import React, {useEffect, useState} from 'react';
import * as echarts from 'echarts'; 
import { Map } from 'ol';

import { MapBrowserEvent } from 'ol';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS.js';

export type TimeChartProps = {
    map: Map;
};

export const TimeChart: React.FC<TimeChartProps> = ({map}) => {

    const [selectedFeatureInfo, setSelectedFeatureInfo] = useState<
        {
            year: string;
            name: string;
            groupName: string;
            url: any;
            layerAttributes: { attributeName: string; value: string }[];
        }[]
    >([]);

    useEffect(() => {
        const handleClick = async (evt: MapBrowserEvent<any>) => {
            const viewResolution = map.getView().getResolution() ?? 0;
    
            // Objekt zur Speicherung von Layernamen pro Gruppe
            const layerNamesByGroup = {};
    
            const allLayers = map.getLayers().getArray().filter(layer => {
                return layer.get('enableSlider') === true;
            });
    
            console.log('allLayers:', allLayers); // allLayers ist in Ordnung, da sind nur die mit enableSlider = true 
            // Iteriere über jeden Layer und gruppieren nach Gruppennamen
            allLayers.forEach(layer => {
                const layerGroupName = layer.get('groupName');
                const layerName = layer.get('name');
    
                if (!layerNamesByGroup[layerGroupName]) {
                    // Wenn die Gruppe noch nicht im Objekt existiert, erstelle ein leeres Array für diese Gruppe
                    layerNamesByGroup[layerGroupName] = [];
                }
    
                // Füge den Layernamen zur entsprechenden Gruppe hinzu, falls der Layer sichtbar ist
                
                    layerNamesByGroup[layerGroupName].push(layerName);
                
            });

            
    
            console.log('layerNamesByGRoup:', layerNamesByGroup);
            // Iteriere über die Gruppen im Objekt
            Object.keys(layerNamesByGroup).forEach(async groupName => {

                const layersInGroup = layerNamesByGroup[groupName];

                const updateUrlByGroup: string[] = [];

                const grayIndexByGroup: string[] = []; 

                const yearByGroup: string[] = []; 
    
                // Iteriere über die Layernamen in der aktuellen Gruppe
                await Promise.all(layersInGroup.map(async layerName => {
                    const layer = allLayers.find(l => l.get('name') === layerName);
    
                    if (layer instanceof TileLayer) {
                        const isLayerQueryable = layer.get('queryable') ?? false;
                        const year = layer.get('year') ?? false; 
                        console.log('year:', year) 
                        console.log('layername:', layerName);
                        const source = layer.getSource();
    
                        if (isLayerQueryable && source instanceof TileWMS) {
                            const hitTolerance = 50;
                            const url = source.getFeatureInfoUrl(
                                evt.coordinate,
                                viewResolution,
                                'EPSG:3857',
                                { 'INFO_FORMAT': 'application/json', 'BUFFER': hitTolerance.toString() }
                            );
    
                            
                            if (url) {
                                const urlArr = url.split('&');
                                const updatedUrl = urlArr.map(param => {
                                    if (param.startsWith('QUERY_LAYERS=')) {
                                        return `QUERY_LAYERS=${encodeURIComponent(layerName)}`;
                                    } else if (param.startsWith('LAYERS=')) {
                                        return `LAYERS=${encodeURIComponent(layerName)}`;
                                    } else {
                                        return param;
                                    }
                                }).join('&');
    
                                console.log('Updated URL5:', updatedUrl);

                                updateUrlByGroup.push(updatedUrl); 

                                if (url) {
                                    fetch(url)
                                        .then((response) => response.json())
                                        .then((responseObject) => {
                                            console.log(responseObject);
                                            if (responseObject.features && responseObject.features.length > 0) {
                                                const grayIndex = responseObject.features[0].properties.GRAY_INDEX;
                                                console.log('grIndex:', grayIndex);
                                                grayIndexByGroup.push(grayIndex);
                                                yearByGroup.push(year); 
                                            }
                                        })
                                        .catch(error => {
                                            
                                            console.log('my error is ', error);
                                            alert('Sorry, es ist ein Fehler aufgetreten') // TODO Show user an error -> kann man sicherlich noch etwas schöner gestalten 
                                        });
                                }

                                                               
    
                               
                            }
                            
                        }
                    }
                    console.log('Updated URL in group :', updateUrlByGroup);
                    console.log('allGRays:', grayIndexByGroup);
                    console.log('yearsByGroup:', yearByGroup); 

                    updateUrlByGroup.forEach(async updatedUrl => {

                    })
                }));
                

                
            });
        };
    
        map.on('singleclick', handleClick);
    
        return () => {
            map.un('singleclick', handleClick);
        };
    }, [map]); 

    // useEffect(() => {
    //     const handleClick = async (evt: MapBrowserEvent<any>) => {          // EventListener für Klick-Ereignisse; jedes Mal bei Click auf die Karte abgerufen
    //         const viewResolution = map.getView().getResolution() ?? 0;      // get current view Resolution to chose the right pixel 
           
    //         const allLayerInfo = [];

    //         const layerNamesByGroup = {}; 
    //         const filteredLayers = map.getLayers().getArray().filter(layer => {
    //         });

    //         filteredLayers.forEach(layer => {
    //             const layerGroupName = layer.get('groupName');
    //             const layerName = layer.get('name');
        
    //             if (!layerNamesByGroup[layerGroupName]) {
    //                 // Wenn die Gruppe noch nicht im Objekt existiert, erstelle ein leeres Array für diese Gruppe
    //                 layerNamesByGroup[layerGroupName] = [];
    //             }
        
    //             // Füge den Layernamen zur entsprechenden Gruppe hinzu
    //             layerNamesByGroup[layerGroupName].push(layerName);
    //         });


    //         await Promise.all(filteredLayers.map(async layer =>  { 
                       
            
    //              // asynchrone Funkion; erwartet einen Array von Promises; Funktion auf alle Layer der Karte anwenden
    //             if (layer instanceof TileLayer) {                                   // wenn es ein TileLayer ist: 
    //                 const isLayerQueryable = layer.get('queryable') ?? false;       // queryable abrufen (falls nicht vorhanden = false)
    //                 const isLayerVisible = layer.get('visible') ?? false;           // visible abrufen (falls nicht vorhanden false)
                    
    //                 const name = layer.get('name');                              // save the title 
    //                 const groupName = layer.get('groupName');
    //                 const year = layer.get('year');
                    

    //                 if (isLayerQueryable && isLayerVisible) {                       // if Layer is queryable and visible
    //                     const source = layer.getSource();                           // get Source of the layer 

    //                     if (source instanceof TileWMS) {                            // if it is a TileWMS 
                                                        
    //                         const url = source?.getFeatureInfoUrl(                  // create an url for getting feature information for an exact position and resolution 
    //                             evt.coordinate,
    //                             viewResolution,
    //                             'EPSG:3857',
    //                             { 'INFO_FORMAT': 'application/json', /*'BUFFER': hitTolerance.toString()*/ } // response as json
    //                         );



                            

    //                         if (url) {                                          // if the url is true                             
    //                             try {
    //                                 const response = await fetch(url);          // call the url and get a response; await -> wait until there is an answer
    //                                 if (!response.ok) {                         // check if the request was successfull 
    //                                     throw new Error('Network response was not ok'); // if response was not okay, get an error 
    //                                 }
    //                                 const responseObject = await response.json();           // change the response in a javascript object, wait until process is completed
                                   
    //                                 let grayIndex; 
    //                                 if (responseObject.features && responseObject.features.length > 0) {
    //                                     grayIndex = responseObject.features[0].properties.GRAY_INDEX; // Direkter Zugriff auf GRAY_INDEX
                            
    //                                     console.log(grayIndex);
                                        
    //                                 }

    //                                 allLayerInfo.push({ year, name, groupName, url, grayIndex });
    //                                 setSelectedFeatureInfo(allLayerInfo);



    //                             } catch (error) {
    //                                 console.error('Error fetching or processing data:', error);
    //                             }
    //                         }                           
    //                     } 
    //                 }
    //             }
    //         }));   
    //         // console.log(allLayerInfo); 

    //         // const groupedLayers: { } = {};
    //         // allLayerInfo.forEach(info => {
    //         //     if (!groupedLayers[info.groupName]) {
    //         //         groupedLayers[info.groupName] = [];
    //         //     }
    //         //     groupedLayers[info.groupName].push(info);
    //         // });
            

    //         // console.log('Grouped Layers:', groupedLayers);
    //     };
    //     map.on('singleclick', handleClick);

    // return () => {
    //     map.un('singleclick', handleClick);
    // };
    // }, []);             

        // für jeden Layer einen Link erstellen und dann in ein Object pushen? 


        // nicht auf alle Layer anwenden, sondern auf die Gruppen mit enableSlider = true 


    useEffect(() => {
        var chartDom = document.getElementById('main');
        var myChart = echarts.init(chartDom);
        var option;

        option = {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                data: [150, 230, 224, 218, 135, 147, 260],
                type: 'line'
                }
            ]
        };
        myChart.setOption(option);

        return () => {
            myChart.dispose(); // Aufräumen bei Komponentenentfernung
        };
    }, []);

  return <div id="main" style={{ width: '100%', height: '300px' }}></div>;
};

//     var chartDom = document.getElementById('main');
//     var myChart = echarts.init(chartDom);
//     // var option;

//     // Verwende die gesammelten und gruppierten Daten, um die xAxis- und series-Daten für die Chart zu erstellen
//         console.log('seelectedFEature:', selectedFeatureInfo);
//         const years = selectedFeatureInfo.map(info => info.year);
//         console.log('years:', years); 
//         const seriesData = selectedFeatureInfo.map(info => ({
//             type: 'line',
//             data: info.layerAttributes.map(attr => attr.value)
//         }));
//         console.log('series', seriesData);

//         const option = {
//             xAxis: {
//                 type: 'category',
//                 data: years
//             },
//             yAxis: {
//                 type: 'value'
//             },
//             series: seriesData
//         };

//         myChart.setOption(option);

//         return () => {
//             myChart.dispose();
//         };
//     }, [selectedFeatureInfo]);

//     return <div id="main" style={{ width: '100%', height: '300px' }}></div>;
// };

export default TimeChart;
  

// // console.log('url', url);
                            // const urlArr = url?.split('&'); 
                           
                            // const titleLayer = name.slice();
                            
                            // const updatedUrl = urlArr?.map(param => {
                            //     if (param.startsWith('QUERY_LAYERS=')) {
                            //         return `QUERY_LAYERS=${encodeURIComponent(titleLayer)}`;
                            //     } else if (param.startsWith('LAYERS=')) {
                            //         return `LAYERS=${encodeURIComponent(titleLayer)}`;
                            //     } else {
                            //         return param;
                            //     }
                            // })
                            // .join('&');
                            
                            // console.log('Updated URL:', updatedUrl);

                            // if (groupName) {
                            //     if (!groupedLayers[groupName]) {
                            //         groupedLayers[groupName] = [];
                            //     }
                            //     groupedLayers[groupName].push(layer);
                            // }


// // Grundgerüst Chart 
// export const TimeChart = (/*{map}: TimeChartProps*/) => {


//     useEffect(() => {
//         var chartDom = document.getElementById('main');
//         var myChart = echarts.init(chartDom);
//         var option;

//         option = {
//             xAxis: {
//                 type: 'category',
//                 data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//             },
//             yAxis: {
//                 type: 'value'
//             },
//             series: [
//                 {
//                 data: [150, 230, 224, 218, 135, 147, 260],
//                 type: 'line'
//                 }
//             ]
//         };
//         myChart.setOption(option);

//         return () => {
//             myChart.dispose(); // Aufräumen bei Komponentenentfernung
//         };
//     }, []);

//   return <div id="main" style={{ width: '100%', height: '300px' }}></div>;
// };

// export default TimeChart;