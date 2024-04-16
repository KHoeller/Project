// // LayerTree:

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
        const layerGroups: { [groupName: string]: Layer[] } = {};       // Layergroups Name und dazugehörige Layer (Struktur von layerGRoups)

        layers.forEach(layer => {                                          // Schleife für jeden layer 
            const groupName = layer.values_.groupName || 'Basiskarte';      // Gruppennamen abrufen


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
    
        const treeData: TreeNode[] = Object.keys(layerGroups)               // EIgenschaften von layerGroups zurückgeben
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


    // Layer, die initial auf der Map ausgewählt sind checked und group ausgeklappt 
    useEffect(() => {
        const layersTree = map.getLayers().getArray().filter(layer => layer.get('enableSlider') !== true);
        // console.log('layers:', layersTree); 

        const reversedLayersTree = layersTree.slice().reverse();
        
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
        const uniqueExpandedGroups = Array.from(new Set(expandedGroups));
       
        // Setze die initial ausgewählten und erweiterten Gruppen
        setCheckedKeys(initialCheckedKeys);
        setExpandedGroups(uniqueExpandedGroups);
    
        // Markiere den ersten Rendervorgang als abgeschlossen
        setFirstRenderComplete(true);
    }, [map]);


// mit dieser Funktion wird NICHT automatisch Group ausgeklappt, wenn group checked ist 
    // const onCheck = (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[]; }, info: any) => { // Abruf sobald sich der Status einer Checkbox verändert
    //     console.log(info)
    //     if (Array.isArray(checked)) {                                   
    //         setCheckedKeys(checked.map(key => String(key)));
    //         console.log('checked:', checked);
    //     } else {
    //         setCheckedKeys(checked.checked.map(key => String(key)));
    //     }
    
    // }       // Unterscheidung half and full checked 
    //     // const newExpandedGroups = [...expandedGroups]; // Kopie der aktuellen erweiterten Gruppen

    //     // // Füge ausgewählte Gruppen zu den erweiterten Gruppen hinzu, falls sie nicht bereits enthalten sind
    //     // checkedKeys.forEach(groupName => {
    //     //     if (!newExpandedGroups.includes(groupName)) {
    //     //         newExpandedGroups.push(groupName);
    //     //     }
    //     // });

    //     // setExpandedGroups(newExpandedGroups);
    
   
    const handleCheck = (checkedKeys: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[]; }) => {
        const keys = Array.isArray(checkedKeys) ? checkedKeys.map(String) : checkedKeys.checked.map(String);
    
        // Aktualisiert die ausgewählten Schlüssel
        setCheckedKeys(keys);
    
        // Aktualisiert die erweiterten Gruppen basierend auf den neu ausgewählten Gruppen
        const updatedExpandedGroups = [...expandedGroups];
    
        // Füge neu ausgewählte Gruppen automatisch zur erweiterten Liste hinzu
        keys.forEach(key => {
            if (!updatedExpandedGroups.includes(key)) {
                updatedExpandedGroups.push(key);
            }
        });
    
        // Setze die aktualisierten erweiterten Gruppen
        setExpandedGroups(updatedExpandedGroups);
    };



    useEffect(() => {                                                                    // sideeffect (bei Änderung im Layertree auch Änderung der Karte)
        if (firstRenderComplete) {                                                         // abrufen des UseEffect erst beim zweiten Abruf, sodass die Karte nicht neugerendert wird beim Öffnen des Drawers
    
            map.getLayers().getArray().forEach(layer => {
                const layerName = (layer as BaseLayer).getProperties().name;
                const isLayerVisible = layer.getVisible();
                const shouldBeVisible = checkedKeys.includes(layerName);
        
                // Nur nicht-sliderbare Layer bearbeiten
                if (!layer.get('enableSlider')) {
                    if (shouldBeVisible !== isLayerVisible) {
                        // Sichtbarkeit entsprechend der checkedKeys aktualisieren
                        layer.setVisible(shouldBeVisible);
                    }
                }
            }); 
        }
    }, [checkedKeys, map]);


            ///////
                // Alternative: (hier müsste firstRenderComplete hinzugefuegt werden, damit Map nicht neugerendert wird beim erstmaligen Aufruf!)
                // useEffect(() => {                                                 
                        
                //     map.getLayers().getArray().filter(layer => layer.get('enableSlider') !== true).forEach(layer => {                                  // Iteration über alle Layer in der Karte 
                //         const layerName = (layer as BaseLayer).getProperties().name;    // Name des Layers
                //         const isLayerVisible = layer.getVisible(); 
                //          // es wird geprüft, ob Layer checked ist und damit visible sein sollte 
                //         let shouldBeVisible;
                //         if (!isLayerVisible && !layer.get('enableSlider')) {        // Wenn der Layer bislang auf der Karte nicht sichtbar ist und nicht den 'enableSlider'-Wert hat
                //             shouldBeVisible = checkedKeys.includes(layerName);
                //             layer.setVisible(shouldBeVisible);                      // wenn der Layer in checkedKeys vorhanden ist, wird er auf visible gesetzt 
                //         } 
                //         // else if (!shouldBeVisible){
                //         //     layer.setVisible(false);                                // wenn der Layer nicht sichtbar sein soll, dann wird er auf visible false gesetzt und verschwindet von der Karte
                //         // }                  
                //     });
                // }, [checkedKeys, map]); // ändert sich bei Änderungen in checkedKeys oder map 
            //////

    const handleExpand = (expandedKeys: React.Key[], info: any) => {
        const expandedKeyStrings = expandedKeys.map(key => String(key));
        setExpandedGroups(expandedKeyStrings);
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



// LayerTree mit InfoIcon und entsprechendem Text im Modal - Funktioniert!!!
    // import React, { useState, useEffect } from 'react';
    // import Map from 'ol/Map';
    // import { Tree } from 'antd';

    // import BaseLayer from 'ol/layer/Base';
    // import InfoIcon from '../LayerGroupInfo/layerGroupInfo';

    // export type LayerTreeProps = {
    //     map: Map;
    // }

    // type Layer = {
    //     name: string;
    //     title: string;
    //     visible?: boolean;
    //     info?: boolean;
    //     infoText?: string; 
    //     infoTextTitle?: string; 
    //     enableSlider?: boolean;
    // }

    // type TreeNode = {
    //     title: string;
    //     key: string;
    //     children?: TreeNode[]; // sofern children vorhanden sind
    //     layer?: Layer;
    //     visible: boolean;      // sofern Angabe zu visible vorhanden ist
    //     info: boolean;
    //     infoText?: string;
    //     infoTextTitle?: string;
    //     enableSlicder?: boolean;
    // }

    // export default function LayerTree({ map }: LayerTreeProps) {
        

    //     const generateTreeData = (layers: any[]): TreeNode[] => {           // hier wird eine Function zur Generierung der Daten für einen LayerTree erstellt 
    //                                                                         // Eingabe ist ein Array von Layern und Output ein TreeNode-Objekt 
    //         // Erstellen eines leeren Objekts, um die Layer nach Gruppen zu gruppieren
    //         const layerGroups: { [groupName: string]: Layer[] } = {};       // die Gruppennamen werden als key verwendet und die zugehöirgen Werte als Array 
        
    //         // Gruppieren der Layer nach Gruppennamen oder Verwendung einer Standardgruppe
    //         layers.forEach(layer => {                                       // Iterieren über alle Layer in dem Array 
    //             const groupName = layer.values_.groupName || 'Basiskarte';  // aus dem Array wird der Gruppenname extrahiert bzw. falls keiner vorhanden eine Standardgruppe festgelegt (OSM als einziges bislang keine Gruppe)
    //             if (!layerGroups[groupName]) {                              // sofern der groupName noch nicht in layerGroups vorhanden ist, wird ein neues Array für die Gruppe angelegt
    //                 layerGroups[groupName] = [];
    //             }
    //             layerGroups[groupName].push({                               // entsprechend des groupNames wird der Layer in den richtigen Array gepusht und die Eigenschaften gespeichert
    //                 name: layer.values_.name,
    //                 title: layer.values_.title,
    //                 visible: layer.values_.visible || false,
    //                 info: layer.values_.info || false, 
    //                 infoText: layer.values_.infoText || false,
    //                 infoTextTitle: layer.values_.infoTextTitle || false,
    //                 // ist z.B. queryable relevant als Eigenschaft? 
    //             });
    //         }); // Iteration/ Schleife zu Ende 
        
    //         // Erstellen der Baumstruktur aus den gruppierten Layern -> das bisherige Objekt wird umstrukturiert 
    //         const treeData: TreeNode[] = Object.keys(layerGroups).map(groupName => ({
    //             title: groupName,
    //             key: groupName,
    //             children: layerGroups[groupName].map(layer => ({        // erstellen von children der jeweiligen Gruppenknoten;output Array von Layern dieser Gruppe 
    //                 title: layer.title,
    //                 key: layer.name,
    //                 layer: layer,
    //                 visible: !!layer.visible,
    //                 info: !!layer.info,
    //                 infoText: layer.infoText || undefined,
    //                 infoTextTitle: layer.infoTextTitle || undefined,
                    
    //             })),
    //             visible: layerGroups[groupName].some(layer => !!layer.visible), // sichtbarkeit des Gruppenknotens auf Basis der Sichtbarkeit der Kinder; wenn min. 1Layer sichtbar ist visible = true  
    //             info: layerGroups[groupName][0]?.info || false,
    //             infoText: layerGroups[groupName][0]?.infoText || undefined,
    //             infoTextTitle: layerGroups[groupName][0]?.infoTextTitle || undefined,
    //             // infoText: layerGroups[groupName].infoText,
    //             // infoTextTitle: layerGroups[groupName].infoTextTitle
                
    //         }));
            
    //         return treeData;
    //     };
        

    //     const [treeData, setTreeData] = useState<TreeNode[]>([]);
    //     const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

    //     useEffect(() => {
    //         const layers = map.getLayers().getArray()                       // aktuelle Layers der map verwenden 
    //         const generatedTreeData = generateTreeData(layers);             // mithilfe der obigen Funktion die strukturierten Daten erstellen 
    //         setTreeData(generatedTreeData);

    //         const initialCheckedKeys = generatedTreeData.flatMap(group =>
    //             group.children?.filter(layer => layer.visible)              // aktuell sichtbaren Layer filtern 
    //             .map(layer => layer.key) || [] 
    //         );
    //         setCheckedKeys(initialCheckedKeys);                             // die auusgewählten Checkboxen des initial state 
    //     }, []);


    //     const onCheck = (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[]; }) => { // Abruf sobald sich der Status einer Checkbox verändert 
    //         if (Array.isArray(checked)) {                                   // sofern es sich um einen Array handelt - keine halbgeprüften Checkboxen und alle ausgewählten keys enthalten
    //             setCheckedKeys(checked.map(key => String(key)));
    //         } else {
    //             setCheckedKeys(checked.checked.map(key => String(key)));
    //         }
    //     }       // Unterscheidung half and full checked 

    //     useEffect(() => {                                                       // sideeffect (bei Änderung im Layertree auch Änderung der Karte)
    //         map.getLayers().forEach(layer => {                                  // Iteration über alle Layer in der Karte 
    //             const layerName = (layer as BaseLayer).getProperties().name;    // Name des Layers
    //             const shouldBeVisible = checkedKeys.includes(layerName);        // es wird geprüft, ob Layer checked ist und damit visible sein sollte 
    //             layer.setVisible(shouldBeVisible);                              // wenn der Layer in checkedKeys vorhanden ist, wird er auf visible gesetzt 
    //         });
    //     }, [checkedKeys, map]); // ändert sich bei Änderungen in checkedKeys oder map 


    //     return (
    //         <Tree
    //             checkable
    //             selectable={false}
    //             treeData={treeData.map(node => ({
    //                 ...node,
    //                 title: (
    //                     <span>
    //                         {node.title}
    //                         {node.info && <InfoIcon infoTextTitle={node.infoTextTitle} infoText={node.infoText}/>}  
    //                     </span>
    //                 ),
    //                 children: node.children?.map(layerNode => ({
    //                     ...layerNode,
    //                     title: (
    //                         <span>
    //                             {layerNode.title}
    //                             {layerNode.info && <InfoIcon infoTextTitle={layerNode.infoTextTitle} infoText={layerNode.infoText}/>} 
    //                         </span>
    //                     ),
    //                 })),
    //             }))}
    //             checkedKeys={checkedKeys}
    //             onCheck={onCheck}
    //         />
    //     );
    // };


