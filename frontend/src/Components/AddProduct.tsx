import Input from "./Input";
import { useState } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

const AddProduct = () => {
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
  };

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [qauntity, setQauntity] = useState(0);
  const [date, setDate] = useState<Date | null>(new Date());
  return (
    <div className="p-4">
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
          className="border border-gray-300 p-2 rounded"
        />
      </div>
      <button onClick={handleClick} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200">
        Add Product
      </button>
    </div>
  );
  
  };

  export default AddProduct;  