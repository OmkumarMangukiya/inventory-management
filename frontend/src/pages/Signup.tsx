import Input from "../Components/Input.tsx";
import { useState } from "react";
import Button from "../Components/Button.tsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const Signup = () => {
  // const [email,setEmail]=useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setrole] = useState("");

  const handleSignIn = () => {
    console.log("run");
    // const apiUrl = import.meta.env.REACT_APP_API_URL;
    axios
      .post(`http://localhost:8787/users/signup`, {
        username,
        password,
        email,
        role,
      })

      .then((response: { data: { token: string; role: string } }) => {
        console.log("Sign up successful", response);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-950 to-black relative ">

        
        <div className="w-full max-w-sm p-8 bg-gray-100 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-gray-800">
            <div className="text-center text-2xl font-semibold mb-6 text-black">
                Sign Up Page
            </div>
            <div className="mb-6">
                <Input
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                />
            </div>
            <div className="mb-6">
                <Input
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    type="text"
                />
            </div>
            <div className="mb-6">
                <Input
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                />
            </div>
            <div className="mb-6">
                <label htmlFor="role" className="block mb-2 text-md font-medium text-black">
                    Role
                </label>
                <select
                    id="role"
                    value={role}
                    onChange={(e) => setrole(e.target.value)}
                    className="w-full px-4 py-2 text-gray-900 font-medium border-2 border-gray-300 rounded-lg focus:outline-none focus:border-2 focus:border-black transition-all duration-300"
                >
                    <option value="" disabled className="text-gray-600">
                        Select a role
                    </option>
                    <option value="manager" className="">Manager</option>
                    <option value="headmanager">Head Manager</option>
                    <option value="owner">Owner</option>
                </select>
            </div>
            <div className="mb-4 flex justify-end">
                <Button name="Sign Up" onClick={handleSignIn} className="bg-white text-black border-2 border-black py-2 px-4 rounded-lg hover:bg-gray-900 hover:text-white  transition duration-200 shadow-md relative overflow-hidden group">
                <span className="relative z-10">Sign up</span>
                
                    </Button>
            </div>
            <div className="flex justify-center text-sm">
                <span className="text-gray-950 mr-2">Have an account?</span>
                <button
                    className="text-gray-900 font-medium hover:font-semibold hover:underline transition-colors duration-300"
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    Sign In
                </button>
            </div>
        </div>
    </div>
);
};
