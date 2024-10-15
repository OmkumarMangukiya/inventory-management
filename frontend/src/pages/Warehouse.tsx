import React, { useEffect, useState } from "react";
import { auth } from '../../../backend/src/routes/auth';
import Button from "../Components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Warehouse = () => {
    interface Product {
        id: string;
        name: string;
        price: number;
        qauntity: number;
        expiry: Date;
    }

    const [product, setProduct] = useState<Product[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            const authResult = await auth(token);
            if (!authResult) return;

            const { role } = authResult;
            const warehouseId = localStorage.getItem('warehouseId');

            if (role === 'owner' || role === 'headmanager') {
                axios.post('http://localhost:8787/warehouse', {}, {
                    headers: {
                        token: token,
                        warehouseId: warehouseId,
                    }
                }).then((response) => {
                    setProduct(response.data);
                });
            } else if (role === 'manager') {
                axios.post('http://localhost:8787/warehouse', {}, {
                    headers: {
                        token: token,
                    }
                }).then((response) => {
                    setProduct(response.data);
                });
            }
        };
        fetchData();
    }, []);

    return (
        <div className="p-10 max-w-5xl mx-auto bg-[#1F2833] shadow-lg rounded-lg mt-10 border border-[#C5C6C7]">
            <h1 className="text-4xl font-bold mb-8 text-center text-[#C5C6C7]">Warehouse Products</h1>

            {product.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto bg-[#1F2833] rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-[#0B0C10] text-[#C5C6C7]">
                                <th className="px-6 py-4 text-left text-lg font-semibold">Product Name</th>
                                <th className="px-6 py-4 text-left text-lg font-semibold">Price</th>
                                <th className="px-6 py-4 text-left text-lg font-semibold">Quantity</th>
                                <th className="px-6 py-4 text-left text-lg font-semibold">Expiry Date</th>
                                <th className="px-6 py-4 text-left text-lg font-semibold">Total Expense</th>
                            </tr>
                        </thead>
                        <tbody>
                            {product.map((p, index) => (
                                <tr key={p.id} className={index % 2 === 0 ? "bg-[#1F2833]" : "bg-[#0B0C10]"}>
                                    <td className="px-6 py-4 text-[#C5C6C7] text-lg font-medium">{p.name}</td>
                                    <td className="px-6 py-4 text-[#C5C6C7] text-lg">₹{p.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-[#C5C6C7] text-lg">{p.qauntity} units</td>
                                    <td className="px-6 py-4 text-[#C5C6C7] text-lg">
                                        {new Date(p.expiry).toLocaleDateString("en-GB", {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-[#C5C6C7] text-lg font-medium">₹{(p.price * p.qauntity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center text-[#C5C6C7] text-lg mt-10">No products available.</div>
            )}

            <div className="mt-10 text-right space-x-4">
                <Button
                    onClick={() => navigate('/addproduct')}

                    className="bg-white text-black border-2 border-black py-2 px-4 rounded-lg hover:bg-blue-500 hover:text-white  transition duration-200 shadow-md relative overflow-hidden group"

                >
                    <span className="relative z-10">Add Product</span>
                </Button>
                <Button
                    onClick={() => navigate('/warehouseSales')}
                    className="bg-gradient-to-r from-[#45A29E] to-[#66FCF1] text-white border-2 border-transparent py-2 px-4 rounded-lg hover:from-[#66FCF1] hover:to-[#45A29E] transition duration-200 shadow-md relative overflow-hidden group"
                >
                    <span className="relative z-10">Sell</span>
                </Button>
            </div>
        </div>
    );
};

export default Warehouse;
