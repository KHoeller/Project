// TimeChart auf Basis der jährlichen Rasterwerte (Vorlage: https://echarts.apache.org/examples/en/editor.html?c=line-simple)

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
          

            const allLayers = map.getLayers().getArray().filter(layer => layer.get('enableSlider') === true);
        

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
                                // const hitTolerance = 50; // Hit Tolerance ist hier üüberflüssig, weil ich nur für die genau geclickte Rasterzelle die Werte haben möchte 
                                const url = source.getFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:3857', {
                                    'INFO_FORMAT': 'application/json',
                                });

                                if (url) { // ask for feature with the url 
                                    const promise = fetch(url)
                                        .then(response => response.json())
                                        .then(responseObject => {
                                            if (responseObject.features && responseObject.features.length > 0) {
                                                const grayIndex = responseObject.features[0].properties.GRAY_INDEX; // ask for gray-index
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
                
                const years = filteredResults.map(result => result.year);               // for x-axis
                const grayIndexes = filteredResults.map(result => result.grayIndex);    // for y.axis

                const sortedData = sortByYear(years, grayIndexes);
                setChartData({ year: sortedData.years, grayIndex: sortedData.grayIndexes }); // create ChartDataStructure and sort by year 

                setGroupName(visibleGroupName);
            });
        };

        // function to sort data by year 
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
     
        if (chartData.year.length > 0 && chartData.grayIndex.length > 0) {
            const chartDom = document.getElementById('main');
            if (!chartDom) return;

            const myChart = echarts.init(chartDom);

            const option = {
                title: {
                    text: groupName || '',
                    subtext: 'Zeitliche Entwicklung der Konzentration', // Sub-heading  
                    left: 'center', // Titel zentrieren
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
