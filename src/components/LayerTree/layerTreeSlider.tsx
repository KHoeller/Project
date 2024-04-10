
// der Part des LayerTrees holt sich keine Informationen über die aktuell sichtbaren Layer in map 
// -> sofern Raster initial state visible = true ein Problem 


import React, { useState, useEffect } from 'react';
import Map from 'ol/Map';
import { Tree } from 'antd';
import RasterSlider from '../Slider_RasterData/slider'; 
import InfoIcon from '../LayerGroupInfo/layerGroupInfo';
import Legende from '../Legende/legendSlider';

export type LayerTreeSliderProps = {
    map: Map;
}

export default function LayerTreeSlider({ map }: LayerTreeSliderProps) {
    
    const [layerGroups, setLayerGroups] = useState<{ [groupName: string]: any[] }>({});
    const [checkedGroups, setCheckedGroups] = useState<string[]>([]);
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

    useEffect(() => {
        const layers = map.getLayers().getArray();
        const reversedLayers = layers.slice().reverse();
        const updatedLayerGroups: { [groupName: string]: any[] } = {};

        reversedLayers.forEach(layer => {
            const groupName = layer.get('groupName');
            const enableSlider = layer.get('enableSlider');

            if (groupName && enableSlider === true) {
                if (!updatedLayerGroups[groupName]) {
                    updatedLayerGroups[groupName] = [];
                }

                updatedLayerGroups[groupName].push({
                    name: layer.get('name'),
                    title: layer.get('title'),
                    visible: layer.get('visible') || false,
                    info: layer.get('info') || false,
                    infoText: layer.get('infoText') || false,
                    infoTextTitle: layer.get('infoTextTitle') || false,
                    year: layer.get('year'),
                    enableSlider: enableSlider || false,
                    queryable: layer.get('queryable') || false, 
                    layerType: layer.get('layerType'),
                    layer: layer,
                    urlLegend: layer.get('urlLegend'),
                    legend: layer.get('legend'),
                });
            }
        });

        setLayerGroups(updatedLayerGroups);
        // console.log('updatedLayerGroups:', updatedLayerGroups);
    }, [map]);


    const onCheck = (checkedKeys: React.Key[] | { checked: React.Key[]; }) => {
        
        const checkedKeysArray = Array.isArray(checkedKeys) ? checkedKeys.map(key => String(key)) : checkedKeys.checked.map(key => String(key));
        const checkedKeyArray = [checkedKeysArray[checkedKeysArray.length - 1]]         // kann man mit Sicherheit auch schöner machen; derzeit wird immer der zuletzt hinzugefügt verwendet und weitergegeben, damit immer nur ein Layer checked und visible ist!

        console.log('checkedKeys:', checkedKeyArray); 
        
        setCheckedGroups(checkedKeyArray);


        // Update expanded groups to include newly checked groups
        const newExpandedGroups = [...expandedGroups];
        checkedKeyArray.forEach(groupName => {
            if (!newExpandedGroups.includes(groupName)) {
                newExpandedGroups.push(groupName);
            }
        });
        setExpandedGroups(newExpandedGroups);
    };


    // Filter out groups that are not checked and set their visibility to false
    useEffect(() => {
        const uncheckedGroups = Object.keys(layerGroups).filter(groupName => !checkedGroups.includes(groupName));
        uncheckedGroups.forEach(groupName => {
            layerGroups[groupName].forEach(layerInfo => {
                layerInfo.layer.setVisible(false);
            });
        });
    }, [checkedGroups, layerGroups]);
    

    // Erstellen treeData-Struktur 
    const treeData = Object.keys(layerGroups).map(groupName => ({
        title: (
            <>
                {groupName}
                <InfoIcon infoTextTitle={layerGroups[groupName][0].infoTextTitle} infoText={layerGroups[groupName][0].infoText} /> 
            </>
            // InfoModal mithilfe des InfoIcons oeffnen -> einfuegen neben dem groupName 
        ),
        key: groupName,
        
        children: [{
        
            title: 
                <>
                    <RasterSlider 
                        group={layerGroups[groupName]} 
                        groupName={groupName} 
                        checked={checkedGroups.includes(groupName)} 
                    />
                    <Legende 
                        group={layerGroups[groupName]} 
                        groupName={groupName} 
                        checked={checkedGroups.includes(groupName)} 
                    />
                </>,
            key: `slider_${groupName}`, 
            checkable: false,
            
        }],
    }));

    return (
        <Tree 
            checkable
            selectable={false}
            treeData={treeData} 
            checkedKeys={checkedGroups}
            expandedKeys={expandedGroups}
            onCheck={onCheck}
            onExpand={(expandedKeys) => setExpandedGroups(expandedKeys as string[])}
        />
    );
}