import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

    const handleDownload = async () => {
        const invoiceContent = document.querySelector('.invoice-content');
        if (!invoiceContent) return;

        try {
            // Create canvas from the invoice content
            const canvas = await html2canvas(invoiceContent as HTMLElement, {
                scale: 2, // Higher scale for better quality
                logging: false,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            // Calculate dimensions
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Create PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(
                canvas.toDataURL('image/png'),
                'PNG',
                0,
                0,
                imgWidth,
                imgHeight,
                '',
                'FAST'
            );

            // Download the PDF
            pdf.save(`Invoice-${sale?.invoiceNumber}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!sale) return <div>Sale not found</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-3xl mx-auto">
                {/* Invoice Content - This will be captured for PDF */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                    <div className="p-8 invoice-content">
                        <div className="flex justify-between items-center border-b pb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Inventory Management System
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {new Date(sale.saleDate).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-xl font-semibold text-gray-700">
                                    Invoice #{sale.invoiceNumber}
                                </h2>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sale Details</h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Product</p>
                                    <p className="text-base text-gray-900 mt-1">{sale.product.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Date</p>
                                    <p className="text-base text-gray-900 mt-1">
                                        {new Date(sale.saleDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Quantity</p>
                                    <p className="text-base text-gray-900 mt-1">{sale.quantity} units</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Unit Price</p>
                                    <p className="text-base text-gray-900 mt-1">₹{sale.product.price.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t">
                                <div className="flex justify-end">
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-600">Total Amount</p>
                                        <p className="text-xl font-bold text-gray-900 mt-1">
                                            ₹{sale.totalAmount.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons - Separate from invoice content */}
                <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                    <button
                        onClick={() => navigate('/sales/history')}
                        className="inline-flex items-center text-blue-600 hover:text-blue-900"
                    >
                        <svg 
                            className="w-4 h-4 mr-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to Sales History
                    </button>
                    
                    <button
                        onClick={handleDownload}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download Invoice
                    </button>
                </div>
            </div>
        </div>
    );
} 