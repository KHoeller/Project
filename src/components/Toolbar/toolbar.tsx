
import React, {useEffect, useState} from "react";
import './toolbar.css';
import { Button, Flex } from 'antd';
import { ToolTwoTone, AimOutlined, DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';

import ToggleButton from "../ToogleButton/toggleButton";



export type ToolbarProps = {
    drawerVisible: boolean,
    setInfoButtonClicked: (clicked: boolean) => void;
    infoButtonClicked:boolean,
}

export default function Toolbar ({drawerVisible, setInfoButtonClicked, infoButtonClicked}: ToolbarProps){

    const size = 'middle';
    const typeB = 'default';
    

    // Damit ZoomButtons bei Öffnen von DrawerLeft nach rechts in die Map verschoben werden 
    const ZoomButtons = document.getElementsByClassName("ol-zoom ol-unselectable ol-control") //.forEach(element:HTMLE => element.style('left: 380') )
    for (let i = 0; i < ZoomButtons.length; i++) {
        const ZoomButton = ZoomButtons.item(i) as HTMLElement;
        console.log('css:', ZoomButton.style)
        ZoomButton.style.left = drawerVisible ? '380px' : '8px';
        ZoomButton.style.transition = 'left 0.33s';
    }

    // Damit ScaleLine bei Öffnen von DrawerLeft nach rechts in die Map verschoben werden 
    const ScaleLines = document.getElementsByClassName("ol-scale-line ol-unselectable") //.forEach(element:HTMLE => element.style('left: 380') )
    for (let i = 0; i < ScaleLines.length; i++) {
        const ScaleLine = ScaleLines.item(i) as HTMLElement;
        console.log('css:', ScaleLine.style);
        ScaleLine.style.left = drawerVisible ? '380px' : '8px';
        ScaleLine.style.transition = 'left 0.33s';
    }
  
    const handleInfoButtonClick = () => {
        setInfoButtonClicked(!infoButtonClicked); // Kehre den Zustand von infoButtonClicked um
    };

    return(
        <>
            <div className="buttonContainer" style={{ left: drawerVisible ? '380px' : '8px' }}>
                <Button 
                    type={typeB} 
                    className= 'tool' //className={DrawerLeft open ? "Toolbar ToolbarDrawerOpen" : "Toolbar"} // TODO 
                    icon= { <ToolTwoTone twoToneColor='black'/>} 
                    shape='default' size={size}
                />
                <Button className= 'tool' type={typeB}  icon= { <AimOutlined style={{ color: 'black'}}/>} shape='default' size={size} />
                <Button type={typeB} className='tool' icon= { <DownloadOutlined style={{ color: 'black'}}/>} size={size} shape='default'  />
                {/* <Button className= 'InfoFeatureButton' type={typeB} shape ='default' size ={size} icon= { <InfoCircleOutlined style={{ color: 'black'}}/>} onClick={handleInfoButtonClick}/>  */}
                <ToggleButton className= 'InfoFeatureButton' 
                    type={typeB} 
                    shape ='default' 
                    size ={size} 
                    icon= { <InfoCircleOutlined 
                        style={{ color: 'black'}}/>} 
                    onClick={handleInfoButtonClick} 
                    pressed={infoButtonClicked} 
                    pressedIcon={ <InfoCircleOutlined 
                        style={{ color: 'black'}}/>} 
                /> 
                <ToggleButton/>
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