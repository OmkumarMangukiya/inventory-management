import Input from "./Input";
import { useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
const AddProduct = () => {
  const navigate = useNavigate()
  const handleClick = () => {
    const wareshouseId = localStorage.getItem('warehouseId');
    const token =  localStorage.getItem('token');
    axios.post(`http://localhost:8787/addproduct`,{name,price,qauntity,date},{
        headers: {
            'warehouseId' :wareshouseId,
            'token':token
        }
    }).then((response)=>{
        console.log(response)
    })
    navigate('/warehouse')
  };

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [qauntity, setQauntity] = useState(0);
  const [date, setDate] = useState<Date | null>(new Date());
  return (
    <div className="flex justify-center pt-10">
    <div className="p-7 w-full max-w-sm bg-white rounded-lg mt-16 ">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Product Name"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Input
          type="number"
          placeholder="Price"
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 0) {
              setPrice(value);
            }
            else{
              alert("Quantity must be greater than 0")
            }
          }}
        />
      </div>
      <div className="mb-4">
        <Input
          type="number"
          placeholder="Quantity"
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 0) {
              setQauntity(value);
            }
            else{
              alert("Quantity must be greater than 0")
            }
          }}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Expiry Date
        </label>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
          className="border-2 border-black rounded-md  py-1 px-4  max-w-32 "
        />
      </div>
      <div className="flex justify-end">
      <Button
                    onClick={handleClick}
                    className="bg-white text-black border-2 border-black py-2 px-4 rounded-lg hover:bg-blue-600 hover:text-white  transition duration-200 shadow-md relative overflow-hidden group"
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