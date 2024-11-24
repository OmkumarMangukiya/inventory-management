import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AlertCircle, CheckCircle } from "lucide-react"

interface productData {
  id: string
  name: string
  quantity : number
  price: number
}

export default function WarehouseSales() {
  const [productName, setProductName] = useState("")
  const [soldquantity, setSoldquantity] = useState<number | string>("")
  const [error, setError] = useState<string | null>(null)
  const [productOptions, setProductOptions] = useState<productData[]>([]) 
  const [maxProductquantity , setMaxProductquantity] = useState<number| string>("")
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate()

  const handleSales = async () => {
    try {
        const warehouseId = localStorage.getItem("warehouseId");
        if (!warehouseId) {
            setError("Warehouse ID is missing");
            return;
        }

        // Validate inputs
        if (!productName) {
            setError("Please select a product");
            return;
        }

        if (!soldquantity) {
            setError("Please enter quantity");
            return;
        }

        // Find the product ID from productOptions
        const selectedProduct = productOptions.find(p => p.name === productName);
        if (!selectedProduct) {
            setError("Product not found");
            return;
        }

        const quantity = parseInt(soldquantity as string);
        const totalAmount = quantity * selectedProduct.price;

        console.log('Sending sale request:', {
            productId: selectedProduct.id,
            quantity,
            totalAmount,
            warehouseId
        });

        const response = await axios.post(
            "http://localhost:8787/warehouseSales",
            {
                productId: selectedProduct.id,
                quantity,
                totalAmount
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'warehouseId': warehouseId
                }
            }
        );

        console.log('Sale response:', response.data);

        if (response.data.message === 'Sale recorded successfully') {
            setError(null);
            setSuccess("Sale recorded successfully! Redirecting...");
            setProductName("");
            setSoldquantity("");
            setMaxProductquantity("");
            setTimeout(() => {
                navigate("/sales/history");
            }, 1500);
        } else {
            setError(response.data.error || "Failed to record sale. Please try again.");
        }
    } catch (error: any) {
        console.error("Error in submitting sales:", error.response?.data || error);
        setError(error.response?.data?.error || "Failed to submit sales. Please try again.");
    }
  };
  const handleProductClick = async () => {
      const warehouseId = localStorage.getItem("warehouseId");
      const token = localStorage.getItem('token')
      try{
        const response = await axios.post(`http://localhost:8787/warehouse`,{},{
          headers: {
            warehouseId: warehouseId,
            token,
          },
        })
        console.log(response.data);
        setProductOptions(response.data);

        return 0; 
      }
      catch(error){
        console.error("Error :", error)
      }
  }
  useEffect(()=>{
    handleProductClick()
  },[])
 
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setProductName(selectedName);
    
    const selectedProduct = productOptions.find(product => product.name === selectedName);
    if (selectedProduct) {
      setMaxProductquantity(selectedProduct.quantity);
      setSoldquantity("");
    } else {
      setMaxProductquantity("");
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value);
    
    if (value === "") {
      setSoldquantity("");
      return;
    }

    if (!isNaN(numValue)) {
      if (numValue <= Number(maxProductquantity)) {
        setSoldquantity(numValue);
      } else {
        setSoldquantity(Number(maxProductquantity));
      }
    }
  };

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
        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <p className="ml-3 text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="product-name" className="sr-only">
                Product Name
              </label>
              <select
                id="product-name"
                name="product-name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                value={productName}
                onChange={handleProductChange}
              >
                <option value="">Select Product</option>
                {productOptions.map((element) => (
                  <option key={element.id} value={element.name}>
                    {element.name}
                  </option>
                ))}
              </select>

            </div>
            <div>
              <label htmlFor="sold-quantity" className="sr-only">
                Sold quantity
              </label>
              <input
                id="sold-quantity"
                name="sold-quantity"
                type="number"
                required
                min="1"
                max={maxProductquantity as number}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder={`Enter quantity (max: ${maxProductquantity})`}
                value={soldquantity}
                onChange={handleQuantityChange}
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