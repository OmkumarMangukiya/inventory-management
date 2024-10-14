import './App.css'
import {Signin} from './pages/Signin'
import  {Signup}  from './pages/Signup'
import {Warehouses} from './pages/Warehouses'
import { AddWarehouse } from './pages/AddWarehouse'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Warehouse  from './pages/Warehouse'
function App() {

  return (
    <>
            <BrowserRouter>
            <Routes >
            <Route path='/' Component={Signin} ></Route>
            <Route path='/signup' Component={Signup} ></Route> 
            <Route path='/warehouses' Component={Warehouses} ></Route>
            <Route path='/addwarehouse' Component={AddWarehouse}/>
            <Route path='/warehouse' Component={Warehouse} />
            </Routes>
            </BrowserRouter>
    </>
  )
}

export default App
