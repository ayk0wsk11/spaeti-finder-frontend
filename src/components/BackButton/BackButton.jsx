import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './BackButton.css';

const BackButton = ({ 
  to, 
  children = "← Back", 
  className = "", 
  variant = "default" 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <Button 
      className={`back-button ${className}`}
      onClick={handleClick}
      icon={<ArrowLeftOutlined />}
      type={variant === "text" ? "text" : "default"}
      size="middle"
    >
      {typeof children === 'string' ? children.replace('← ', '') : children}
    </Button>
  );
};

export default BackButton;
