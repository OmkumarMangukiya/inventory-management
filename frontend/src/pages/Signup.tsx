import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { AlertCircle } from "lucide-react"
import Button from "../Components/Button"
import Input from "../Components/Input"
export default function Signup() {
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async () => {
    try {
      const response = await axios.post(`http://localhost:8787/users/signup`, {
        username,
        password,
        email,
        role,
      })
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("role", response.data.role)

      const roleResponse = await axios.post(
        `http://localhost:8787/users/role`,
        {},
        {
          headers: { role: response.data.role },
        }
      )
      navigate(`/${roleResponse.data.headTo}`)
    } catch (error) {
      console.error("Error signing up!", error)
      setError("Failed to sign up. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign up for an account</h2>
        </div>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        <div className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="relative pb-4">
                            <Input
                                type="email"
                                placeholder="Email address"
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-400 focus:border-none sm:text-sm"
                            />
                        </div>
                        <div className="relative pb-4">
                            <Input
                                type="text"
                                placeholder="Username"
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-400 focus:border-none sm:text-sm"
                            />
                        </div>
                        <div className="relative pb-4">
                            <Input
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-400 focus:border-none sm:text-sm"
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
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-400 focus:border-none sm:text-md"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="" disabled >Select a role</option>
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
                            className="w-full bg-blue-600 text-white border-none hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="text-center">
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <button onClick={() => navigate("/")} className="font-medium text-blue-600 hover:text-blue-500">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}