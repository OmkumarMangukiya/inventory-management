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
            if (!warehouseId) {
                setError("Warehouse ID is missing");
                return;
            }
            if (!productName || !soldQuantity) {
                setError("Product name and quantity are required");
                return;
            }
            await axios.post('http://localhost:8787/warehouseSales', {
                productName,
                soldQuantity: parseInt(soldQuantity as string)
            }, {
                headers: {
                    warehouseId: warehouseId
                }
            });
            setError(null); 
            navigate('/warehouse');
        } catch (error) {
            console.error("Error in submitting sales:", error);
            setError("Failed to submit sales. Please try again.");
        }
    };

    return (
        <div className="bg-[#0B0C10] min-h-screen flex items-center justify-center">
            <div className="bg-[#1F2833] p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-[#C5C6C7] mb-6">Warehouse Sales</h2>
                
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                
                <div className="mb-4">
                    <label className="block text-[#C5C6C7] mb-2">Product Name:</label>
                    <Input
                        type="text"
                        className="w-full p-3 border border-gray-600 bg-[#0B0C10] text-[#C5C6C7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#45A29E] transition duration-200"
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Enter product name"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-[#C5C6C7] mb-2">Sold Quantity:</label>
                    <Input
                        type="number"
                        className="w-full p-3 border border-gray-600 bg-[#0B0C10] text-[#C5C6C7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#45A29E] transition duration-200"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSoldQuantity(e.target.value)}
                        placeholder="Enter sold quantity"
                    />
                </div>

                <div className="text-center">
                    <Button 
                        onClick={handleSales} 
                        name="Save" 
                        className="bg-[#45A29E] text-[#0B0C10] px-4 py-2 rounded-lg hover:bg-[#66FCF1] transition duration-200"
                    />
                </div>
            </div>
        </div>
    );
};

export default WarehouseSales;
