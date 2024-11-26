import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedState = localStorage.getItem("sidebarCollapsed");
    if (storedState) {
      setIsCollapsed(JSON.parse(storedState));
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
      return newState;
    });
  };

  useEffect(() => {
    setIsCollapsed(true);
  }, [location]);

  const linkClass = "text-gray-300 no-underline hover:text-white transition-colors duration-200";

  return (
    <aside
      className={`transition-all duration-300 ${
        isCollapsed 
          ? "bg-[#1F2937] w-14 h-screen" 
          : "bg-gray-800 w-80 h-screen"
      } p-4 m-0 font-bold flex flex-col gap-4 overflow-hidden fixed left-0 top-0 z-50`}
    >
      <div className="flex gap-2 items-center justify-between">
        {!isCollapsed && <h4 className="m-0 text-gray-200">Navigation</h4>}
        <button
          className="cursor-pointer p-0 border-0 bg-none text-white hover:text-gray-300 transition-colors duration-200"
          onClick={toggleSidebar}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 12.9999V10.9999H15.4853L12.2427 7.75724L13.6569 6.34303L19.3137 11.9999L13.6569 17.6567L12.2427 16.2425L15.4853 12.9999H1Z" />
              <path d="M20.2877 6V18H22.2877V6H20.2877Z" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.2877 11.0001V13.0001H7.80237L11.045 16.2428L9.63079 17.657L3.97394 12.0001L9.63079 6.34326L11.045 7.75748L7.80236 11.0001H22.2877Z" />
              <path d="M3 18V6H1V18H3Z" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex-grow">
        {!isCollapsed && (
          <ul className="flex flex-col gap-4 m-0 p-0 list-none">
            <li>
              <Link to="/warehouses" className={linkClass}>
                Warehouses
              </Link>
            </li>
            <li>
              <Link to="/addproduct" className={linkClass}>
                Add Product
              </Link>
            </li>
            <li>
              <Link to="/warehousesales" className={linkClass}>
                Sell Product
              </Link>
            </li>
            <li>
              <Link to="/sales/history" className={linkClass}>
                Sales History
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className={linkClass}>
                Dashboard
              </Link>
            </li>
          </ul>
        )}
      </div>

      {!isCollapsed && (
        <div className="pt-4">
          <button
            className="w-full bg-[#007BFF] text-white py-3 px-6 text-lg font-bold rounded-lg
                     cursor-pointer transition-all duration-200 shadow-lg hover:bg-[#0056b3]"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      )}
    </aside>
  );
} 