import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import Input from '../Components/Input';

interface Warehouse {
  id: string;
  name: string;
  location: string;
}

export default function Shift() {
  const navigate = useNavigate();
  const location = useLocation();
  const productDetails = location.state?.productDetails;
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<number | string>("");
  const [targetWarehouseId, setTargetWarehouseId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  // Get source warehouse ID from localStorage
  const warehouseId = localStorage.getItem("warehouseId");

  useEffect(() => {
    if (productDetails) {
      setName(productDetails.name);
      // Pre-fill the product name if coming from the warehouse page
    }
  }, [productDetails]);

  useEffect(() => {
    // Fetch available warehouses for the dropdown
    const fetchWarehouses = async () => {
      try {
        const token = localStorage.getItem("token");
        const roles = localStorage.getItem("role");
        
        if (!token) {
          setError("Authentication token missing");
          return;
        }

        const response = await axios.get("http://localhost:8787/warehouses", {
          headers: { 
            'Authorization': `Bearer ${token}`,  // Changed from token to Bearer token
            'Content-Type': 'application/json',
            'role': roles || ''
          }
        });

        if (response.data) {
          console.log('Fetched warehouses:', response.data); // Debug log
          setWarehouses(response.data);
        } else {
          setError("No warehouses data received");
        }
      } catch (err) {
        console.error("Error fetching warehouses:", err);
        setError("Failed to load warehouses");
      }
    };

    fetchWarehouses();
  }, []);

  const handleClick = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication token is missing. Please log in.");
      return;
    }

    if (!warehouseId || !targetWarehouseId) {
      setError("Both source and target warehouse IDs are required.");
      return;
    }

    if (warehouseId === targetWarehouseId) {
      setError("Source and target warehouses cannot be the same.");
      return;
    }

    if (!name || !quantity) {
      setError("Product name and quantity are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8787/warehouse/shiftproduct",
        { 
          name, 
          quantity: Number(quantity)
        },
        {
          headers: {
            warehouseId,
            targetWarehouseId,
            token,
          },
        }
      );
      
      if (response.data.message) {
        navigate("/warehouse");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      console.error("Error shifting product:", error);
      setError(err.response?.data?.error || "Failed to shift product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-lg px-7 pt-9 pb-16 shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Shift Product</h2>
          {warehouseId && (
            <p className="mt-2 text-center text-sm text-gray-600">
              From Warehouse: {warehouses.find(w => w.id === warehouseId)?.name || warehouseId}
            </p>
          )}
        </div>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="py-1">
              <Input
                type="text"
                name="product-name"
                placeholder="Product Name"
                onChange={(e) => setName(e.target.value)}
                className="rounded-t-md py-2"
                required
              />
            </div>
            <div className="py-1">
              <Input
                type="number"
                name="quantity"
                placeholder="Quantity"
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value > 0) {
                    setQuantity(value);
                    setError(null); 
                  } else {
                    setError("Quantity must be greater than 0");
                  }
                }}
                className="rounded-md"
                required
              />
            </div>
            <div className="py-1">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={targetWarehouseId}
                onChange={(e) => setTargetWarehouseId(e.target.value)}
                required
              >
                <option value="">Select Target Warehouse</option>
                {warehouses
                  .filter(warehouse => warehouse.id !== warehouseId) // Exclude current warehouse
                  .map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name} - {warehouse.location}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleClick}
            >
              Shift Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
