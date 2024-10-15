import Input from "./Input";
  import { useState } from "react";
  import DatePicker from "react-datepicker";
  import axios from "axios";
  import "react-datepicker/dist/react-datepicker.css";

  const AddProduct = () => {
    const handleClick = () => {
      const wareshouseId = localStorage.getItem('warehouseId');
      const token =  localStorage.getItem('token');
      axios.post('http://localhost:8787/addproduct',{name,price,qauntity,date},{
          headers: {
              'warehouseId' :wareshouseId,
              'token':token
          }
      }).then((response)=>{
          console.log(response)
      })
    };

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [qauntity, setQauntity] = useState(0);
    const [date, setDate] = useState<Date | null>(new Date());
    return (
      <div className="flex justify-around items-center min-h-screen bg-gradient-to-r from-gray-700 to-gray-900">
          <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl">
              <h1 className="text-center text-2xl font-semibold mb-6 text-gray-700">Add Product</h1>
  
              <div className="mb-6">
                  <Input
                      type="text"
                      placeholder="Product Name"
                      onChange={(e) => setName(e.target.value)}
                      className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
              </div>
  
              <div className="mb-6">
                  <Input
                      type="number"
                      placeholder="Price"
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
              </div>
  
              <div className="mb-6">
                  <Input
                      type="number"
                      placeholder="Quantity"
                      onChange={(e) => setQauntity(Number(e.target.value))}
                      className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
              </div>
  
              <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Expiry Date</label>
                  <DatePicker
                      selected={date}
                      onChange={(date) => setDate(date)}
                      dateFormat="dd/MM/yyyy"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
              </div>
  
              <button
                    onClick={handleClick}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200">
                    Add Product
              </button>
          </div>
      </div>
  );
  
  };

  export default AddProduct;  