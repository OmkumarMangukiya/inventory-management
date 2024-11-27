'use client'

import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { useNavigate } from 'react-router-dom'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface DashboardStats {
  totalRevenue: number
  ordersProcessed: number
  averageOrderValue: number
  totalProducts: number
}

interface WarehouseData {
  id: string
  name: string
}

interface SaleData {
  saleDate: string
  totalAmount: number
}

const Dashboard: React.FC = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('')
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    ordersProcessed: 0,
    averageOrderValue: 0,
    totalProducts: 0
  })
  const [profitData, setProfitData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Daily Sales (₹)',
        data: [] as number[],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: '#fff'
      }
    ]
  })
  const navigate = useNavigate()

  useEffect(() => {
    const savedWarehouseId = localStorage.getItem('warehouseId')
    if (savedWarehouseId) {
      setSelectedWarehouse(savedWarehouseId)
    }
  }, [])

  const processChartData = (salesData: SaleData[]) => {
    const dailySales = salesData.reduce((acc: { [key: string]: number }, sale) => {
      const date = new Date(sale.saleDate).toLocaleDateString()
      acc[date] = (acc[date] || 0) + sale.totalAmount
      return acc
    }, {})

    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toLocaleDateString()
    }).reverse()

    setProfitData({
      labels: last7Days,
      datasets: [
        {
          label: 'Daily Sales (₹)',
          data: last7Days.map(date => dailySales[date] || 0),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          fill: true,
          tension: 0.1,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: 'rgb(75, 192, 192)',
          pointBorderColor: '#fff',
          pointHoverRadius: 6,
          pointHoverBackgroundColor: 'rgb(75, 192, 192)',
          pointHoverBorderColor: '#fff'
        }
      ]
    })
  }

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const token = localStorage.getItem('token')
        const roles = localStorage.getItem('role')
        const response = await fetch('http://localhost:8787/warehouses', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'role': roles || ''
          }
        })

        if (!response.ok) throw new Error('Failed to fetch warehouses')
        const data = await response.json()
        setWarehouses(data)
      } catch (error) {
        console.error('Error fetching warehouses:', error)
      }
    }

    fetchWarehouses()
  }, [])

  useEffect(() => {
    const fetchSalesData = async () => {
      if (!selectedWarehouse) return

      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `http://localhost:8787/dashboard/profits?warehouseId=${selectedWarehouse}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) throw new Error('Failed to fetch sales data')

        const data = await response.json()
        if (data && Array.isArray(data.sales)) {
          processChartData(data.sales)
        }
      } catch (error) {
        console.error('Error fetching sales data:', error)
      }
    }

    fetchSalesData()
  }, [selectedWarehouse])

  useEffect(() => {
    const fetchWarehouseStats = async () => {
      if (!selectedWarehouse) return

      try {
        const token = localStorage.getItem('token')
        const response = await fetch(
          `http://localhost:8787/dashboard/stats?warehouseId=${selectedWarehouse}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) throw new Error('Failed to fetch warehouse stats')

        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching warehouse stats:', error)
      }
    }

    fetchWarehouseStats()
  }, [selectedWarehouse])

  return (
    <div className="p-6 bg-gray-100 min-h-screen w-full overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
        <select
          value={selectedWarehouse}
          onChange={(e) => {
            setSelectedWarehouse(e.target.value)
            localStorage.setItem('warehouseId', e.target.value)
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

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Sales Trends</h2>
        <div className="h-[400px]">
          <Line
            data={profitData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                  },
                  ticks: {
                    callback: (value) => `₹${value}`,
                    font: {
                      size: 12
                    }
                  }
                },
                x: {
                  grid: {
                    display: false
                  },
                  ticks: {
                    font: {
                      size: 12
                    }
                  }
                }
              },
              plugins: {
                legend: {
                  display: true,
                  position: 'top' as const,
                  labels: {
                    boxWidth: 10,
                    usePointStyle: true,
                    pointStyle: 'circle'
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  padding: 12,
                  titleFont: {
                    size: 14
                  },
                  bodyFont: {
                    size: 13
                  },
                  callbacks: {
                    label: (context) => `₹${context.parsed.y.toLocaleString()}`
                  }
                }
              }
            }}
          />
        </div>
      </div>

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
  )
}
export default Dashboard