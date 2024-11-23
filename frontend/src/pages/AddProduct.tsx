import { useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import Input from '../Components/Input'; // Adjust the import based on your file structure

export default function AddProduct() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [qauntity, setqauntity] = useState<number | string>("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    const warehouseId = localStorage.getItem("warehouseId");
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:8787/addproduct",
        { name, price: Number(price), qauntity: Number(qauntity), date },
        {
          headers: {
            warehouseId: warehouseId,
            token: token,
          },
        }
      );
      console.log(response);
      navigate("/warehouse");
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-lg px-7 pt-9 pb-16 shadow-xl">
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
          <div className="rounded-md shadow-sm space-y-4">
            <div className="py-1">
              {/* Replace with custom Input component */}
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
              {/* Replace with custom Input component */}
              <Input
                type="number"
                name="price"
                placeholder="Price"
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value > 0) {
                    setPrice(value);
                    setError(null); // Clear error if valid
                  } else {
                    setError("Price must be greater than 0");
                  }
                }}
                className="rounded-md"
                required
              />
            </div>
            <div className="py-1">
              {/* Replace with custom Input component */}
              <Input
                type="number"
                name="qauntity"
                placeholder="qauntity"
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value > 0) {
                    setqauntity(value);
                    setError(null); // Clear error if valid
                  } else {
                    setError("qauntity must be greater than 0");
                  }
                }}
                className="rounded-md"
                required
              />
            </div>
            <div className="pl-2 text-gray-700">Expiry Date</div>
            <div className=" ">
              <DatePicker
                selected={date}
                onChange={(date: Date | null) => setDate(date)}
                dateFormat="dd/MM/yyyy"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                placeholderText="Choose Expiry Date"
                required
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
  );
}
