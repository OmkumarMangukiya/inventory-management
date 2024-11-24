import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from 'lucide-react';

interface Sale {
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

export default function SalesHistory() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterText, setFilterText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchSalesHistory();
    }, []);

    const fetchSalesHistory = async () => {
        try {
            const warehouseId = localStorage.getItem('warehouseId');
            const response = await axios.get('http://localhost:8787/sales/history', {
                headers: {
                    warehouseId
                }
            });
            setSales(response.data.sales || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sales history:', error);
            setError('Failed to load sales history');
            setLoading(false);
        }
    };

    const filteredSales = Array.isArray(sales) ? sales.filter(sale => 
        sale.product.name.toLowerCase().includes(filterText.toLowerCase()) ||
        sale.invoiceNumber.toLowerCase().includes(filterText.toLowerCase())
    ) : [];

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Sales History</h1>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                placeholder="Search sales..."
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                            <SearchIcon className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                        </div>
                    </div>

                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Invoice Number
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Quantity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Total Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {sale.invoiceNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {sale.product.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {sale.quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₹{sale.totalAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(sale.saleDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => navigate(`/sales/${sale.id}`)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 