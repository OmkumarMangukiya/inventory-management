import Input from "../Components/Input";
import { useState } from "react";
import Button from "../Components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setrole] = useState("");

  const handleSignIn = () => {
    axios
      .post(`http://localhost:8787/users/signup`, {
        username,
        password,
        email,
        role,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
      })
      .catch((error) => {
        console.error("Error signing up!", error);
      });

    axios
      .post(`http://localhost:8787/users/role`, {}, {
        headers: { role: localStorage.getItem('role') }
      })
      .then((response) => {
        navigate(`/${response.data.headTo}`);
      })
      .catch((error) => {
        console.error("Error getting role!", error);
      });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#0B0C10] text-[#C5C6C7]">
      <div className="w-full max-w-md bg-[#1F2833] bg-opacity-90 p-8 rounded-lg shadow-lg backdrop-blur-md">
        <h2 className="text-center text-3xl font-bold text-[#C5C6C7] mb-6">Sign Up</h2>

        {/* Email Field */}
        <div className="mb-4">
          <Input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full p-4 border border-[#C5C6C7] rounded-lg text-[#0B0C10] focus:ring-2 focus:ring-[#45A29E]"
          />
        </div>

        {/* Username Field */}
        <div className="mb-4">
          <Input
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            type="text"
            className="w-full p-4 border border-[#C5C6C7] rounded-lg text-[#0B0C10] focus:ring-2 focus:ring-[#45A29E]"
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <Input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full p-4 border border-[#C5C6C7] rounded-lg text-[#0B0C10] focus:ring-2 focus:ring-[#45A29E]"
          />
        </div>

        {/* Role Dropdown */}
        <div className="mb-6">
          <label htmlFor="role" className="block mb-2 text-lg font-medium text-[#C5C6C7]">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setrole(e.target.value)}
            className="w-full px-4 py-2 text-gray-900 font-medium border-2 border-[#C5C6C7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#45A29E] transition-all duration-300"
          >
            <option value="" disabled>Select a role</option>
            <option value="manager">Manager</option>
            <option value="headmanager">Head Manager</option>
            <option value="owner">Owner</option>
          </select>
        </div>

        {/* Sign Up Button */}
        <Button
          name="Sign Up"
          onClick={handleSignIn}
          className="w-full bg-[#45A29E] text-white py-2 px-4 rounded-lg hover:bg-[#3B8885] transition duration-300"
        />

        {/* Redirect to Sign In */}
        <div className="mt-6 text-center">
          <span className="text-[#C5C6C7]">Have an account?</span>
          <button
            onClick={() => navigate("/")}
            className="ml-2 text-[#45A29E] hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
