import Input  from "../Components/Input.tsx";
import { useState } from "react";
import Button from "../Components/Button.tsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const Signin = () => {
    // const [email,setEmail]=useState("");
    const navigate = useNavigate();
    const [password,setPassword]=useState("");
    const [username,setUsername]=useState("");
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
        <div className="flex justify-around">
        {/* <div className="bg-blue-100 w-full flex justify-center transition-all hover:shadow-inner text-4xl pt-80 px-60 font-medium" >
            Splitting Money is now &nbsp;
            
                <div className=" text-green-600">
                    easy
                </div>
            </div> */}
        <div className="flex items-center w-full justify-center min-h-screen  bg-gray-200 border-s-2 border-black">
            
            <div className="w-full max-w-sm p-8 bg-white rounded-md shadow-md">
                <div className="flex justify-center text-xl mb-4">
            <h2 className="mb-6">Sign In Page</h2>
            </div>
                <div className="mb-8 min-w-36">
                    <Input onChange={(e) => setUsername(e.target.value)} placeholder="Username" type="text" />
                </div>
                <div className="mb-8">
                    <Input onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
                </div>
               
                <div>
                    <Button name="Sign in" onClick={handleSignIn} />
                </div>
                <div className="flex ">
                <div className="pt-2 pr-2">Don't have account?</div>
                <button className="pt-2 text-green-500 font-medium" onClick={()=>navigate('/signup')}>Sign Up Now</button>
                </div>
            </div>
        </div>
                </div>
            );
        };