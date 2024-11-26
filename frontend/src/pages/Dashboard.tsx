import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  totalRevenue: number;
  ordersProcessed: number;
  averageOrderValue: number;
  totalProducts: number;
}

interface WarehouseData {
  id: string;
  name: string;
}

interface SaleData {
  saleDate: string;
  totalAmount: number;
  quantity: number;
}

const Dashboard: React.FC = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    ordersProcessed: 0,
    averageOrderValue: 0,
    totalProducts: 0
  });
  const [profitData, setProfitData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      tension: number;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        label: 'Daily Sales',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Get the selected warehouse ID from localStorage
    const savedWarehouseId = localStorage.getItem('warehouseId');
    if (savedWarehouseId) {
      setSelectedWarehouse(savedWarehouseId);
    }
  }, []);

  // Function to process sales data for the chart
  const processChartData = (salesData: SaleData[]) => {
    // Group sales by date and sum the total amounts
    const dailySales = salesData.reduce((acc: { [key: string]: number }, sale) => {
      const date = new Date(sale.saleDate).toLocaleDateString();
      acc[date] = (acc[date] || 0) + sale.totalAmount;
      return acc;
    }, {});

    // Get the last 7 days of data
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString();
    }).reverse();

    // Create chart data
    const chartData = {
      labels: last7Days,
      datasets: [
        {
          label: 'Daily Sales (₹)',
          data: last7Days.map(date => dailySales[date] || 0),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    };

    setProfitData(chartData);
  };

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const token = localStorage.getItem('token');
        const roles = localStorage.getItem('role');
        const response = await fetch('http://localhost:8787/warehouses', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'role': roles || ''
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch warehouses');
        }
        
        const data = await response.json();
        console.log('Fetched warehouses:', data); // Debug log
        setWarehouses(data);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      }
    };

    fetchWarehouses();
  }, []);

  useEffect(() => {
    const fetchSalesData = async () => {
      if (!selectedWarehouse) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8787/dashboard/profits?warehouseId=${selectedWarehouse}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch sales data');
        }

        const data = await response.json();
        if (data.sales) {
          processChartData(data.sales);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, [selectedWarehouse]);

  useEffect(() => {
    const fetchWarehouseStats = async () => {
      if (!selectedWarehouse) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8787/dashboard/stats?warehouseId=${selectedWarehouse}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch warehouse stats');
        }
        
        const data = await response.json();
        setStats(data);

        const profitResponse = await fetch(`http://localhost:8787/dashboard/profits?warehouseId=${selectedWarehouse}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (profitResponse.ok) {
          const profitData = await profitResponse.json();
          // Update chart data here
          // ... handle profit data update
        }
      } catch (error) {
        console.error('Error fetching warehouse stats:', error);
      }
    };

    fetchWarehouseStats();
  }, [selectedWarehouse]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
        <select
          value={selectedWarehouse}
          onChange={(e) => {
            setSelectedWarehouse(e.target.value);
            localStorage.setItem('warehouseId', e.target.value);
          }}
          className="p-2 border rounded-md"
        >
          <option value="">Select Warehouse</option>
          {warehouses.map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </option>
          ))}
        </select>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold">₹{stats.totalRevenue}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Orders Processed</h3>
          <p className="text-2xl font-bold">{stats.ordersProcessed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Average Order Value</h3>
          <p className="text-2xl font-bold">₹{stats.averageOrderValue}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Total Products</h3>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>
      </div>

      {/* Profit Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Sales Trends</h2>
        <div className="h-[400px]">
          <Line 
            data={profitData} 
            options={{ 
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `₹${value}`
                  }
                }
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context) => `₹${context.parsed.y}`
                  }
                }
              }
            }} 
          />
        </div>
      </div>

      {/* Navigation Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/warehouse')}
          className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Products
        </button>
        <button
          onClick={() => navigate('/addproduct')}
          className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Inventory Management
        </button>
        <button
          onClick={() => navigate('/sales/history')}
          className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Order History
        </button>
      </div>
    </div>
  );
};

export default Dashboard; 