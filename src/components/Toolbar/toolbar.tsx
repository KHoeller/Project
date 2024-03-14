
import React, {useState} from "react";
import { SizeType } from "antd/es/config-provider/SizeContext";
import './toolbar.css';
import { Button, Flex } from 'antd';
import { ToolTwoTone, AimOutlined, DownloadOutlined } from '@ant-design/icons';

export default function Toolbar (){

    const size = 'middle';

    return(
        <>
            <div className="buttonContainer">
                <Button type="text" className= 'tool' icon= { <ToolTwoTone twoToneColor='black'/>} shape='default' size={size}/>
                <Button className= 'tool' type="text"  icon= { <AimOutlined style={{ color: 'black'}}/>} shape='default' size={size} />
                <Button type="text" className='tool' icon= { <DownloadOutlined style={{ color: 'black'}}/>} size={size} shape='default'  />
                <Button className= 'tool' type="text" shape ='default' size ={size}/> 
            </div>
        </>
    )
} 