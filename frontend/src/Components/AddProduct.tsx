import { useState } from "react"
import DatePicker from "react-datepicker"
import axios from "axios"
import "react-datepicker/dist/react-datepicker.css"
import { useNavigate } from "react-router-dom"
import { AlertCircle } from "lucide-react"

export default function AddProduct() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [price, setPrice] = useState<number | string>("")
  const [quantity, setquantity] = useState<number | string>("")
  const [date, setDate] = useState<Date | null>(new Date())
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    const warehouseId = localStorage.getItem("warehouseId")
    
    const token = localStorage.getItem("token")
    
    try {
      const response = await axios.post(
        `http://localhost:8787/addproduct`,
        { name, price: Number(price), quantity: Number(quantity), date },
        {
          headers: {
            warehouseId: warehouseId,
            token: token,
          },
        }
      )
      console.log(response)
      navigate("/warehouse")
    } catch (error) {
      console.error("Error adding product:", error)
      setError("Failed to add product. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Add New Product</h2>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="price" className="sr-only">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Price"
                value={price}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  if (value >= 0) {
                    setPrice(value)
                  } else {
                    setError("Price must be greater than or equal to 0")
                  }
                }}
              />
            </div>
            <div>
              <label htmlFor="quantity" className="sr-only">
                quantity
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="quantity"
                value={quantity}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  if (value >= 0) {
                    setquantity(value)
                  } else {
                    setError("quantity must be greater than or equal to 0")
                  }
                }}
              />
            </div>
            <div>
              <label htmlFor="expiry-date" className="sr-only">
                Expiry Date
              </label>
              <DatePicker
                id="expiry-date"
                selected={date}
                onChange={(date: Date | null) => setDate(date)}
                dateFormat="dd/MM/yyyy"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholderText="Expiry Date"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleClick}
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}