
import React, { useState, useEffect } from 'react';
import Map from 'ol/Map';
import { Tree, Checkbox, Grid } from 'antd';
import RasterSlider from '../Slider_RasterData/slider'; // Stelle sicher, dass du den Pfad entsprechend anpasst

export type LayerTreeProps = {
    map: Map;
}

export default function LayerTreeSlider({ map }: LayerTreeProps) {
    // const layers = map.getLayers().getArray();
    const [layerGroups, setLayerGroups] = useState<{ [groupName: string]: any[] }>({});

    const [checkedGroups, setCheckedGroups] = useState<string[]>([]);

    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

    useEffect(() => {
        const layers = map.getLayers().getArray();
        const updatedLayerGroups: { [groupName: string]: any[] } = {};

        layers.forEach(layer => {
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
                    layer: layer
                });
            }
        });

        setLayerGroups(updatedLayerGroups);
        console.log(updatedLayerGroups);
    }, [map]);

    
    const onCheck = (
        checked: React.Key[] | 
        { checked: React.Key[]; 
        }) => {
            const checkedGroupNames = Array.isArray(checked) ? checked.map(key => String(key)) : checked.checked.map(key => String(key));
            setCheckedGroups(checkedGroupNames);
            // setExpandedGroups(checkedGroupNames);
            console.log('checkedGroups', checkedGroupNames); 

            // layers.forEach(layer => {
            //     const groupName = layer.get('groupName');
            //     if (groupName && !checkedGroupNames.includes(groupName)) {
            //         layer.setVisible(false);
            //     }
            // });

            const newExpandedGroups = [...expandedGroups];
    checkedGroupNames.forEach(groupName => {
        if (!newExpandedGroups.includes(groupName)) {
            newExpandedGroups.push(groupName);
        }
    });
    setExpandedGroups(newExpandedGroups);

            

    };
    

    // Erstellen treeData-Struktur 
    const treeData = Object.keys(layerGroups).map(groupName => ({
        title: groupName,
        key: groupName,
        
        children: [{
        
            title: <RasterSlider 
                        group={layerGroups[groupName]} 
                        groupName={groupName} 
                        checked={checkedGroups.includes(groupName)} 
                    />,
            key: `slider_${groupName}`, // Eindeutiger Schlüssel für den Slider
            checkable: false,
        }],
        // checkable: false
    }));
   
//     layerGroups[groupName].map(layer => ({
        //     title: layer.name,
        //     key: layer.name,
        //     layerInfo: layer 
        // })).concat({
    
        

    return (
        <Tree 
            checkable
            selectable={false}
            treeData={treeData} 
            checkedKeys={checkedGroups}
            expandedKeys={expandedGroups}
            onCheck={onCheck}
            onExpand={(expandedKeys, info) => setExpandedGroups(expandedKeys as string[])}
            
        />
    );
}