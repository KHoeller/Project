
import React, {useState, useEffect} from 'react';
import Map from 'ol/Map';
import { Tree } from 'antd';

import BaseLayer from 'ol/layer/Base';
import Collection  from 'ol/Collection';

// austesten: 
//TODO 
    // ich muss status visible je nach check anpassen 

// Der Code kann bislang: 
    // aktuell visible Layers auf der Karte auswählen 
    // auswählen und nicht auswählen von Layern -> aber ohne Auswirkung auf die Karte 
    // andere Layer anclicken und auf der Karte anzeigen lassen 
    // -> ABER sobald man einen anderen Layer auswählt, ist der erste auch nicht mehr ausgewählt
    // das auswählen und deselecten von Layern ist noch recht willkürlich 


export type LayerTreeProps = {
    map: Map;
}

export default function LayerTree ({map}: LayerTreeProps) {
    
    const generateTreeData = (layers: any) => {
        return layers.getArray().map((layer: BaseLayer) => ({                    // über jeden Layer iterieren
            title: layer.getProperties().title,                 // title für LayerTree
            key: layer.getProperties().name,                    // name als key
            layer: layer, // layer an sich 
            visible: layer.getVisible(),           // info über visible                          
        }));
    }; 

    const [treeData, setTreeData] = useState([]);               // Daten für den LayerTree
    
    const [checkedKeys, setCheckedKeys] = useState([]);         // initial state: ausgewählte Layer 

    useEffect(() => {
        const layers = map.getLayers();                         // alle Layer aus der Map Component  
        const generatedTreeData = generateTreeData(layers);// Layer für Datenbaum generieren
        setTreeData(generatedTreeData);                         // ausgangsdaten für den Daten baum 


        let initialCheckedKey = generatedTreeData
            .filter((layer:any) => layer.visible === true)
            .map((layer: any) => layer.key)
        setCheckedKeys(initialCheckedKey)                       // die aktuell sichtbaren Layer auf der Karte sind gecheckt 

    }, [map]);

   const onCheck = (keys: any) => {
    setCheckedKeys(keys)
   }
   
    useEffect(()=> {
        map.getLayers().forEach((layer: BaseLayer) => {
            const layerName = layer.getProperties().name;
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
    


// import React, {useState, useEffect} from 'react';
// import Map from 'ol/Map';
// import { Tree } from 'antd';

// import BaseLayer from 'ol/layer/Base';
// import Collection  from 'ol/Collection';

// // austesten: 
// //TODO 
//     // ich muss status visible je nach check anpassen 

// // Der Code kann bislang: 
//     // aktuell visible Layers auf der Karte auswählen 
//     // auswählen und nicht auswählen von Layern -> aber ohne Auswirkung auf die Karte 
//     // andere Layer anclicken und auf der Karte anzeigen lassen 
//     // -> ABER sobald man einen anderen Layer auswählt, ist der erste auch nicht mehr ausgewählt
//     // das auswählen und deselecten von Layern ist noch recht willkürlich 


// export type LayerTreeProps = {
//     map: Map;
// }

// export default function LayerTree ({map}: LayerTreeProps) {
    
//     const generateTreeData = (layers: any) => {
//         layers.map((layer: any) => ({                    // über jeden Layer iterieren
//             title: layer.getProperties().title,                 // title für LayerTree
//             key: layer.getProperties().name,                    // name als key
//             layer: layer,                                       // layer an sich 
//             // checked: layer.getVisible(),                        // info über visible 
//         }));
//     }; 

//     const [treeData, setTreeData] = useState([]);               // Daten für den LayerTree
//     // const [checkedKeys, setCheckedKeys] = useState([]);         // initial state: ausgewählte Layer 

//     useEffect(() => {
//         const layers = map.getLayers(); 
//         console.log(map.getLayers())                               // alle Layers aus der Config 
//         const generatedTreeData: any = generateTreeData(layers);     // Layer für Datenbaum generieren
//         setTreeData(generatedTreeData);                         // ausgangsdaten für den Daten baum 

//         // const updateCheckedKeys = () => {                       
//         //     const newCheckedKeys = generatedTreeData            // für jeden Layer 
//         //         .filter((node: any) => node.layer.getVisible()) // filter jedes Elements in dem Array (jeder Layer) nach visible 
//         //         .map((node: any) => node.key);
//         //     setCheckedKeys(newCheckedKeys);
//         // };

//         // updateCheckedKeys();

//         // const handleLayerVisibilityChange = () => {
//         //     updateCheckedKeys();
//         // };

//         // map.getLayers().forEach(layer => {                      // ändern der visibilty gemäß der map 
//         //     layer.on('change:visible', handleLayerVisibilityChange);
//         // });

//         // return () => {
//         //     map.getLayers().forEach(layer => {
//         //         layer.un('change:visible', handleLayerVisibilityChange);
//         //     });
//         // };
//     }, [map]);

//     // const onCheck = (checkedKeys: any) => {
//     //     setCheckedKeys(checkedKeys);    
//     //  };

//     // useEffect(()=>{
//     //         map.getLayers().forEach(layer => {
//     //             const layerName = layer.getProperties().name;
//     //             const shouldBeVisible = checkedKeys.includes(layerName);
//     //             layer.setVisible(shouldBeVisible);
//     //         });
//     // })
   

//     return (
//         <Tree
//             checkable
//             // checkedKeys={checkedKeys}
//             // onCheck={onCheck}
//             selectable={false}
//             treeData={treeData}
//         />
//     );
// };
    


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
