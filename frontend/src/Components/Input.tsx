import React, { useState ,useRef} from 'react';

interface InputProps {
    type: string;
    name?: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    required?: boolean;
}

const Input: React.FC<InputProps> = ({ type, placeholder, onChange, className }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setIsFocused(false);
            setHasValue(false);
        } else {
            setHasValue(true);
        }
    };
    const handleLabelClick = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    return (
        <div className="relative">
        <input
            ref={inputRef}
            type={type}
            placeholder={""}
            onChange={(e) => {
                onChange(e);
                if (e.target.value !== '') {
                    setHasValue(true);
                } else {
                    setHasValue(false);
                }
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 bg-transparent text-black border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${className}`}
        />
        <label
            onClick={handleLabelClick}
            className={`absolute left-4 px-1 transition-all duration-300 ease-in-out ${
                isFocused || hasValue ? 'text-xs -top-3 text-gray-600 bg-gray-50' : 'text-base top-2 text-gray-400 bg-transparent'
            }`}
        >
            {placeholder}
        </label>
    </div>
    );
};

export default Input;