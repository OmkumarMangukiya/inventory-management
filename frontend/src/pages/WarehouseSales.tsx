import { useState } from "react";
import axios from "axios";
import Button from "../Components/Button"; 
import { useNavigate } from "react-router-dom";
import Input from "../Components/Input";
const WarehouseSales = () => {
    const [productName, setProductName] = useState<string>("");
    const [soldQuantity, setSoldQuantity] = useState<number | string>(""); 
    const [error, setError] = useState<string | null>(null); 
    const navigate = useNavigate();
    const handleSales = async () => {
        try {
            const warehouseId = localStorage.getItem('warehouseId');
            console.log("hi1");
            if (!warehouseId) {
                setError("Warehouse ID is missing");
                return;
            }
            console.log("hi2");
            if (!productName || !soldQuantity) {
                setError("Product name and quantity are required");
                return;
            }
            console.log("hi3");
            await axios.post('http://localhost:8787/warehouseSales', {
                productName,
                soldQuantity: parseInt(soldQuantity as string) 
            }, {
                headers: {
                    warehouseId: warehouseId
                }
            });
            console.log("hi4");
            setError(null); 
            navigate('/warehouse')

        } catch (error) {
            console.error("Error in submitting sales:", error);
            setError("Failed to submit sales. Please try again.");
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-black-100">
        <div className="w-96 h-96 p-6 bg-white rounded-lg shadow-md flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Warehouse Sales</h2>
            {error && <p style={{ color: "red" }}>{error}</p>} 
            <div className="mb-4 w-full">
                <label className="block mb-2 text-gray-700">Product Name:</label>
                <Input
                    type="text"
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
                />
            </div>
            <div className="mb-4 w-full">
                <label className="block mb-2 text-gray-700">Sold Quantity:</label>
                <Input
                    type="number"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSoldQuantity(e.target.value)}
                    placeholder="Enter sold quantity"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
                />
            </div>
    
            <Button onClick={handleSales} name="Save" className="bg-rose-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-200" /> 
        </div>
    </div>
    );
};

export default WarehouseSales;
