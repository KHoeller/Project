
import React, {useState, useEffect} from 'react';
import Map from 'ol/Map';
import { Tree } from 'antd';
import type { TreeDataNode } from 'antd';
import Layers from '../../utils/LayerN/LayerN';

// austesten: 
//TODO 
    // ich brauche alle Layer, die auf dem Geoserver liegen und die sollen im Baum angezeigt werden 
    // ich muss status visible je nach check anpassen 
    // title in config hinzufügen, der im LayerTree angezeigt werden könnte?! 

interface CustomTreeDataNode extends TreeDataNode {
    layer?: any; // Hier definieren Sie Ihre benutzerdefinierte Eigenschaft 'layer'
}


const generateTreeData = (layers: any[]): TreeDataNode[] => {
    return layers.map((layer, index) => ({
        title: layer.getProperties().title, 
        key: layer.getProperties().name,
        layer: layer,
        checked: layer.getVisible(),
    }));
}; // für jeden Layer name und index heraussuchen, und erstmal in einen Tree ohne Erweiterung 




const LayerTree: React.FC = () => {
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);      // für später, wenn man Unterkategorien hat 
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);        // Möglichkeit zum Auswählen, auch wenn noch nichts passiert 

    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);      

    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);    // überflüssig? 

    const [treeData, setTreeData] = useState<CustomTreeDataNode[]>([]);
    
    useEffect(() => {
        const layers = Layers();                                // TileLayer mit allen Layers des Projektes 
        const generatedTreeData = generateTreeData(layers);     // TreeDate mithilfe der obigen Funktion erstellen 
        setTreeData(generatedTreeData);                         // TreeDate aktualisieren 
    }, []); 

    const onExpand = (expandedKeysValue: React.Key[]) => {
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };
    
    const onCheck = (checkedKeysValue: any, info: any) => {
        setCheckedKeys(checkedKeysValue);

        treeData.forEach(node => {
            if (checkedKeysValue.includes(node.key)) {
                node.layer.setVisible(true);
            } else {
                node.layer.setVisible(false);
            }
        });
    };
    
    const onSelect = (selectedKeysValue: React.Key[], info: any) => {
        setSelectedKeys(selectedKeysValue);
    };
    
    return (
        <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={treeData}
        />
    );
};

export default LayerTree;

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


