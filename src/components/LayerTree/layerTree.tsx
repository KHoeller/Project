import React, {useState} from 'react';
import { Tree } from 'antd';
import type { TreeDataNode } from 'antd';


// Structure Layertree
const treeData: TreeDataNode[] = [
    {
      title: '0-0',
      key: '0-0',
      children: [
        {
          title: '0-0-0',
          key: '0-0-0',
          children: [
            { title: '0-0-0-0', key: '0-0-0-0' },
            { title: '0-0-0-1', key: '0-0-0-1' },
            { title: '0-0-0-2', key: '0-0-0-2' },
          ],
        },
        {
          title: '0-0-1',
          key: '0-0-1',
          children: [
            { title: '0-0-1-0', key: '0-0-1-0' },
            { title: '0-0-1-1', key: '0-0-1-1' },
            { title: '0-0-1-2', key: '0-0-1-2' },
          ],
        },
        {
          title: '0-0-2',
          key: '0-0-2',
        },
      ],
    },
    {
      title: '0-1',
      key: '0-1',
      children: [
        { title: '0-1-0-0', key: '0-1-0-0' },
        { title: '0-1-0-1', key: '0-1-0-1' },
        { title: '0-1-0-2', key: '0-1-0-2' },
      ],
    },
    {
      title: '0-2',
      key: '0-2',
    },
  ];

export default function LayerTree (){
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);      // derzeit kein key ausgeklappt; ['0-0', '0-1'] -> so wären die beiden keys ausgeklappt 
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['0-0-0']); // Einstellung, welcher Key von vornerein angezeigt wird 
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);      // zum Verfolgen des aktuellen Status im LayerTree, initial leer; wird ein Event ausgeführt aktualisiert die Funktion den Status 
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true); // kann verwendet werden um alle children zu erweitern, sobald ein children erweitert wird 

    const onExpand = (expandedKeysValue: React.Key[]) => {
        console.log('onExpand', expandedKeysValue); // nicht zwangsläufig notwendig 
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
      };

      const onCheck = (checkedKeysValue: any) => {  // schaut welche Layer aktuell ausgewählt sich  
        console.log('onCheck', checkedKeysValue);
        setCheckedKeys(checkedKeysValue);
      };
    
      const onSelect = (selectedKeysValue: React.Key[], info: any) => {
        console.log('onSelect', info);
        setSelectedKeys(selectedKeysValue);
      };

      return(
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

// LayerTree-Gerüst - funktioniert 