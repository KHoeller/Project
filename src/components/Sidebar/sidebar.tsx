import React, { useState } from "react";
import './sidebar.css';

import { Button, Drawer } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

export default function Sidebar (){

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return(
        <div className="sidebarContainer">
            <Drawer
                title='Themenbaum'
                onClose={onClose}
                open={open}
                placement="right"
                className="sidebarDrawer"
            >
                <p> Hier kommen die verschiedenen Layer hin </p>
            </Drawer>
            <Button
                type="text"
                onClick={showDrawer}
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
