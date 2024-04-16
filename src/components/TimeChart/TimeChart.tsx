

import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { Map } from 'ol';
import { MapBrowserEvent } from 'ol';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS.js';

import './TimeChart.css';

export type TimeChartProps = {
    map: Map;
};

export const TimeChart: React.FC<TimeChartProps> = ({ map }) => {
    const [chartData, setChartData] = useState<{ year: string[]; grayIndex: string[] }>({ year: [], grayIndex: [] });
    const [groupName, setGroupName] = useState<string | null>(null);


    useEffect(() => {
        const handleClick = async (evt: MapBrowserEvent<any>) => {
            
            const viewResolution = map.getView().getResolution() ?? 0;

            const layerNamesByGroup: { [key: string]: string[] } = {};
            // console.log('layerperGrouip', layerNamesByGroup); 
            const allLayers = map.getLayers().getArray().filter(layer => layer.get('enableSlider') === true);
            // console.log(allLayers);

            allLayers.forEach(layer => {
                const layerGroupName = layer.get('legendGroupName');
                const layerName = layer.get('name');

                if (!layerNamesByGroup[layerGroupName]) {
                    layerNamesByGroup[layerGroupName] = [];
                }

                layerNamesByGroup[layerGroupName].push(layerName);
            });

            const promises: any = [];
            let visibleGroupName: string;

            Object.keys(layerNamesByGroup).forEach(groupName => {

                
                const layersInGroup = layerNamesByGroup[groupName];

                // Check if at least one layer in the group is visible
                const isVisible = layersInGroup.some(layerName =>
                    allLayers.find(l => l.get('name') === layerName)?.getVisible()
                );

                if (isVisible) {
                    layersInGroup.forEach(layerName => {
                        const layer = allLayers.find(l => l.get('name') === layerName);

                        if (layer instanceof TileLayer) {
                            const isLayerQueryable = layer.get('queryable') ?? false;
                            const year = layer.get('year') ?? false;
                            const source = layer.getSource();

                            if (isLayerQueryable && source instanceof TileWMS) {
                                // const hitTolerance = 50;
                                const url = source.getFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:3857', {
                                    'INFO_FORMAT': 'application/json',
                                    /*'BUFFER': hitTolerance.toString()*/
                                });

                                if (url) {
                                    const promise = fetch(url)
                                        .then(response => response.json())
                                        .then(responseObject => {
                                            if (responseObject.features && responseObject.features.length > 0) {
                                                const grayIndex = responseObject.features[0].properties.GRAY_INDEX;
                                                return { year, grayIndex };
                                            }
                                            return null;
                                        })
                                        .catch(error => {
                                            console.log('Error fetching data:', error);
                                            return null;
                                        });

                                    promises.push(promise);
                                }
                            }
                        }
                    });
                    visibleGroupName = groupName;
                }
            });

            Promise.all(promises).then(results => {
                const filteredResults = results.filter(result => result !== null);
                
                const years = filteredResults.map(result => result.year);
                const grayIndexes = filteredResults.map(result => result.grayIndex);

                const sortedData = sortByYear(years, grayIndexes);
                setChartData({ year: sortedData.years, grayIndex: sortedData.grayIndexes });

                setGroupName(visibleGroupName);
            });
        };

        const sortByYear = (years: string[], grayIndexes: string[]) => {
            // Erstelle ein Array von Objekten, das Jahr und grayIndex enthält
            const data = years.map((year, index) => ({ year, grayIndex: grayIndexes[index] }));
            
            // Sortiere das Array nach dem Jahr (aufsteigend)
            data.sort((a, b) => parseInt(a.year) - parseInt(b.year));
            
            // Extrahiere die sortierten Jahre und grayIndexes zurück
            const sortedYears = data.map(item => item.year);
            const sortedGrayIndexes = data.map(item => item.grayIndex);
            
            return { years: sortedYears, grayIndexes: sortedGrayIndexes };
        };


        map.on('singleclick', handleClick);

        return () => {
            map.un('singleclick', handleClick);
        };
    }, [map]);

    useEffect(() => {
        // console.log(chartData);
        if (chartData.year.length > 0 && chartData.grayIndex.length > 0) {
            const chartDom = document.getElementById('main');
            if (!chartDom) return;

            const myChart = echarts.init(chartDom);

            const option = {
                title: {
                    text: groupName || '',
                    left: 'center', // Zentrieren Sie den Titel über dem Chart
                    textStyle: {
                        fontSize: 14,
                        fontWeight: 'bold'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: chartData.year
                },
                yAxis: {
                    type: 'value'
                },
                series: {
                    data: chartData.grayIndex,
                    type: 'line'
                },
                axisPointer: {
                    show: true,
                    snap: true,
                    type: 'line',
                }
            };

            myChart.setOption(option);

            return () => {
                myChart.dispose();
            };
        }
    }, [chartData]);

    return <div id="main" style={{ width: '300px', height: '300px'}}></div>;
};

export default TimeChart;





// -> Problem die Daten an useEffect mit Chart zu übergeben 
    // import React, {useEffect, useState} from 'react';
    // import * as echarts from 'echarts'; 
    // import { Map } from 'ol';

    // import { MapBrowserEvent } from 'ol';
    // import TileLayer from 'ol/layer/Tile';
    // import TileWMS from 'ol/source/TileWMS.js';

    // export type TimeChartProps = {
    //     map: Map;
    // };

    // export const TimeChart: React.FC<TimeChartProps> = ({map}) => {

    //     // const [selectedFeatureInfo, setSelectedFeatureInfo] = useState<
    //     //     {
    //     //         year: string;
    //     //         name: string;
    //     //         groupName: string;
    //     //         url: any;
    //     //         layerAttributes: { attributeName: string; value: string }[];
    //     //     }[]
    //     // >([]);

    //     const [chartData, setChartData] = useState<{ year: string[]; grayIndex: string[] }>({ year: [], grayIndex: [] });
    

    //     useEffect(() => {
    //         const handleClick = async (evt: MapBrowserEvent<any>) => {
    //             const viewResolution = map.getView().getResolution() ?? 0;
        
    //             // Objekt zur Speicherung von Layernamen pro Gruppe
    //             const layerNamesByGroup = {};
        
    //             const allLayers = map.getLayers().getArray().filter(layer => {
    //                 return layer.get('enableSlider') === true;
    //             });
        
    //             console.log('allLayers:', allLayers); // allLayers ist in Ordnung, da sind nur die mit enableSlider = true 
    //             // Iteriere über jeden Layer und gruppieren nach Gruppennamen
            
            
    //             allLayers.forEach(layer => {
    //                 const layerGroupName = layer.get('groupName');
    //                 const layerName = layer.get('name');
        
    //                 if (!layerNamesByGroup[layerGroupName]) {
    //                     // Wenn die Gruppe noch nicht im Objekt existiert, erstelle ein leeres Array für diese Gruppe
    //                     layerNamesByGroup[layerGroupName] = [];
    //                 }
        
    //                 // Füge den Layernamen zur entsprechenden Gruppe hinzu, falls der Layer sichtbar ist
                    
    //                     layerNamesByGroup[layerGroupName].push(layerName);
                    
    //             });

                
    //             console.log('layerNamesByGRoup:', layerNamesByGroup);
    //             // Iteriere über die Gruppen im Objekt
            
                
    //                 Object.keys(layerNamesByGroup).forEach(async groupName => {

    //                     const layersInGroup = layerNamesByGroup[groupName];

    //                     const updateUrlByGroup: string[] = [];
    //                     const grayIndexByGroup: string[] = []; 

    //                     const yearByGroup: string[] = []; 

            
    //                     // Iteriere über die Layernamen in der aktuellen Gruppe
    //                     await Promise.all(layersInGroup.map(async layerName => {
    //                         const layer = allLayers.find(l => l.get('name') === layerName);
            
    //                         if (layer instanceof TileLayer) {
    //                             const isLayerQueryable = layer.get('queryable') ?? false;
    //                             const year = layer.get('year') ?? false; 
    //                             console.log('year:', year) 
    //                             console.log('layername:', layerName);
    //                             const source = layer.getSource();
            
    //                             if (isLayerQueryable && source instanceof TileWMS) {
    //                                 const hitTolerance = 50;
    //                                 const url = source.getFeatureInfoUrl(
    //                                     evt.coordinate,
    //                                     viewResolution,
    //                                     'EPSG:3857',
    //                                     { 'INFO_FORMAT': 'application/json', 'BUFFER': hitTolerance.toString() }
    //                                 );
            
                                    
    //                                 if (url) {
    //                                     const urlArr = url.split('&');
    //                                     const updatedUrl = urlArr.map(param => {
    //                                         if (param.startsWith('QUERY_LAYERS=')) {
    //                                             return `QUERY_LAYERS=${encodeURIComponent(layerName)}`;
    //                                         } else if (param.startsWith('LAYERS=')) {
    //                                             return `LAYERS=${encodeURIComponent(layerName)}`;
    //                                         } else {
    //                                             return param;
    //                                         }
    //                                     }).join('&');
            
    //                                     console.log('Updated URL5:', updatedUrl);

    //                                     updateUrlByGroup.push(updatedUrl); 

    //                                     if (url) {
    //                                         fetch(url)
    //                                             .then((response) => response.json())
    //                                             .then((responseObject) => {
    //                                                 console.log(responseObject);
    //                                                 if (responseObject.features && responseObject.features.length > 0) {
    //                                                     const grayIndex = responseObject.features[0].properties.GRAY_INDEX;
    //                                                     console.log('grIndex:', grayIndex);
    //                                                     grayIndexByGroup.push(grayIndex);
    //                                                     yearByGroup.push(year); 
    //                                                 }
    //                                             })
    //                                             .catch(error => {
                                                    
    //                                                 console.log('my error is ', error);
    //                                                 alert('Sorry, es ist ein Fehler aufgetreten') // TODO Show user an error -> kann man sicherlich noch etwas schöner gestalten 
    //                                             });
    //                                     }

                                                                    
            
                                    
    //                                 }
                                    
    //                             }
    //                         }
    //                         console.log('Updated URL in group :', updateUrlByGroup);

                            
    //                         // updateUrlByGroup.forEach(async updatedUrl => {

    //                         // })
    //                     })
    //                     );
                    
                    
                
    //                 });
            
    //             console.log('allGRays:', grayIndexByGroup);
    //             console.log('yearsByGroup:', yearByGroup); 
    //             setChartData({ year: yearByGroup, grayIndex: grayIndexByGroup });
    //             // console.log('chartDate', chartData);
    //         };
        
    //         map.on('singleclick', handleClick);
        
    //         return () => {
    //             map.un('singleclick', handleClick);
    //         };

                    

    //     }, [map]); 

        

    // useEffect(() => {
        
    //     console.log('chartDate2', chartData);
    //         var chartDom = document.getElementById('main');
    //         var myChart = echarts.init(chartDom);
    //         var option;        

    //         option = {
    //                 xAxis: {
    //                     type: 'category',
    //                     data: [
    //                         2008, 
    //                         2010,
    //                         2011, 
    //                         2014, 
    //                         2015, 
    //                         2020,
    //                         2019,
    //                         2012,
    //                         2007,
    //                         2021,
    //                         2017,
    //                         2018,
    //                         2013,
    //                         2016
    //                     ],
    //                 },
    //                 yAxis: {
    //                     type: 'value'
    //                 },
    //                 series: {
    //                     data: [
    //                         14.573554039001465, 15.933281898498535, 15.751803398132324, 13, 11.989399909973145,
    //                         8.276280403137207, 9.798288345336914, 13.511990547180176, 13.285956382751465,
    //                         9.267499923706055, 11.532699584960938, 11.93340015411377, 14.588587760925293,
    //                         11.60949993133545
    //                     ],
    //                     type: 'line',
    //                 },
    //             };

    //             myChart.setOption(option);

    //             return () => {
    //                 myChart.dispose();
    //             };
            
    //     }, [chartData]);

    //     return <div id="main" style={{ width: '100%', height: '300px' }}></div>;
    // };

    // export default TimeChart;
  

// Abruf der Daten, in dem für jeden Layer die entsprechende URL generiert wird 
// console.log('url', url);
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


