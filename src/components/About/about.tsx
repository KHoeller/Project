
import React, { useState } from "react";
import { Button, Modal } from "antd";

import './about.css';

export default function About (){
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };
    
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    
    return (
    <>
        <Button className='buttonAbout' type="default" onClick={showModal}>
            About
        </Button>
        <Modal 
            wrapClassName="Modal-About"
            title="About the Project" 
            open={isModalOpen} 
            onOk={handleOk} 
            onCancel={handleCancel}
            mask={true}
            maskClosable={false}
            centered={true}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
        </Modal>
    </>
    );
};


