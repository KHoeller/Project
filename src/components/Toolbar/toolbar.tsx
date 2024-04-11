
import React, {useState} from "react";
import './toolbar.css';
import { Button, Flex } from 'antd';
import { ToolTwoTone, AimOutlined, DownloadOutlined } from '@ant-design/icons';
import {Zoom} from 'ol/control.js';


export type ToolbarProps = {
    modalVisible: boolean,
}

export default function Toolbar ({modalVisible}: ToolbarProps){

    const size = 'middle';
    const typeB = 'default';
    

    const ZoomButtons = document.getElementsByClassName("ol-zoom ol-unselectable ol-control") //.forEach(element:HTMLE => element.style('left: 380') )
    for (let i = 0; i < ZoomButtons.length; i++) {
        const ZoomButton = ZoomButtons.item(i) as HTMLElement;
        console.log('css:', ZoomButton.style)
        ZoomButton.style.left = modalVisible ? '380px' : '8px';
        ZoomButton.style.transition = 'left 0.33s';
    }

    return(
        <>
            <div className="buttonContainer" style={{ left: modalVisible ? '380px' : '8px' }}>
                <Button 
                    type={typeB} 
                    className= 'tool' //className={DrawerLeft open ? "Toolbar ToolbarDrawerOpen" : "Toolbar"} // TODO 
                    icon= { <ToolTwoTone twoToneColor='black'/>} 
                    shape='default' size={size}
                />
                <Button className= 'tool' type={typeB}  icon= { <AimOutlined style={{ color: 'black'}}/>} shape='default' size={size} />
                <Button type={typeB} className='tool' icon= { <DownloadOutlined style={{ color: 'black'}}/>} size={size} shape='default'  />
                <Button className= 'tool' type={typeB} shape ='default' size ={size}/> 
            </div>
           
        </>
    )
} 


// import React, { useState } from "react";
// import './toolbar.css';
// import { Button } from 'antd';
// import { ToolTwoTone } from '@ant-design/icons';

// export type ToolbarProps = {
//     onLengthButtonClick: any,
//     onAreaButtonClick: any, 
// }

// export default function Toolbar({ onLengthButtonClick, onAreaButtonClick }: ToolbarProps) {
//     const size = 'middle';
//     const typeB = 'default';
//     const [lengthButtonClicked, setLengthButtonClicked] = useState(false);
//     const [areaButtonClicked, setAreaButtonClicked] = useState(false);

//     const handleLengthButtonClick = () => {
//         setLengthButtonClicked(true);
//         if (onLengthButtonClick) {
//             onLengthButtonClick(true); // Ruft die Callback-Funktion auf, um mitzuteilen, dass der Button geklickt wurde
//         }
//     };

//     const handleAreaButtonClick = () => {
//         setAreaButtonClicked(true);
//         if (onAreaButtonClick) {
//             onAreaButtonClick(true); // Ruft die Callback-Funktion auf, um mitzuteilen, dass der Button geklickt wurde
//         }
//     };

//     return (
//         <div className="buttonContainer">
//             <Button
//                 type={typeB}
//                 className='length'
//                 icon={<ToolTwoTone twoToneColor='black' />}
//                 shape='default'
//                 size={size}
//                 onClick={handleLengthButtonClick}
                
//             >
//                 Length
//             </Button>
//             <Button
//                 type={typeB}
//                 className='Area'
//                 icon={<ToolTwoTone twoToneColor='black' />}
//                 shape='default'
//                 size={size}
//                 onClick={handleAreaButtonClick}
//             >
//                 Area
//             </Button>
//         </div>
//     );
// }