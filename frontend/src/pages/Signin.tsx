import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../Components/Input";
import Button from "../Components/Button";
import { auth } from "../../../backend/src/routes/auth";
import signinphoto from "./signinphoto.png";

export const Signin = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            const decoded = auth(token);
            if (!decoded) {
                console.log("Token is not valid");
                return;
            }

            axios.post(`http://localhost:8787/users/role`, {}, {
                headers: {
                    role: localStorage.getItem('role'),
                },
            })
            .then((response) => {
                navigate(`/${response.data.headTo}`);
            })
            .catch((error) => {
                console.error("Error fetching role!", error);
            });
        }
    }, [token, navigate]);

    const handleSignIn = () => {
        axios.post(`http://localhost:8787/users/signin`, { username, password })
            .then((response) => {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
                axios.post(`http://localhost:8787/users/role`, {}, {
                    headers: {
                        role: response.data.role,
                    },
                })
                .then((roleResponse) => {
                    navigate(`/${roleResponse.data.headTo}`);
                })
                .catch((error) => {
                    console.error("Error getting role!", error);
                });
            })
            .catch((error) => {
                console.error("Sign in error!", error);
            });
    };

    return (
        <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center bg-[#0B0C10] text-[#C5C6C7]">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img 
                    src={signinphoto} 
                    alt="Sign in background" 
                    className="w-full h-full object-cover opacity-30" 
                />
            </div>

            {/* Quote Section */}
            <div className="relative z-10 flex-1 text-center md:text-left text-2xl md:text-4xl font-semibold px-6 mb-8 md:mb-0">
                <div className="bg-gradient-to-r from-[#0B0C10] to-transparent py-4 md:py-8 px-6 md:px-10 rounded-md">
                    "Stay on track, never look back."
                </div>
            </div>

            {/* Form Section */}
            <div className="relative z-20 w-full max-w-md bg-[#1F2833] bg-opacity-90 p-8 rounded-lg shadow-lg backdrop-blur-md">
                <h2 className="text-center text-3xl font-bold text-[#C5C6C7] mb-6">Sign In</h2>

                <div className="mb-4">
                    <Input 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="Username" 
                        type="text" 
                        className="w-full p-4 border border-[#C5C6C7] rounded-lg text-[#0B0C10] focus:ring-2 focus:ring-[#45A29E]"
                    />
                </div>

                <div className="mb-6">
                    <Input 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Password" 
                        type="password" 
                        className="w-full p-4 border border-[#C5C6C7] rounded-lg text-[#0B0C10] focus:ring-2 focus:ring-[#45A29E]"
                    />
                </div>

                <Button 
                    name="Sign in" 
                    onClick={handleSignIn} 
                    className="w-full bg-[#45A29E] hover:bg-[#3B8885] text-black font-semibold p-4 rounded-lg transition duration-300"
                />

                <div className="mt-6 text-center text-[#C5C6C7]">
                    <span>Don't have an account?</span>
                    <button 
                        onClick={() => navigate('/signup')} 
                        className="text-[#45A29E] hover:underline ml-2">
                        Signup Now
                    </button>
                </div>
            </div>
        </div>
    );
};
