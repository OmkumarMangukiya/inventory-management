import axios from "axios";
import { useEffect, useState } from "react";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";
export const Warehouses  =()=>{
    interface Warehouse {
        id: number;
        name: string;
        location: string;
        totalstock: number;
    }
    const navigate = useNavigate()
    const [warehouse, setWarehouses] = useState<Warehouse[]>([]);
    const fetchData = async () => {
        try {
          // Replace with your actual API endpoint
          const roles= localStorage.getItem('role')
          const response = await axios.get(`http://localhost:8787/warehouses`,{
            
                headers: {
                    role: roles
                }
            
          });
          
          setWarehouses(response.data);
        } catch (error) {
          console.error('Error fetching warehouse data:', error);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);
    return (
        <div>
            <h1>Warehouses</h1>
            <table className="table table-striped table-bordered">
  <thead className="thead-dark ">
    <tr className="">
      <th scope="col">Warehouse Name</th>
      <th scope="col">Location</th>
      <th scope="col">Total Stock</th>
    </tr>
  </thead>
  <tbody>
    {warehouse.map((wh) => (
      <tr key={wh.id}>
        <td>{wh.name}</td>
        <td>{wh.location}</td>
        <td>{wh.totalstock}</td>
      </tr>
    ))}
  </tbody>
</table>
<Button name="Add warehouse" onClick={()=>navigate('/addwarehouse')} ></Button>
        </div>
    );
}
