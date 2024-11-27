import { useEffect, useState } from "react"
import { auth } from "../../../backend/src/routes/auth"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { SearchIcon, PlusIcon, ArrowRightLeft, Clock, Trash } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  quantity: number
  expiry: Date
}

export default function Warehouse() {
  const [products, setProducts] = useState<Product[]>([])
  const [filterText, setFilterText] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Authentication token missing")
        setLoading(false)
        return
      }

      const authResult = await auth(token)
      if (!authResult) {
        setError("Authentication failed")
        setLoading(false)
        return
      }

      const { role } = authResult
      const warehouseId = localStorage.getItem("warehouseId")

      try {
        const response = await axios.post(
          "http://localhost:8787/warehouse",
          {},
          {
            headers: {
              token: token,
              warehouseId: warehouseId,
            },
          }
        )
        setProducts(Array.isArray(response.data) ? response.data : [])
        setLoading(false)
      } catch (error) {
        console.error("Error fetching warehouse data:", error)
        setProducts([])
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleShiftProduct = (product: Product) => {
    navigate('/shift', { 
      state: { 
        productDetails: {
          name: product.name,
          quantity: product.quantity
        }
      }
    });
  };

  // Calculate days until expiry for a product
  const getDaysUntilExpiry = (expiryDate: Date) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-gray-900">
        <div className="spinner"></div>
        <span className="ml-4">Loading Products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-red-500">
        {error}
      </div>
    );
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Warehouse Products</h1>
          <div className="flex gap-x-4">
            <button
              onClick={() => navigate("/expired-products")}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-gray-400 flex items-center hover:bg-red-700 transition duration-300"
            >
              <Clock className="w-5 h-5 mr-2" />
              Expired Products
            </button>
            <button
              onClick={() => navigate("/warehouseSales")}
              className="bg-white text-blue-500 px-6 py-2 rounded-lg hover:text-blue-600 shadow-lg hover:shadow-xl hover:shadow-gray-400 font-medium transition duration-300"
            >
              Sell
            </button>
            <button
              onClick={() => navigate("/addproduct")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-gray-400 flex items-center hover:bg-blue-700 transition duration-300"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search products..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Expense
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const daysUntilExpiry = getDaysUntilExpiry(product.expiry);
                  const isNearExpiry = daysUntilExpiry <= 30; // Warning for products expiring within 30 days

                  return (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity} units</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(product.expiry).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{(product.price * product.quantity).toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        daysUntilExpiry <= 0 ? 'text-red-600' : 
                        isNearExpiry ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {daysUntilExpiry <= 0 ? 'Expired' :
                         `Expires in ${daysUntilExpiry} days`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleShiftProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center mr-2"
                        >
                          <ArrowRightLeft className="w-4 h-4 mr-1" />
                          Shift
                        </button>
                        <button
                          onClick={() => navigate('/removeproduct', { state: { product } })}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <Trash className="w-4 h-4 mr-1" />
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No products found. Click "Add Product" to add your first product.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}