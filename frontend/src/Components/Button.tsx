import React from 'react';

interface ButtonProps {
    name?: string;
    onClick: () => void;
    className?: string;
    children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ name, onClick, className, children }) => {
    return (
        <button 
            onClick={onClick} 
            className={`relative inline-flex items-center justify-center overflow-hidden bg-white text-black border-2 border-black py-2 px-4 rounded-lg hover:bg-gray-900 hover:text-white transition duration-200 shadow-md group ${className}`}>
            
            <span className="relative z-10">
                {children ? children : name}
            </span>
            
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-[700ms]"></div>
        
        </button>
    );
};

export default Button;
