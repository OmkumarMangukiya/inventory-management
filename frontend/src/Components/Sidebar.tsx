import { useState } from "react";
import { MagicMotion } from "react-magic-motion";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <MagicMotion>
      <aside
        style={{
          backgroundColor: "black",
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
          {!isCollapsed && <h4 style={{ margin: 0, color: "white" }}>Navigation</h4>}
          <button
            style={{ cursor: "pointer", padding: 0, border: 0, background: "none", color: "white" }} // Ensure icon color is white
            onClick={() => setIsCollapsed(!isCollapsed)}
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

        {/* Show the list of links only when the sidebar is not collapsed */}
        {!isCollapsed && (
          <ul style={{ display: "flex", flexDirection: "column", gap: "1rem", margin: 0, padding: 0 }}>
            <li>
              <Link to="/warehouses" style={{ color: "white", textDecoration: "none" }}>Warehouses</Link>
            </li>
            <li>
              <Link to="/addproduct" style={{ color: "white", textDecoration: "none" }}>Add Product</Link>
            </li>
            <li>
              <Link to="/warehousesales" style={{ color: "white", textDecoration: "none" }}>Sell Product</Link>
            </li>
          </ul>
        )}
      </aside>
    </MagicMotion>
  );
}
