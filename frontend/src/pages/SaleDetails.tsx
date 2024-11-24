import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface SaleDetails {
    id: string;
    productId: string;
    warehouseId: string;
    quantity: number;
    totalAmount: number;
    saleDate: string;
    invoiceNumber: string;
    product: {
        name: string;
        price: number;
    };
}

export default function SaleDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sale, setSale] = useState<SaleDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSaleDetails();
    }, [id]);

    const fetchSaleDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:8787/sales/${id}`);
            setSale(response.data.sale || null);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sale details:', error);
            setError('Failed to load sale details');
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!sale) return <div>Sale not found</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Invoice #{sale.invoiceNumber}</h1>
                        <button
                            onClick={() => window.print()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Print Invoice
                        </button>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Sale Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Date</p>
                                <p className="text-lg">{new Date(sale.saleDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Product</p>
                                <p className="text-lg">{sale.product.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Quantity</p>
                                <p className="text-lg">{sale.quantity} units</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Unit Price</p>
                                <p className="text-lg">₹{sale.product.price.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Amount</p>
                                <p className="text-lg font-bold">₹{sale.totalAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <button
                            onClick={() => navigate('/sales/history')}
                            className="text-blue-600 hover:text-blue-900"
                        >
                            ← Back to Sales History
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 