// // LayerTree 1: (alle Layer ohne Slider)

// // basiert auf den Layern von map; 
// // ist gruppiert entsprechend der config
// // icons/modals neben dem Gruppentitel, sofern in der Config angegeben 


import React, { useState, useEffect } from 'react';
import Map from 'ol/Map';
import { Tree } from 'antd';

import BaseLayer from 'ol/layer/Base';
import InfoIcon from '../LayerGroupInfo/layerGroupInfo';

import Legende from '../Legende/legend';

export type LayerTreeProps = {
    map: Map;
}

import { Layer, TreeNode } from '../../../types/types';


export default function LayerTree({ map }: LayerTreeProps) {
    

    const generateTreeData = (layers: any[]): TreeNode[] => {          // Funktion zur Generierung der Daten (in der richtigen Struktur) fuer den LayerTree 
        const layerGroups: { [groupName: string]: Layer[] } = {};       // Layergroups Name und dazugehoerige Layer (Struktur von layerGroups)

        layers.forEach(layer => {                                          // Schleife für jeden layer; die Informationen sind unter layer.values_ aufgefuehrt 
            const groupName = layer.values_.groupName;                      // Gruppennamen abrufen


            if (!layerGroups[groupName]) {
                layerGroups[groupName] = [];                                // sofern groupname noch nicht in layerGroups -> neuen key mit Gruppennamen hinzufügen 
            }

            layerGroups[groupName].push({                                   // zum Gruppennamen hinzufügen:
                groupName: groupName,
                name: layer.values_.name,                                   // layername, title, information to visible, info, infoText and infoTextTitle, enableSlider
                title: layer.values_.title,                                  
                visible: layer.values_.visible || false,
                info: layer.values_.info || false, 
                infoText: layer.values_.infoText || false,
                infoTextTitle: layer.values_.infoTextTitle || false,
                enableSlider: layer.values_.enableSlider || false,
                urlLegend: layer.values_.urlLegend,
                legend: layer.values_.legend, 
                layer:layer,
            });

        });
    
        const treeData: TreeNode[] = Object.keys(layerGroups)               // Eigenschaften von layerGroups zurückgeben
        
            .map(groupName => {                                                 // function for each groupName
                const groupLayers = layerGroups[groupName];
                
                const groupNode: TreeNode = {                                   // Structure Layertree 
                    title: groupName,
                    key: groupName,
                    children: groupLayers.map(layer => ({
                        title: layer.title,
                        key: layer.name,
                        layer: layer,
                        visible: !!layer.visible,
                        info: !!layer.info,
                        infoText: layer.infoText || undefined,
                        infoTextTitle: layer.infoTextTitle || undefined,
                        urlLegend: layer.urlLegend || undefined,
                        legend: layer.legend || undefined,
                    })),
                    visible: groupLayers.some(layer => !!layer.visible),        // wenn mind. ein Layer visible ist, dann Groupe visible= true
                    info: groupLayers[0]?.info || false,                        // Eigenschaft info von erster Ebene/erstem Layer (da es in der config groupEigenschaft ist, bei allen Layern gleich)
                    infoText: groupLayers[0]?.infoText || undefined,
                    infoTextTitle: groupLayers[0]?.infoTextTitle || undefined,
                    enableSlider: groupLayers[0]?.enableSlider || false,
                };
            
                return groupNode; 
            });

        
        return treeData;                // Funktion zur Generierung der aktuellen Daten, des aktuellen Stands in der Map mit aktuellen Eigenschaften der Layer 
    };
    
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
    const [firstRenderComplete, setFirstRenderComplete] = useState<boolean>(false);
    const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
    const [prevExpandedKeys, setPrevExpandedKeys] = useState<string[]>([]);


    // Layer, die initial auf der Map ausgewählt sind checked und group ausgeklappt // nur ausgeführt beim ersten Rendern!!!!
    useEffect(() => {
        const layersTree = map.getLayers().getArray().filter(layer =>
            !layer.get('enableSlider') && (layer.getProperties().name !== 'measurement') // habe einen Layer 'measurement' für das Messen hinzugefügt und der soll NICHT im Layertree auftauchen
        );

            // console.log('layers:', layersTree); 

        const reversedLayersTree = layersTree.slice().reverse(); // Layerreihenfolge umdrehen, damit unterster Layer ganz unten im Layertree ist 
        
        // Generiert die Struktur für den LayerTree basierend auf den aktuellen Layern
        const generatedTreeData = generateTreeData(reversedLayersTree);
        setTreeData(generatedTreeData);
            // console.log('generatedData:', generatedTreeData)

        
        // Extrahiert alle Layer-Namen, Gruppen-Namen und initial sichtbaren Gruppen
        const initialCheckedKeys: string[] = [];
        const expandedGroups: string[] = [];
    
        layersTree.forEach(layer => {
            const layerName = (layer as BaseLayer).getProperties().name;
            const groupName = layer.get('groupName') || 'Basiskarte';
            const isVisible = layer.getVisible();
    
            // Wenn der Layer sichtbar ist, füge den Layer-Namen zu den initialCheckedKeys hinzu
            // und füge den entsprechenden Gruppen-Namen zu den expandedGroups hinzu
            if (isVisible) {
                initialCheckedKeys.push(layerName);
                expandedGroups.push(groupName);
            }
        });
    
        // Entfernt Duplikate aus expandedGroups, um sicherzustellen, dass jeder Gruppen-Name nur einmal vorkommt
        const uniqueExpandedGroups = Array.from(new Set(expandedGroups)); // nur die initial expandedGroups 

        // Setzt die initial ausgewählten und erweiterten Gruppen
        setCheckedKeys(initialCheckedKeys);
        setExpandedGroups(uniqueExpandedGroups);

            // console.log('initialKeys', initialCheckedKeys); 
        // setzt die initialen Layer auf ausgeklappt
        const keysGroups = [...initialCheckedKeys, ...uniqueExpandedGroups]
        setPrevExpandedKeys(keysGroups); 

            // console.log(prevCheckedKeys)
    
        // Markiere den ersten Rendervorgang als abgeschlossen
        setFirstRenderComplete(true);
    }, [map]);


    // console.log('checkedkeys', prevCheckedKeys);

    
    const handleCheck = (checkedKeys: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[]; }) => {
        const keys = Array.isArray(checkedKeys) ? checkedKeys.map(String) : checkedKeys.checked.map(String);
    
        // Aktualisiert die ausgewählten Schlüssel
        setCheckedKeys(keys);
            // console.log('keys', keys); 
    
        const newExpanded:string[] = []; // Initialisiert ein leeres Array für neue erweiterte Gruppen
    
        // Finde nur die neu ausgewählten Gruppen
        keys.forEach(key => {
            if (!prevExpandedKeys.includes(key)) {
                newExpanded.push(key);
            }
        });
    
            // console.log('newExpanded', newExpanded);
    
        // Aktualisiert die erweiterten Gruppen basierend auf den neu ausgewählten Gruppen
        const updatedExpandedGroups = [...expandedGroups];
    
        // Füge neu ausgewählte Gruppen automatisch zur erweiterten Liste hinzu
        newExpanded.forEach(key => {
            if (!updatedExpandedGroups.includes(key)) {
                updatedExpandedGroups.push(key);
            }
        });
    
        // Setze die aktualisierten erweiterten Gruppen
        setExpandedGroups(updatedExpandedGroups);
    
        // Setze die aktuellen ausgewählten Schlüssel als vorherige geprüfte Schlüssel
        setPrevExpandedKeys(keys); 
        
    };
    

    useEffect(() => {                                                                    // sideeffect (bei Änderung im Layertree auch Änderung der Karte)
        if (firstRenderComplete) {                                                         // abrufen des UseEffect erst beim zweiten Abruf, sodass die Karte nicht neugerendert wird beim Öffnen des Drawers
    
            map.getLayers().getArray().forEach(layer => {
                const layerName = (layer as BaseLayer).getProperties().name;
                const isLayerVisible = layer.getVisible();
                const shouldBeVisible = checkedKeys.includes(layerName);
        
                // Nur nicht-sliderbare Layer bearbeiten
                if (!layer.get('enableSlider') && layer.getProperties().name !== 'measurement') {
                    if (shouldBeVisible !== isLayerVisible) {
                        // Sichtbarkeit entsprechend der checkedKeys aktualisieren
                        layer.setVisible(shouldBeVisible);
                    }
                }
            }); 
        }
    }, [checkedKeys, map]);
        

    const handleExpand = (expandedKeys: React.Key[], info: any) => {
        const expandedKeyStrings = expandedKeys.map(key => String(key));
        setExpandedGroups(expandedKeyStrings);

            // console.log('changeexpand', expandedKeyStrings);
        
    };    


   

    return (
        
        <Tree
            checkable   // possibility for users to check layer/group 
            selectable={false}      // cannot click on nodes in the Layertree 
            treeData={treeData.map(node => ({           // structure for the layertree 
                ...node,
                title: (
                    <span>
                        {node.title}
                        {node.info && !node.layer && <InfoIcon infoTextTitle={node.infoTextTitle} infoText={node.infoText}/>}  
                    </span>
                ),
                children: node.children?.map(layerNode => {
                    const { layer } = layerNode;
                    const shouldDisplayLegend = layer?.legend === true; // anzeige von Legend nur bei Legend === true
    
                    return {
                        ...layerNode,
                        title: (
                            <span>
                                {layerNode.title}
                                {shouldDisplayLegend && <Legende layers={[layer]} />}
                            </span>
                        ),
                    };
                }),
            }))}
            checkedKeys={checkedKeys}       // list of the checked layers 
            onCheck={handleCheck}               // function for the case that the status of a checkbox changes 
            expandedKeys={expandedGroups}
            onExpand={handleExpand}
        />
    );
}





