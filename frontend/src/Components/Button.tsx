import React from 'react';

interface ButtonProps {
    name?: string;
    onClick: () => void;
    className?: string;
    children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ name, onClick, className, children }) => {
    return (
        <button onClick={onClick} className={`rounded-lg transition duration-200 ${className}`}>
            {children ? children : name}
        </button>
    );
};

export default Button;