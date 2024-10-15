import './App.css';
import { Signin } from './pages/Signin';
import { Signup } from './pages/Signup';
import { Warehouses } from './pages/Warehouses';
import { AddWarehouse } from './pages/AddWarehouse';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Warehouse from './pages/Warehouse';
import AddProduct from './Components/AddProduct';
import WarehouseSales from './pages/WarehouseSales';
import Sidebar from './Components/sidebar';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <div style={{ flexGrow: 1, backgroundColor: 'black', margin: 0 }}>
          <Routes>
            <Route path='/' element={<Signin />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/warehouses' element={<Warehouses />} />
            <Route path='/addwarehouse' element={<AddWarehouse />} />
            <Route path='/warehouse' element={<Warehouse />} />
            <Route path='/addproduct' element={<AddProduct />} />
            <Route path='/warehousesales' element={<WarehouseSales />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
