
import React from "react";
import './toolbar.css';
import { Button, Flex } from 'antd';
import { ToolTwoTone, AimOutlined, DownloadOutlined } from '@ant-design/icons';

export default function Toolbar (){

    return(
        <>
            <div className="buttonContainer">
                <Button className= 'tool' type="primary"  icon= { <ToolTwoTone twoToneColor='black' style={{fontSize: 20}}/>}> </Button>
                <Button className= 'tool' type="primary"  icon= { <AimOutlined style={{ color: 'black', fontSize: 20 }}/>}> </Button>
                <Button className= 'tool' type="primary"  icon= { <DownloadOutlined style={{ color: 'black', fontSize: 20}}/>}> </Button>
                <Button className= 'tool' type="primary"></Button> 
            </div>
        </>
    )
}