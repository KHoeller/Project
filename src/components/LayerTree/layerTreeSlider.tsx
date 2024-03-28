
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

    
    const onCheck = (checked: React.Key[] | { checked: React.Key[]; }) => {
        const checkedGroupNames = Array.isArray(checked) ? 
            checked.map(key => String(key)) : 
            checked.checked.map(key => String(key));

        setCheckedGroups(checkedGroupNames);
        
        console.log('checkedGroups', checkedGroupNames); 

        const newExpandedGroups = [...expandedGroups];
        checkedGroupNames.forEach(groupName => {
            if (!newExpandedGroups.includes(groupName)) {
            newExpandedGroups.push(groupName);
        }
    });

        setExpandedGroups(newExpandedGroups);
    };

    const handleGroupCollapse = (groupName: string) => {
        setExpandedGroups(prevExpandedGroups => prevExpandedGroups.filter(group => group !== groupName));
    };
    

    // Erstellen treeData-Struktur 
    const treeData = Object.keys(layerGroups).map(groupName => ({
        title: (
            <span>
                {groupName}
                <InfoIcon infoTextTitle={layerGroups[groupName][0].infoTextTitle} infoText={layerGroups[groupName][0].infoText} /> 
            </span>
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
                        onGroupCollapse={handleGroupCollapse}
                    />
                    <Legende 
                        group={layerGroups[groupName]} 
                        groupName={groupName} 
                        checked={checkedGroups.includes(groupName)} 
                        onGroupCollapse={handleGroupCollapse}
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