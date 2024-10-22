import { useState, useEffect } from "react";
import { MagicMotion } from "react-magic-motion";
import { Link, useNavigate ,useLocation} from "react-router-dom";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // Load the sidebar state from local storage on component mount
  useEffect(() => {
    const storedState = localStorage.getItem("sidebarCollapsed");
    if (storedState) {
      setIsCollapsed(JSON.parse(storedState));
    }
  }, []);

  // Save the sidebar state to local storage when it changes
  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebarCollapsed", JSON.stringify(newState)); // Store the new state in local storage
      return newState;
    });
  };
  useEffect(() => {
    setIsCollapsed(true);
  }, [location]);

  return (
    <MagicMotion>
      <aside
        className={`${
          isCollapsed ? "bg-[#1F2937] w-14 h-14 " : "bg-gray-800 w-80 h-screen"
        } p-4 m-0  font-bold flex flex-col gap-4 overflow-hidden transition-all duration-300`}
      >
        <div className="flex gap-2 items-center justify-between">
          {/* Only show the title when the sidebar is expanded */}
          {!isCollapsed && <h4 className="m-0 text-gray-200">Navigation</h4>}
          <button
            className="cursor-pointer p-0 border-0 bg-none text-white"
            onClick={toggleSidebar}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24" className="">
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

        {/* Wrap the list of links in a flex-grow container */}
        <div className="flex-grow">
          {!isCollapsed && (
            <ul className="flex flex-col gap-4 m-0 p-0">
              <li>
                <Link to="/warehouses" className="text-gray-300 no-underline hover:text-white">
                  Warehouses
                </Link>
              </li>
              <li>
                <Link to="/addproduct" className="text-gray-300 no-underline hover:text-white">
                  Add Product
                </Link>
              </li>
              <li>
                <Link to="/warehousesales" className="text-gray-300 no-underline hover:text-white">
                  Sell Product
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Place the Logout button at the bottom and hide it when collapsed */}
        <div className={`pt-4 ${isCollapsed ? "hidden" : "block"}`}>
          <button
            className={`logout-btn bg-[#007BFF]  text-white py-3 px-6 text-lg font-bold rounded-full cursor-pointer transition-opacity duration-300 shadow-lg w-full text-center transform ${
              isCollapsed ? "scale-0 opacity-0" : "scale-100 opacity-100"
            }`}
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </aside>
    </MagicMotion>
  );
}