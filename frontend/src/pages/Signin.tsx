import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../../../backend/src/routes/auth";
import { AlertCircle } from "lucide-react";
import Input from "../Components/Input";
import Button from "../Components/Button";
import image1 from "../assets/img1.jpg";

export default function Signin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decoded = auth(token);
      if (!decoded) {
        console.log("Token is not valid");
        return;
      }

      axios
        .post(
          `http://localhost:8787/users/role`,
          {},
          {
            headers: {
              role: localStorage.getItem("role"),
            },
          }
        )
        .then((response) => {
          navigate(`/${response.data.headTo}`);
        })
        .catch((error) => {
          console.error("Error fetching role!", error);
          setError("Error fetching user role. Please try again.");
        });
    }
    // Optional cleanup
    return () => setError(null);
  }, [token, navigate]);

  const handleSignIn = () => {
    axios
      .post(`http://localhost:8787/users/signin`, { username, password })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);

        axios
          .post(
            `http://localhost:8787/users/role`,
            {},
            {
              headers: {
                role: response.data.role,
              },
            }
          )
          .then((roleResponse) => {
            navigate(`/${roleResponse.data.headTo}`);
          })
          .catch((error) => {
            console.error("Error getting role!", error);
            setError("Error getting user role. Please try again.");
          });
      })
      .catch((error) => {
        console.error("Sign in error!", error);
        setError("Invalid username or password. Please try again.");
      });
  };

  return (
    <div className="flex h-screen font-sans">
      <div className="relative w-[70%] h-full">
        <img src={image1} alt="Sign in" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>

        <div className="absolute inset-0 flex items-start justify-center pt-10 z-10">
          <h2 className="text-white text-5xl font-bold bg-black bg-opacity-40 px-8 py-4 rounded-lg shadow-xl transform transition-transform">
          Stay on track, Never look back.
          </h2>
        </div>
      </div>

      {/* Right Side - Sign In Component (30% width) */}
      <div className="w-[30%] flex items-center justify-center bg-white py-16 px-12 sm:px-10 lg:px-12 shadow-2xl">
        <div className="max-w-md w-full space-y-10 px-10">
          <div>
            <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
              Welcome Back!
            </h2>
            <p className="text-center text-gray-500">Sign in to continue</p>
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
                  type="text"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none rounded-lg block w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-none sm:text-sm transition-transform hover:scale-105"
                />
              </div>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-lg block w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-none sm:text-sm transition-transform hover:scale-105"
                />
              </div>
            </div>
            <div>
              <Button
                name="Sign In"
                onClick={handleSignIn}
                className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105"
              />
            </div>
          </div>
          <div className="text-center">
            <p className="mt-4 text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
