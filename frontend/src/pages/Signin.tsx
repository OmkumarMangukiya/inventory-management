import Input  from "../Components/Input.tsx";
import { useState } from "react";
import Button from "../Components/Button.tsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../backend/src/routes/auth.ts";
export const Signin = () => {
    // const [email,setEmail]=useState("");
    const navigate = useNavigate();
    const [password,setPassword]=useState("");
    const [username,setUsername]=useState("");
    const token = localStorage.getItem('token')
    if(token){
        const decoded = auth(token);
        if (!decoded) {
            console.log("token is not valid")
            return;
        }
       

        axios.post(`http://localhost:8787/users/role`,{},{
            headers:{
                role : localStorage.getItem('role')
            }
        })
        .then((response:{data:{headTo:string}})=>{
            console.log(response.data.headTo)
            navigate(`/${response.data.headTo}`)
        })
        .catch((error:Error)=>{
            console.error("There was an error getting the role!", error);
        })
    }
    const handleSignIn = () => {
        console.log("run");
        // const apiUrl = import.meta.env.REACT_APP_API_URL;
        axios.post(`http://localhost:8787/users/signin`, { username, password })
            
            .then((response: { data: { token: string ,role:string} }) => {
                console.log("Sign in successful", response);
                localStorage.setItem('token',response.data.token)
                localStorage.setItem('role',response.data.role)
            })
            
            .catch((error: Error) => {
                console.error("There was an error signing in!", error);
            });
        axios.post(`http://localhost:8787/users/role`,{},{
            headers:{
                role : localStorage.getItem('role')
            }
        })
        .then((response:{data:{headTo:string}})=>{
            console.log(response.data.headTo)
            navigate(`/${response.data.headTo}`)
        })
        .catch((error:Error)=>{
            console.error("There was an error getting the role!", error);
        })
    };
    return (
        <div className="flex justify-around items-center min-h-screen bg-gradient-to-r from-gray-700 to-gray-900">
            <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-xl transition-all duration-300 ease-in-out hover:shadow-2xl">
                <div className="text-center text-2xl font-semibold mb-6 text-gray-700">
                    Sign In
                </div>
                <div className="mb-6">
                    <Input onChange={(e) => setUsername(e.target.value)} placeholder="Username" type="text" />
                </div>
                <div className="mb-6">
                    <Input onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
                </div>
                <div className="mb-4">
                    <Button name="Sign in" onClick={handleSignIn} />
                </div>
                <div className="flex justify-center text-sm">
                    <span className="text-gray-600 mr-2">Don't have an account?</span>
                    <button 
                        onClick={() => navigate('/signup')}
                    >
                    
                        Signup Now
                    </button>
                </div>
            </div>
        </div>
    );
        };