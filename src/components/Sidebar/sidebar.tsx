
// drawer bleibt geöffnet auch wenn zoom o.ä. geclickt wird / es gibt keinen MaskLayer mehr, wenn drawer offen ist 
// drawer kann mit button oder x geschlossen werden  

import React, { useState, useEffect } from "react";
import Map from 'ol/Map';  
import './sidebar.css';

import { Button, Drawer } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import LayerTree from "../LayerTree/layerTree";
import RasterSlider from "../Slider_RasterData/slider";
import FeatureInfo from "../FeatureInfo/featureInfo";

export type SidebarProps = {
    map: Map;
}

export default function Sidebar ({map}:SidebarProps){

    const [open, setOpen] = useState(false);
  

    const toggleDrawer = () => {
        setOpen(!open)
    }

    // const showDrawer = () => {
    //     setOpen(true)
    // }

    const onClose = () => {
        setOpen(false);
    };

    return(
        <div className="sidebarContainer" >
             <Drawer
                title='Themenbaum'
                onClose={onClose}
                open={open}
                placement="right"
                className="sidebarDrawer"
                maskClosable={false}
                mask={false}
                keyboard={true}
            >
                <LayerTree map={map}/>

                <RasterSlider map={map}/>

                {/* <FeatureInfo map={map}/> */}

                {/* <p> Hier kommen die verschiedenen Layer hin </p> im LayerTree*/}
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
