import { useState, useEffect } from "react";
import { MagicMotion } from "react-magic-motion";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
  const navigate = useNavigate();
  return (
    <MagicMotion>
      <aside
        style={{
          backgroundColor: isCollapsed ? "rgb(0, 0, 0)" : "#1F2833",
          padding: "1rem",
          margin: 0,
          borderRadius: "0.65rem",
          width: isCollapsed ? "4rem" : "20rem",
          fontWeight: "bold",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          overflow: "hidden",
          height: "100vh", // Full height of the viewport
          transition: "background-color 0.3s",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Only show the title when the sidebar is expanded */}
          {!isCollapsed && (
            <h4 style={{ margin: 0, color: "#C5C6C7" }}>Navigation</h4>
          )}
          <button
            style={{
              cursor: "pointer",
              padding: 0,
              border: 0,
              background: "none",
              color: "white",
            }}
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

        {/* Wrap the list of links in a flex-grow container */}
        <div style={{ flexGrow: 1 }}>
          {!isCollapsed && (
            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                margin: 0,
                padding: 0,
              }}
            >
              <li>
                <Link
                  to="/warehouses"
                  style={{ color: "#C5C6C7", textDecoration: "none" }} // Use light text color
                >
                  Warehouses
                </Link>
              </li>
              <li>
                <Link
                  to="/addproduct"
                  style={{ color: "#C5C6C7", textDecoration: "none" }} // Use light text color
                >
                  Add Product
                </Link>
              </li>
              <li>
                <Link
                  to="/warehousesales"
                  style={{ color: "#C5C6C7", textDecoration: "none" }} // Use light text color
                >
                  Sell Product
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Place the Logout button at the bottom and hide it when collapsed */}
        <div style={{ paddingTop: "1rem", visibility: isCollapsed ? "hidden" : "visible" }}>
          <button
            className="sexy-logout-btn"
            onClick={()=>{
              localStorage.clear();
              navigate('/');
            }}
            style={{
              background:
                "linear-gradient(135deg, #ff416c, #ff4b2b)", // Sexy gradient background
              color: "#fff",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontWeight: "bold",
              border: "none",
              borderRadius: "1.5rem", // Rounded corners
              cursor: "pointer",
              transition: "opacity 0.3s, transform 0.3s, box-shadow 0.3s ease", // Smooth transition for visibility and hover effects
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)", // Subtle box shadow for depth
              width: "100%", // Full width when sidebar is expanded
              textAlign: "center",
              transform: isCollapsed ? "scale(0)" : "scale(1)", // Scale to 0 when collapsed
              opacity: isCollapsed ? 0 : 1, // Make the button transparent when collapsed
            }}
            
          >
            Logout
          </button>
        </div>
      </aside>
    </MagicMotion>
  );
}
