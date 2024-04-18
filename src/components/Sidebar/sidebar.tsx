

import React, { useState, useEffect } from "react";
import Map from 'ol/Map';  
import './sidebar.css';

import { Button, Drawer } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

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

    const AttributionsOl = document.getElementsByClassName("ol-attribution ol-unselectable ol-control ol-uncollapsible") //.forEach(element:HTMLE => element.style('left: 380') )
    for (let i = 0; i < AttributionsOl.length; i++) {
        const AttributionOl = AttributionsOl.item(i) as HTMLElement;
        // console.log('css:', AttributionOl.style);
        AttributionOl.style.right = open ? '380px' : '8px';
        AttributionOl.style.transition = 'right 0.33s';
    }

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
            > <LayerManager map={map} />
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


