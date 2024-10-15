import React from 'react';

interface ButtonProps {
    name: string;
    onClick: () => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ name, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
        >
            {name}
        </button>
    );
};

export default Button;