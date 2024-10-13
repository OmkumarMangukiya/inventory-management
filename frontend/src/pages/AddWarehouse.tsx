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
        <div>
            <h1>Add Warehouse</h1>
            <form>
                <Input type="text" placeholder="Warehouse Name" onChange={(e)=>setName(e.target.value)}/>
                <Input type="text" placeholder="Warehouse Location" onChange={(e)=>setLocation(e.target.value)}/>
                <Button name="Add Warehouse" onClick={() => { handleClick(); navigate('/warehouses'); }}/>
            </form>
        </div>
    )
}