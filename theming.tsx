import React from 'react';
import { Button } from 'antd';

const CustomButton = () => {
  const buttonStyle = {
    background: 'rgba(255, 255, 255, 0.5)', // Leicht durchsichtiges Weiß
    border: '1px solid #ccc', // Hellgrauer Rand
    color: '#000', // Textfarbe (schwarz)
  };

  return (
    <Button style={buttonStyle}>
      Custom Button
    </Button>
  );
};

export default CustomButton;