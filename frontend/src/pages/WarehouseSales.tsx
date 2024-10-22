import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AlertCircle } from "lucide-react"

export default function WarehouseSales() {
  const [productName, setProductName] = useState("")
  const [soldQuantity, setSoldQuantity] = useState<number | string>("")
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSales = async () => {
    try {
      const warehouseId = localStorage.getItem("warehouseId")
      if (!warehouseId) {
        setError("Warehouse ID is missing")
        return
      }
      if (!productName || !soldQuantity) {
        setError("Product name and quantity are required")
        return
      }
      await axios.post(
        "http://localhost:8787/warehouseSales",
        {
          productName,
          soldQuantity: parseInt(soldQuantity as string),
        },
        {
          headers: {
            warehouseId: warehouseId,
          },
        }
      )
      setError(null)
      navigate("/warehouse")
    } catch (error) {
      console.error("Error in submitting sales:", error)
      setError("Failed to submit sales. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Warehouse Sales</h2>
        </div>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="product-name" className="sr-only">
                Product Name
              </label>
              <input
                id="product-name"
                name="product-name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="sold-quantity" className="sr-only">
                Sold Quantity
              </label>
              <input
                id="sold-quantity"
                name="sold-quantity"
                type="number"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Sold Quantity"
                value={soldQuantity}
                onChange={(e) => setSoldQuantity(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleSales}
            >
              Save Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}