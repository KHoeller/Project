
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
        <Button className='buttonAbout' type="primary" onClick={showModal}>
        About
        </Button>
        <Modal title="About the Project" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        </Modal>
    </>
    );
};


