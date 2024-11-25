import './App.css';
import Signin  from './pages/Signin';
import Signup  from './pages/Signup';
import Warehouses from './pages/Warehouses';
import  AddWarehouse  from './pages/AddWarehouse';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Warehouse from './pages/Warehouse';
import AddProduct from './pages/AddProduct';
import WarehouseSales from './pages/WarehouseSales';
import Sidebar from './Components/Sidebar';
import SalesHistory from './pages/SalesHistory';
import SaleDetails from './pages/SaleDetails';
import Dashboard from './pages/Dashboard';

function MainApp() {
  const location = useLocation();

  // Check if the current route is sign-in or sign-up
  const hideSidebar = location.pathname === '/' || location.pathname === '/signup';

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {!hideSidebar && <Sidebar />}
      <div style={{ flexGrow: 1, backgroundColor: 'black', margin: 0 }}>
        <Routes>
          <Route path='/' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/warehouses' element={<Warehouses />} />
          <Route path='/addwarehouse' element={<AddWarehouse />} />
          <Route path='/warehouse' element={<Warehouse />} />
          <Route path='/addproduct' element={<AddProduct />} />
          <Route path='/warehousesales' element={<WarehouseSales />} />
          <Route path='/sales/history' element={<SalesHistory />} />
          <Route path='/sales/:id' element={<SaleDetails />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

export default App;
