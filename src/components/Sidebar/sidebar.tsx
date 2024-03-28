

import React, { useState, useEffect } from "react";
import Map from 'ol/Map';  
import './sidebar.css';

import { Button, Drawer } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

// import LayerTree from "../LayerTree/layerTree";
// import LayerTreeSlider from '../LayerTree/layerTreeSlider';
import LayerManager from "../LayerTree/layerTreeManager";


export type SidebarProps = {
    map: Map;
}

export default function Sidebar ({map}:SidebarProps){

    const [open, setOpen] = useState(false);
  

    const toggleDrawer = () => {
        setOpen(!open)
    }

    const onClose = () => {
        setOpen(false);
    };

    return(
        <div className="sidebarContainer" >
             <Drawer
                className="sidebarDrawer"
                title='Themenbaum'
                onClose={onClose}
                open={open}
                placement="right"
                maskClosable={false}
                mask={false}
                keyboard={true}
            >
                {/* <LayerTree map={map}/>
                <LayerTreeSlider map={map}/> */}

                <LayerManager map={map} />

            </Drawer>
            <Button
                type="default"
                onClick={toggleDrawer}
                className={open ? "openButton openButtonDrawerOpen" : "openButton"}
                // "openButton" (wenn unten der style verwendet wird, dann Klasse openButton); so wird je nach Zustand die Klasse in css gewählt 
                shape='default'
                size='middle'
                //style={{ right: open ? '380px' : '0' }}
            > 
            {open ? <MenuUnfoldOutlined style={{color: 'black', fontSize: 20}}/> : <MenuFoldOutlined style={{color: 'black', fontSize: 20}}/> }
            </Button>
           
            
        </div>
       
    );
}

// return(
//         <div className="sidebarContainer">
//             <Drawer title='Themenbaum' 
//                     onClose={onClose} 
//                     open={open} 
//                     placement="right" >
//                     <p> some content </p> 
                
//             </Drawer>
//             <Button type="primary" 
//                     onClick={showDrawer} 
//                     className="openButton" 
//                     style={{ position: 'fixed', 
//                             right: open ? '380px' : '0', 
//                             transition: 'right 0.3s', 
//                             background: "grey", 
//                             borderColor: "dblack" }}>
//                 {open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//             </Button>
//         </div>
       
//     );
