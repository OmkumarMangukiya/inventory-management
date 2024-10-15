/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
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
        <div className="p-10 max-w-5xl mx-auto bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Warehouse Products</h1>

            {product.length > 0 ? (
                <table className="min-w-full table-auto bg-gray-50 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="px-6 py-4 text-left text-lg font-semibold">Product Name</th>
                            <th className="px-6 py-4 text-left text-lg font-semibold">Price</th>
                            <th className="px-6 py-4 text-left text-lg font-semibold">Quantity</th>
                            <th className="px-6 py-4 text-left text-lg font-semibold">Expiry Date</th>
                            <th className="px-6 py-4 text-left text-lg font-semibold">Total Expense</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.map((p) => (
                            <tr key={p.id} className="bg-white hover:bg-gray-100 transition duration-200">
                                <td className="px-6 py-4 text-green-600 text-lg font-medium">{p.name}</td>
                                <td className="px-6 py-4 text-blue-500 text-lg">₹{p.price.toFixed(2)}</td>
                                <td className={`px-6 py-4 text-lg font-medium`}>{p.qauntity} units</td>
                                <td className="px-6 py-4 text-gray-500 text-lg">
                                    {new Date(p.expiry).toLocaleDateString("en-GB", {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </td>
                                <td className="px-6 py-4 text-purple-600 text-lg font-medium">₹{(p.price * p.qauntity).toFixed(2)}</td> {/* Total Expense */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-center text-gray-500 text-lg mt-10">No products available.</div>
            )}

            <div className="mt-10 text-right">
                {/* Button to Add Product */}
                <Button
                    name="Add Product"
                    onClick={() => navigate('/addproduct')}
                    className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-200"
                />

                {/* New Sale Button */}
                <Button
                    name="Sale"
                    onClick={() => navigate('/warehouseSales')}
                    className="ml-4 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition duration-200"
                />
            </div>
        </div>
    );
};

export default Warehouse;
