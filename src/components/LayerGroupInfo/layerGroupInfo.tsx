// infoIcon for pollutants 
import React, { useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';

import './layerGroupInfo.css';

 type InfoIconProps = {
    infoTextTitle?: string,
    infoText?: string,
}

const InfoIcon: React.FC<InfoIconProps> = ({infoTextTitle, infoText}) => {
    
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    }

    const handleOk = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation(); // Stoppt die Ausbreitung des Klickereignisses zum übergeordneten Element
        setIsModalOpen(false);
    }

    const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation(); 
        setIsModalOpen(false);
      };
    
    const size = 'middle';
    const type = 'text';

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation(); // sStoppt die Ausbreitung des Klickereignisses zum übergeordneten Button
        showModal(); // Öffnet das Modal
    }

    return (
        <span className='layer-tree-info'> 
            <Button type={type} icon={<InfoCircleOutlined style={{ color: '#1890ff' }} />} shape='default' size={size} onClick={handleButtonClick}/>
            <Modal title={infoTextTitle} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}> 
                <p>{infoText}</p>
            </Modal>
        </span>
    );
};

export default InfoIcon;