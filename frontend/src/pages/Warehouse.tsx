/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { auth } from '../../../backend/src/routes/auth';
import Button from "../Components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Warehouse = () => {
    const [product, setProduct] = useState<product[]>([]);
    
    interface product {
        id: string,
        name: string,
        price: number,
        qauntity: number,
        expiry: Date,
    }

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
                        warehouseId: warehouseId
                    }
                }).then((response) => {
                    setProduct(response.data);
                });
            } else if (role === 'manager') {
                axios.post('http://localhost:8787/warehouse', {}, {
                    headers: {
                        token: token
                    }
                }).then((response) => {
                    setProduct(response.data);
                });
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            {product.map((p) => {
                return (
                    <div className="flex gap-2" key={p.id}>
                        <div className="text-green-600">{p.name}</div>
                        <div className="text-blue-500">{p.price}</div>
                        <div className="text-red-700">{p.qauntity}</div>
                    </div>
                );
            })}
            <Button name="Add Product" onClick={() => navigate('/addproduct')} />
            <Button name="Sell Products" onClick={() => navigate('/warehouseSales')} />
        </div>
    );
};

export default Warehouse;
