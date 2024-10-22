import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { auth } from "../../../backend/src/routes/auth"
import { AlertCircle } from "lucide-react"
import Input from "../Components/Input"
import Button from "../Components/Button"
import image1 from "../assets/img1.jpg"
export default function Signin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (token) {
      const decoded = auth(token)
      if (!decoded) {
        console.log("Token is not valid")
        return
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
          navigate(`/${response.data.headTo}`)
        })
        .catch((error) => {
          console.error("Error fetching role!", error)
          setError("Error fetching user role. Please try again.")
        })
    }
  }, [token, navigate])

  const handleSignIn = () => {
    axios
      .post(`http://localhost:8787/users/signin`, { username, password })
      .then((response) => {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("role", response.data.role)
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
            navigate(`/${roleResponse.data.headTo}`)
          })
          .catch((error) => {
            console.error("Error getting role!", error)
            setError("Error getting user role. Please try again.")
          })
      })
      .catch((error) => {
        console.error("Sign in error!", error)
        setError("Invalid username or password. Please try again.")
      })
      
  }

  return (
    <div className="h-[108px] flex">
    <div className="w-[1380px] h-screen hidden xl:block">
                <img src={image1} alt="Sign in" className="w-full h-full object-cover" />
            </div>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 w-[540px] py-12 px-8 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 px-10">
        <div className="">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 ">Sign in to your account</h2>
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
                                type="text"
                                placeholder="Username"
                                onChange={(e) => setUsername(e.target.value)}
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-400 focus:border-none sm:text-sm"
                            />
                        </div>
                        <div className="relative">
                            <Input
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-400 focus:border-none sm:text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <Button
                            name="Sign In"
                            onClick={handleSignIn}
                            className="w-full bg-blue-600 text-white border-none hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="text-center">
                    <p className="mt-2 text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button onClick={() => navigate('/signup')} className="font-medium text-blue-600 hover:text-blue-500">
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
               </div>
               </div>
  )
}