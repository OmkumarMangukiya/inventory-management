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
            <h2 className="mb-6">Sign Up Page</h2>
          </div>
          <div className="mb-8">
            <Input
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
            />
          </div>
          <div className="mb-8 min-w-36">
            <Input
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              type="text"
            />
          </div>
          <div className="mb-8">
            <Input
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
            />
          </div>

          <div className="mb-8 border-2 border-black rounded-lg">
            <select
              onChange={(e) => setrole(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Select a role
              </option>
              <option value="manager">Manager</option>
              <option value="headmanager">Head Manager</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          <div>
            <Button name="Sign in" onClick={handleSignIn} />
          </div>
          <div className="flex ">
            <div className="pt-2 pr-2">Have a account?</div>
            <button
              className="pt-2 text-green-500 font-medium"
              onClick={() => {
                navigate("/");
              }}
            >
              Sign In{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
