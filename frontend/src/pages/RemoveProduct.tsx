import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

export default function RemoveProduct() {
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state?.product;
    const [error, setError] = useState<string | null>(null);

    const handleRemove = async () => {
        const warehouseId = localStorage.getItem("warehouseId");
        const token = localStorage.getItem("token");

        try {
            const response = await axios.delete(`http://localhost:8787/removeproduct`, {
                headers: {
                    warehouseId: warehouseId,
                    token: token,
                },
                data: {
                    productId: product.id,
                },
            });
            console.log(response);
            navigate("/warehouse");
        } catch (error) {
            console.error("Error removing product:", error);
            setError("Failed to remove product. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white rounded-lg px-7 pt-9 pb-16 shadow-xl">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Remove Product
                </h2>
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                            <p className="ml-3 text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}
                <div className="text-center">
                    <p>Are you sure you want to remove the product <strong>{product.name}</strong>?</p>
                    <button
                        onClick={handleRemove}
                        className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Remove Product
                    </button>
                </div>
            </div>
        </div>
    );
} 