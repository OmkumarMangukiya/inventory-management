interface ButtonProps {
    name: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const Button = ({ name, onClick }: ButtonProps) => {
    return (
        <button onClick={onClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {name}
        </button>
    );
}

export default Button;