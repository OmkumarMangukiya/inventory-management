import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { PlusIcon, SearchIcon } from "lucide-react"

interface Warehouse {
  id: string
  name: string
  location: string
  totalstock: number
}

const  Warehouses=()=> {
  const navigate = useNavigate()
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filterText, setFilterText] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: keyof Warehouse; direction: "ascending" | "descending" }>({
    key: "name",
    direction: "ascending",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const roles = localStorage.getItem("role")
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:8787/warehouses", {
        headers: { role: roles, Authorization: `Bearer ${token}` },
      })
      setWarehouses(Array.isArray(response.data) ? response.data : [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching warehouse data:", error)
      setError("Failed to load warehouse data.")
      setWarehouses([])
      setLoading(false)
    }
  }

  const requestSort = (key: keyof Warehouse) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const sortedWarehouses = Array.isArray(warehouses) 
    ? [...warehouses].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    : [];

  const filteredWarehouses = Array.isArray(sortedWarehouses)
    ? sortedWarehouses.filter(
        (wh) =>
          wh.name.toLowerCase().includes(filterText.toLowerCase()) ||
          wh.location.toLowerCase().includes(filterText.toLowerCase())
      )
    : [];

  const handleOpenWarehouse = (warehouseId: string) => {
    localStorage.setItem('warehouseId', warehouseId);
    navigate('/dashboard');
  };

  const handleRemoveWarehouse = async (id: string) => {
    try {
      localStorage.setItem("warehouseId", id)
      const warehouseId = localStorage.getItem("warehouseId")
      await axios.post(`http://localhost:8787/warehouses/delete`, {}, {
        headers: { 'warehouseId': warehouseId },
      })
      setWarehouses(warehouses.filter((warehouse) => warehouse.id !== id))
    } catch (error) {
      console.error("Error removing warehouse:", error)
      setError("Failed to remove warehouse.")
    }
  }

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen bg-white text-gray-900">
            <div className="spinner"></div>
            <span className="ml-4">Warehouses Loading...</span>
        </div>
    );
}

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Warehouses</h1>
          <button
            onClick={() => navigate("/addwarehouse")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition duration-300"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Warehouse
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search warehouses..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["name", "location", "totalstock"].map((key) => (
                  <th
                    key={key}
                    onClick={() => requestSort(key as keyof Warehouse)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {sortConfig.key === key && (sortConfig.direction === "ascending" ? " ↑" : " ↓")}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWarehouses.length > 0 ? (
                filteredWarehouses.map((wh) => (
                  <tr key={wh.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{wh.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{wh.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{wh.totalstock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleOpenWarehouse(wh.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleRemoveWarehouse(wh.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No warehouses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default Warehouses;