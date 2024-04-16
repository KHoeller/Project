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

    const handleOk = () => {
       
        setIsModalOpen(false);
    }

    const handleCancel = () => {
        
        setIsModalOpen(false);
      };
    
    const size = 'middle';
    const type = 'text';

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation(); // Stoppt die Ausbreitung des Klickereignisses zum übergeordneten Button
        showModal(); // Öffnet das Modal
        return(false)
    }

    return (
        <span className='layer-tree-info' onClick={event => event.stopPropagation()}> 
        
            <Button type={type} icon={<InfoCircleOutlined style={{ color: '#1890ff' }} />} shape='default' size={size} onClick={handleButtonClick}/>
            <Modal 
                className='info-modal' 
                wrapClassName='info-modal-wrap'
                title={infoTextTitle} 
                open={isModalOpen} 
                onOk={handleOk} 
                onCancel={handleCancel}
                centered={true}
                maskClosable={false}
                mask={true}
                
            >
                {
                    infoText && (
                        <p 
                            dangerouslySetInnerHTML={{
                                __html: infoText
                            }}
                        />
                    )
                }
               
            </Modal>
        </span>
    );
};

export default InfoIcon;

//onClick={event => event.stopPropagation} -> führt dazu, dass auf dem Modal keine Clicks mehr zu Veränderung des Layertrees führen