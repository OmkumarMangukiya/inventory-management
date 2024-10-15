import Input from "./Input";
import { useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const AddProduct = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [qauntity, setQauntity] = useState(0);
  const [date, setDate] = useState<Date | null>(new Date());

  const handleClick = () => {
    const warehouseId = localStorage.getItem('warehouseId');
    const token = localStorage.getItem('token');
    axios.post(`http://localhost:8787/addproduct`, { name, price, qauntity, date }, {
      headers: {
        'warehouseId': warehouseId,
        'token': token
      }
    }).then((response) => {
      console.log(response);
    });
    navigate('/warehouse');
  };

  return (
    <div className="flex justify-center pt-10 bg-gradient-to-r from-[#0B0C10] to-[#1F2833] min-h-screen">
      <div className="p-7 w-full max-w-sm bg-[#1F2833] rounded-lg shadow-md mt-16 mb-64">
        <h1 className="text-2xl font-bold mb-4 text-[#C5C6C7]">Add Product</h1>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Product Name"
            className="w-full p-3 border border-gray-600 bg-[#0B0C10] text-[#C5C6C7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#45A29E] transition duration-200"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <Input
            type="number"
            placeholder="Price"
            className="w-full p-3 border border-gray-600 bg-[#0B0C10] text-[#C5C6C7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#45A29E] transition duration-200"
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 0) {
                setPrice(value);
              } else {
                alert("Price must be greater than or equal to 0");
              }
            }}
          />
        </div>

        <div className="mb-4">
          <Input
            type="number"
            placeholder="Quantity"
            className="w-full p-3 border border-gray-600 bg-[#0B0C10] text-[#C5C6C7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#45A29E] transition duration-200"
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 0) {
                setQauntity(value);
              } else {
                alert("Quantity must be greater than or equal to 0");
              }
            }}
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#C5C6C7] text-sm font-bold mb-2">
            Expiry Date
          </label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            dateFormat="dd/MM/yyyy"
            className="border-2 border-gray-600 bg-[#0B0C10] text-[#C5C6C7] rounded-md py-1 px-4 max-w-32 focus:outline-none focus:ring-2 focus:ring-[#45A29E] transition duration-200"
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleClick}
            className="bg-[#45A29E] text-[#0B0C10] font-bold border-2 border-black py-2 px-4 rounded-lg hover:bg-[#66FCF1] hover:text-black transition duration-200 shadow-md relative overflow-hidden group"
          >
            <span className="relative z-10">Add Product</span>
            <div className="inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-[700ms]"></div>
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
      <Button
                    onClick={handleClick}
                    className="bg-white text-black border-2 border-black py-2 px-4 rounded-lg hover:bg-blue-500 hover:text-white  transition duration-200 shadow-md relative overflow-hidden group"
                >
                    <span className="relative z-10">Add Product</span>
                    <div className="inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-[700ms]"></div>
                </Button>
                </div>
    </div>

    </div>
  );
};

export default AddProduct;
