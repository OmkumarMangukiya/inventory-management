import axios from "axios";
import { useEffect, useState } from "react";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";

export const Warehouses = () => {
  interface Warehouse {
    id: string;
    name: string;
    location: string;
    totalstock: number;
  }

  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterText, setFilterText] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Warehouse; direction: "ascending" | "descending" }>({ key: "name", direction: "ascending" });

  const fetchData = async () => {
    try {
      const roles = localStorage.getItem("role");
      const response = await axios.get("http://localhost:8787/warehouses", {
        headers: {
          role: roles,
        },
      });
      setWarehouses(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching warehouse data:", error);
      setError("Failed to load warehouse data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const requestSort = (key: keyof Warehouse) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedWarehouses = [...warehouses].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredWarehouses = sortedWarehouses.filter(
    (wh) =>
      wh.name.toLowerCase().includes(filterText.toLowerCase()) ||
      wh.location.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleOpenWarehouse = (id: string) => {
    localStorage.setItem("warehouseId", id);
    navigate(`/warehouse`);
  };

  const handleRemoveWarehouse = async (id: string) => {
    try {
      
      localStorage.setItem("warehouseId", id);
      const warehouseId = localStorage.getItem("warehouseId");
      await axios.post(`http://localhost:8787/warehouses/delete`,{}, {
        headers: {
          'warehouseId' : warehouseId,
        },
      });
      setWarehouses(warehouses.filter((warehouse) => warehouse.id !== id));
    } catch (error) {
      console.error("Error removing warehouse:", error);
      setError("Failed to remove warehouse.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-gradient-to-r from-gray-950 to-black relative min-h-screen ">
      <div className="p-10"></div>
    <div className="container mx-auto  p-6 bg-gray-100 rounded-lg shadow-md ">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Warehouses</h1>

      <div className="mb-4">
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          placeholder="Search by warehouse name or location..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th
                onClick={() => requestSort("name")}
                className="p-4 text-left cursor-pointer hover:bg-gray-700 transition duration-200"
              >
                Warehouse Name{" "}
                {sortConfig.key === "name" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => requestSort("location")}
                className="p-4 text-left cursor-pointer hover:bg-gray-700 transition duration-200"
              >
                Location{" "}
                {sortConfig.key === "location" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => requestSort("totalstock")}
                className="p-4 text-left cursor-pointer hover:bg-gray-700 transition duration-200"
              >
                Total Stock{" "}
                {sortConfig.key === "totalstock" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredWarehouses.map((wh) => (
              <tr key={wh.id} className="hover:bg-gray-100 transition duration-200">
                <td className="px-2 py-1.5 border-t border-gray-300">{wh.name}</td>
                <td className="px-2 py-1.5 border-t border-gray-300">{wh.location}</td>
                <td className="px-2 py-1.5 border-t border-gray-300">{wh.totalstock}</td>
                <td className="px-2 py-1.5 border-t border-gray-300">
                  <button
                    onClick={() => handleOpenWarehouse(wh.id)}
                    className=" text-white bg-black px-3 py-1 rounded-lg border-2 border-black  transition duration-200 "
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleRemoveWarehouse(wh.id)}
                    className="ml-2 text-black px-3 py-1 rounded-lg border-2 border-black  transition duration-200"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 ml-[1250px]">
        <Button name="Add Warehouse" onClick={() => navigate("/addwarehouse")} />
      </div>
    </div>
    </div>
  );
};
