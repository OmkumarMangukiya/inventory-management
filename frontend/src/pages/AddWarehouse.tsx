import axios from "axios";
import { useState } from "react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import { useNavigate } from "react-router-dom";


export const AddWarehouse= ()=>{

const  [name, setName] = useState("");
const  [location, setLocation] = useState("");

    const  navigate = useNavigate();
    const handleClick = async ()=>{
        
       
            const token = localStorage.getItem('token');
            const response = await axios.post("http://localhost:8787/addwarehouse", {name,location},{
                headers:{
                    'token': token,
                }
            })
            console.log(response.data);

    }
    
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4 bg-gradient-to-r from-gray-700 to-gray-900">
            <h1 className="text-2xl font-bold mb-4 text-white">Add Warehouse</h1>
            <form className="flex flex-col w-80 p-6 bg-white rounded-lg shadow-md">
                <Input type="text" placeholder="Warehouse Name" onChange={(e) => setName(e.target.value)}  />
                <div className="m-1"></div>
                <Input type="text" placeholder="Warehouse Location" onChange={(e) => setLocation(e.target.value)}  />
                <div className="m-2"></div>
                <Button name="Add Warehouse" onClick={() => { handleClick(); navigate('/warehouses'); }} />
            </form>
        </div>
        
    )
}