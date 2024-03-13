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
                type="primary"
                onClick={showDrawer}
                className="openButton"
                shape='default'
                size='small'
                style={{ right: open ? '380px' : '0', padding: '0px !important'}}
            > {open ? <MenuUnfoldOutlined style={{color: 'black'}}/> : <MenuFoldOutlined style={{color: 'black'}}/> }
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
