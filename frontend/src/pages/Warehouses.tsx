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
  const [sortConfig, setSortConfig] = useState<{ key: keyof Warehouse; direction: "ascending" | "descending" }>({
    key: "name",
    direction: "ascending",
  });

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
      await axios.post(`http://localhost:8787/warehouses/delete`, {}, {
        headers: {
          'warehouseId': warehouseId,
        },
      });
      setWarehouses(warehouses.filter((warehouse) => warehouse.id !== id));
    } catch (error) {
      console.error("Error removing warehouse:", error);
      setError("Failed to remove warehouse.");
    }
  };

  if (loading) {
    return <div className="text-center text-[#C5C6C7]">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-[#0B0C10] min-h-screen">
      <div className="container mx-auto p-6 bg-[#1F2833] rounded-lg shadow-md mt-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#C5C6C7]">Warehouses</h1>

        <div className="mb-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-600 bg-[#0B0C10] text-[#C5C6C7] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#45A29E] transition duration-200"
            placeholder="Search by warehouse name or location..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-[#1F2833] shadow-md rounded-lg">
            <thead>
              <tr className="bg-[#0B0C10] text-[#C5C6C7]">
                <th
                  onClick={() => requestSort("name")}
                  className="p-4 text-left cursor-pointer hover:bg-[#45A29E] transition duration-200"
                >
                  Warehouse Name {sortConfig.key === "name" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => requestSort("location")}
                  className="p-4 text-left cursor-pointer hover:bg-[#45A29E] transition duration-200"
                >
                  Location {sortConfig.key === "location" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => requestSort("totalstock")}
                  className="p-4 text-left cursor-pointer hover:bg-[#45A29E] transition duration-200"
                >
                  Total Stock {sortConfig.key === "totalstock" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredWarehouses.map((wh) => (
                <tr key={wh.id} className="hover:bg-[#0B0C10] transition duration-200">
                  <td className="px-4 py-2 border-t border-gray-700 text-[#C5C6C7]">{wh.name}</td>
                  <td className="px-4 py-2 border-t border-gray-700 text-[#C5C6C7]">{wh.location}</td>
                  <td className="px-4 py-2 border-t border-gray-700 text-[#C5C6C7]">{wh.totalstock}</td>
                  <td className="px-4 py-2 border-t border-gray-700">
                    <button
                      onClick={() => handleOpenWarehouse(wh.id)}
                      className="text-[#C5C6C7] bg-[#45A29E] px-3 py-1 rounded-lg border-2 border-[#45A29E] transition duration-200 hover:bg-[#66FCF1]"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleRemoveWarehouse(wh.id)}
                      className="ml-2 text-black px-3 py-1 rounded-lg border-1 border-black transition duration-200 bg-rose-500 hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-right">
          <Button name="Add Warehouse" onClick={() => navigate("/addwarehouse")} />
        </div>
      </div>
    </div>
  );
};
