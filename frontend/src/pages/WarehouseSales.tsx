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
        <div>
            <h2>Warehouse Sales</h2>
            {error && <p style={{ color: "red" }}>{error}</p>} 
            <div>
                <label>Product Name:</label>
                <Input
                    type="text"
                    
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter product name"
                />
            </div>

            <div>
                <label>Sold Quantity:</label>
                <Input
                    type="number"
                    
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSoldQuantity(e.target.value)}
                    placeholder="Enter sold quantity"
                />
            </div>

            <Button onClick={handleSales} name="Save" /> 
        </div>
    );
};

export default WarehouseSales;
