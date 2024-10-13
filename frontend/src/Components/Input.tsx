
import React from 'react';

interface InputProps {
    type: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ type, placeholder, onChange }) => {
    return (
        <div className='rounded-lg border-2 border-black '>
        <input
            type={type}
            placeholder={placeholder}
            onChange={onChange}
        />
        </div>
    );
}

export default Input;