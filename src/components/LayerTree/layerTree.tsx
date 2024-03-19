// LayerTree:
import React, { useState, useEffect } from 'react';
import Map from 'ol/Map';
import { Tree } from 'antd';

import BaseLayer from 'ol/layer/Base';
// import jsondata from '../../../conf/config.json';
import Layers from '../../utils/LayerN/LayerN';

export type LayerTreeProps = {
    map: Map;
}

type Layer = {
    name: string;
    title: string;
    visible?: boolean;
}

type Group = {
    groupName: string;
    layers: Layer[];
}

type TreeNode = {
    title: string;
    key: string;
    children?: TreeNode[];
    layer?: Layer;
    visible: boolean;
}

export default function LayerTree({ map }: LayerTreeProps) {
    

    const generateTreeData = (layers: any[]): TreeNode[] => {
        // Erstellen eines leeren Objekts, um die Layer nach Gruppen zu gruppieren
        const layerGroups: { [groupName: string]: Layer[] } = {};
    
        // Gruppieren der Layer nach Gruppennamen oder Verwendung einer Standardgruppe
        layers.forEach(layer => {
            const groupName = layer.values_.groupName || 'Basiskarte';
            if (!layerGroups[groupName]) {
                layerGroups[groupName] = [];
            }
            layerGroups[groupName].push({
                name: layer.values_.name,
                title: layer.values_.title,
                visible: layer.values_.visible || false
            });
        });
    
        // Erstellen der Baumstruktur aus den gruppierten Layern
        const treeData: TreeNode[] = Object.keys(layerGroups).map(groupName => ({
            title: groupName,
            key: groupName,
            children: layerGroups[groupName].map(layer => ({
                title: layer.title,
                key: layer.name,
                layer: layer,
                visible: !!layer.visible
            })),
            visible: layerGroups[groupName].some(layer => !!layer.visible)
        }));
    
        return treeData;
    };
    

    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

    useEffect(() => {
        const layersFromLayerN = Layers();
        const generatedTreeData = generateTreeData(layersFromLayerN);
        setTreeData(generatedTreeData);

        const initialCheckedKeys = generatedTreeData.flatMap(group =>
            group.children?.filter(layer => layer.visible).map(layer => layer.key) || []
        );
        setCheckedKeys(initialCheckedKeys);
    }, []);

    const onCheck = (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[]; }) => {
        if (Array.isArray(checked)) {
            setCheckedKeys(checked.map(key => String(key)));
        } else {
            setCheckedKeys(checked.checked.map(key => String(key)));
        }
    }

    useEffect(() => {
        map.getLayers().forEach(layer => {
            const layerName = (layer as BaseLayer).getProperties().name;
            const shouldBeVisible = checkedKeys.includes(layerName);
            layer.setVisible(shouldBeVisible);
        });
    }, [checkedKeys, map]);

    return (
        <Tree
            checkable
            selectable={false}
            treeData={treeData}
            checkedKeys={checkedKeys}
            onCheck={onCheck}
        />
    );
};


// !!!! derzeit kommen die Daten direkt aus der Config - Ziel Daten von map verwenden 

// // import React, {useState, useEffect} from 'react';
// import Map from 'ol/Map';
// import { Tree } from 'antd';

// import BaseLayer from 'ol/layer/Base';
// import { useState, useEffect } from 'react';
    


// export type LayerTreeProps = {
//     map: Map;
//     layerGroups: any[];
// }

// export default function LayerTree ({map, layerGroups}: LayerTreeProps) {
    
//     const generateTreeData = (groups: any) => {
//         return groups.map((group: any) => ({                    // über jeden Layer iterieren
//             title: group.groupName,                 // title für LayerTree
//             key: group.groupName,   
//             children: group.layers.map((layer: any) => ({
//                 title: layer.title,
//                 key: layer.name,
//                 layer: layer, // layer an sich 
//                 visible: layer.visible,           // info über visible 
//             }))        
                                        
//         }));
//     }; 

//     const [treeData, setTreeData] = useState([]);               // Daten für den LayerTree
    
//     const [checkedKeys, setCheckedKeys] = useState([]);         // initial state: ausgewählte Layer 

//     useEffect(() => {
//         const generatedTreeData = generateTreeData(layerGroups);
//         setTreeData(generatedTreeData);

//         let initialCheckedKeys = layerGroups.reduce((acc: string[], group: any) => {
//             const groupCheckedKeys = group.layers.filter((layer: any) => layer.visible).map((layer: any) => layer.name);
//             return [...acc, ...groupCheckedKeys];
//         }, []);
//         setCheckedKeys(initialCheckedKeys);
//     }, [layerGroups]);

//     const onCheck = (keys: any) => {
//     setCheckedKeys(keys)
//     }

//     useEffect(()=> {
//         map.getLayers().forEach((layer: BaseLayer) => {
//             const layerName = layer.getProperties().name;
//             const shouldBeVisible = checkedKeys.includes(layerName);
//             layer.setVisible(shouldBeVisible);
//         });
//     }, [checkedKeys, map]);



//     return (
//         <Tree
//             checkable
//             selectable={false}
//             treeData={treeData}
//             checkedKeys={checkedKeys}
//             onCheck={onCheck}
//         />
//     );
// };



// // gegliederter LayerTree - funktioniert 
// import React, { useState, useEffect } from 'react';
// import Map from 'ol/Map';
// import { Tree } from 'antd';

// import BaseLayer from 'ol/layer/Base';
// import jsondata from '../../../conf/config.json';
// import Layers from '../../utils/LayerN/LayerN';

// export type LayerTreeProps = {
//     map: Map;
// }

// type Layer = {
//     name: string;
//     title: string;
//     visible?: boolean; // Änderung: visible ist jetzt optional
// }

// type Group = {
//     groupName: string;
//     layers: Layer[];
// }

// type TreeNode = {
//     title: string;
//     key: string;
//     children?: TreeNode[]; // Änderung: children ist jetzt optional
//     layer?: Layer;
//     visible: boolean;
// }

// export default function LayerTree({ map }: LayerTreeProps) {

//     const generateTreeData = (groups: Group[]): TreeNode[] => {
//         return groups.map(group => ({
//             title: group.groupName,
//             key: group.groupName,
//             children: group.layers.map(layer => ({
//                 title: layer.title,
//                 key: layer.name,
//                 layer: layer,
//                 visible: !!layer.visible // Umwandlung von undefined in boolean
//             })),
//             visible: group.layers.some(layer => !!layer.visible) // Umwandlung von undefined in boolean
//         }));
//     };

//     const [treeData, setTreeData] = useState<TreeNode[]>([]);
//     const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

//     useEffect(() => {
//         const generatedTreeData = generateTreeData(jsondata.groups);
//         setTreeData(generatedTreeData);

//         const initialCheckedKeys = generatedTreeData.flatMap(group =>
//             group.children?.filter(layer => layer.visible).map(layer => layer.key) || []
//         );
//         setCheckedKeys(initialCheckedKeys);
//     }, []);

//     const onCheck = (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[]; }) => {
//         if (Array.isArray(checked)) {
//             setCheckedKeys(checked.map(key => String(key)));
//         } else {
//             setCheckedKeys(checked.checked.map(key => String(key)));
//         }
//     }

//     useEffect(() => {
//         map.getLayers().forEach(layer => {
//             const layerName = (layer as BaseLayer).getProperties().name;
//             const shouldBeVisible = checkedKeys.includes(layerName);
//             layer.setVisible(shouldBeVisible);
//         });
//     }, [checkedKeys, map]);

//     return (
//         <Tree
//             checkable
//             selectable={false}
//             treeData={treeData}
//             checkedKeys={checkedKeys}
//             onCheck={onCheck}
//         />
//     );
// };


// Funktionierende BasisStruktur für meine Layer 
    // import React, {useState, useEffect} from 'react';
    // import Map from 'ol/Map';
    // import { Tree } from 'antd';

    // import BaseLayer from 'ol/layer/Base';


    // export type LayerTreeProps = {
    //     map: Map;
    // }

    // export default function LayerTree ({map}: LayerTreeProps) {
        
    //     const generateTreeData = (layers: any) => {
    //         return layers.getArray().map((layer: BaseLayer) => ({                    // über jeden Layer iterieren
    //             title: layer.getProperties().title,                 // title für LayerTree
    //             key: layer.getProperties().name,                    // name als key
    //             layer: layer, // layer an sich 
    //             visible: layer.getVisible(),           // info über visible                          
    //         }));
    //     }; 

    //     const [treeData, setTreeData] = useState([]);               // Daten für den LayerTree
        
    //     const [checkedKeys, setCheckedKeys] = useState([]);         // initial state: ausgewählte Layer 

    //     useEffect(() => {
    //         const layers = map.getLayers();                         // alle Layer aus der Map Component  
    //         const generatedTreeData = generateTreeData(layers);// Layer für Datenbaum generieren
    //         setTreeData(generatedTreeData);                         // ausgangsdaten für den Daten baum 


    //         let initialCheckedKey = generatedTreeData
    //             .filter((layer:any) => layer.visible === true)
    //             .map((layer: any) => layer.key)
    //         setCheckedKeys(initialCheckedKey)                       // die aktuell sichtbaren Layer auf der Karte sind gecheckt 

    //     }, [map]);

    //    const onCheck = (keys: any) => {
    //     setCheckedKeys(keys)
    //    }
    
    //     useEffect(()=> {
    //         map.getLayers().forEach((layer: BaseLayer) => {
    //             const layerName = layer.getProperties().name;
    //             const shouldBeVisible = checkedKeys.includes(layerName);
    //             layer.setVisible(shouldBeVisible);
    //         });
    //     }, [checkedKeys, map]);



    //     return (
    //         <Tree
    //             checkable
    //             selectable={false}
    //             treeData={treeData}
    //             checkedKeys={checkedKeys}
    //             onCheck={onCheck}
    //         />
    //     );
    // };



//BasicStructure von AntDesign 

    // const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);      // für später, wenn man Unterkategorien hat 
    // const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);        // Möglichkeit zum Auswählen, auch wenn noch nichts passiert 
    // const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);      
    
//     // const onExpand = (expandedKeysValue: React.Key[]) => {
//     //     setExpandedKeys(expandedKeysValue);
//     //     setAutoExpandParent(false);
//     // };
    
//     // const onCheck = (checkedKeysValue: any, info: any) => {
//     //     setCheckedKeys(checkedKeysValue);

//     //     treeData.forEach(node => {
//     //         if (checkedKeysValue.includes(node.key)) {
//     //             node.layer.setVisible(true);
//     //         } else {
//     //             node.layer.setVisible(false);
//     //         }
//     //     });
//     // };
    
//     // const onSelect = (selectedKeysValue: React.Key[], info: any) => {
//     //     setSelectedKeys(selectedKeysValue);
//     // };
    
//     return (
//         <Tree
            
//             checkable
// //         // onExpand={onExpand}
// //         // expandedKeys={expandedKeys}
// //         // autoExpandParent={autoExpandParent}
// //         // onCheck={onCheck}
// //         // checkedKeys={checkedKeys}
//             onSelect={onSelect}
// //         // selectedKeys={selectedKeys}
//             treeData={treeData}
//         />
//     );
// };





// BasisStructure: 
// Structure Layertree
// const treeData: TreeDataNode[] = [
//     {
//         title: 'Schadstoffe',
//         key: '0-0',
//         children: [
//         {
//             title: '0-0-0',
//             key: '0-0-0',
//             children: [
//             { title: '0-0-0-0', key: '0-0-0-0' },
//             { title: '0-0-0-1', key: '0-0-0-1' },
//             { title: '0-0-0-2', key: '0-0-0-2' },
//             ],
//         },
//         {
//             title: '0-0-1',
//             key: '0-0-1',
//             children: [
//             { title: '0-0-1-0', key: '0-0-1-0' },
//             { title: '0-0-1-1', key: '0-0-1-1' },
//             { title: '0-0-1-2', key: '0-0-1-2' },
//             ],
//         },
//         {
//             title: '0-0-2',
//             key: '0-0-2',
//         },
//         ],
//     },
//     {
//         title: 'Lärmbelastung',
//         key: '0-1',
//         children: [
//             { title: '0-1-0-0', key: '0-1-0-0' },
//             { title: '0-1-0-1', key: '0-1-0-1' },
//             { title: '0-1-0-2', key: '0-1-0-2' },
//         ],
//     },
    
//     {
//         title: 'Verwaltungsgrenzen/Bevölkerungsdaten',
//         key: '0-2',
//         children: [
//             { title: '0-2-0-0', key: '0-2-0-0' },
//             { title: '0-2-0-1', key: '0-2-0-1' },
//             { title: '0-2-0-2', key: '0-2-0-2' },
//         ],
//     },
//     {
//         title: 'OpenStreetMap',
//         key: '0-3',
//     },
//     ];



// export default function LayerTree (){
//     const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);      // derzeit kein key ausgeklappt; ['0-0', '0-1'] -> so wären die beiden keys ausgeklappt 
//     const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['0-0-0']); // Einstellung, welcher Key von vornerein angezeigt wird 
//     const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);      // zum Verfolgen des aktuellen Status im LayerTree, initial leer; wird ein Event ausgeführt aktualisiert die Funktion den Status 
//     const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true); // kann verwendet werden um alle children zu erweitern, sobald ein children erweitert wird 

//     const onExpand = (expandedKeysValue: React.Key[]) => {
//         console.log('onExpand', expandedKeysValue); // nicht zwangsläufig notwendig 
//         // or, you can remove all expanded children keys.
//         setExpandedKeys(expandedKeysValue);
//         setAutoExpandParent(false);
//         };

//         const onCheck = (checkedKeysValue: any) => {  // schaut welche Layer aktuell ausgewählt sich  
//         console.log('onCheck', checkedKeysValue);
//         setCheckedKeys(checkedKeysValue);
//         };
    
//         const onSelect = (selectedKeysValue: React.Key[], info: any) => {
//         console.log('onSelect', info);
//         setSelectedKeys(selectedKeysValue);
//         };

//         return(
//         <Tree
//         checkable
//         onExpand={onExpand}
//         expandedKeys={expandedKeys}
//         autoExpandParent={autoExpandParent}
//         onCheck={onCheck}
//         checkedKeys={checkedKeys}
//         onSelect={onSelect}
//         selectedKeys={selectedKeys}
//         treeData={treeData}
//         />
//         );
// };
