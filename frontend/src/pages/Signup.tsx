import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import image1 from "../assets/img1.jpg"; // Add a background image similar to the Sign-in page.

export default function Signup() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    try {
      const response = await axios.post(`http://localhost:8787/users/signup`, {
        username,
        password,
        email,
        role,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      const roleResponse = await axios.post(
        `http://localhost:8787/users/role`,
        {},
        {
          headers: { role: response.data.role },
        }
      );
      navigate(`/${roleResponse.data.headTo}`);
    } catch (error) {
      console.error("Error signing up!", error);
      setError("Failed to sign up. Please try again.");
    }
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Left Side - Image (70% width) */}
      <div className="relative w-[70%] h-full hidden md:block">
        {/* Image with Gradient Overlay */}
        <img src={image1} alt="Sign Up" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        
        {/* Quote on Image */}
        <div className="absolute inset-0 flex items-start justify-center pt-10 z-10">
          <h6 className="text-white text-3xl font-bold bg-black bg-opacity-40 px-8 py-4 rounded-lg shadow-xl transform transition-transform">
          Get Started with Effortless Inventory Management - Sign Up Now !
          </h6>
        </div>
      </div>

      {/* Right Side - Sign Up Component (30% width) */}
      <div className="w-full md:w-[30%] flex items-center justify-center bg-white py-16 px-12 sm:px-10 lg:px-12 shadow-2xl">
        <div className="max-w-md w-full space-y-10 px-10">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create an Account
            </h2>
            <p className="text-center text-gray-500">Join us to get started</p>
          </div>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
          <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-md">
              <div className="relative pb-4">
                <Input
                  type="email"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-lg block w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-none sm:text-sm transition-transform hover:scale-105"
                />
              </div>
              <div className="relative pb-4">
                <Input
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none rounded-lg block w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-none sm:text-sm transition-transform hover:scale-105"
                />
              </div>
              <div className="relative pb-4">
                <Input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-lg block w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-none sm:text-sm transition-transform hover:scale-105"
                />
              </div>
              <div className="relative">
                <label htmlFor="role" className="sr-only">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  className="appearance-none rounded-lg block w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-none sm:text-md transition-transform hover:scale-105"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  <option value="manager">Manager</option>
                  <option value="headmanager">Head Manager</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
            </div>
            <div>
              <Button
                name="Sign Up"
                onClick={handleSignUp}
                className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105"
              />
            </div>
          </div>
          <div className="text-center">
            <p className="mt-4 text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/")}
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
