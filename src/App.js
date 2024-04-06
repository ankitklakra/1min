import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from './Components/Login'
import { Register } from './Components/Register'
import { AdminPanel } from './Components/AdminPanel'
import { Notfound } from './Components/Notfound';
import { ViewPanel } from './Components/ViewPanel';
import { NewsPanel } from './Components/NewsPanel';


function App() {
  return (
    <BrowserRouter>
     
      <Routes>
        <Route path='*' element={<Notfound />} />
        <Route path='/' element={<AdminPanel />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/adminpanel' element={<AdminPanel />} />
        <Route path='/viewpanel' element={<ViewPanel />} />
        <Route path='/news' element={<NewsPanel />} />
      </Routes>
    
    </BrowserRouter>
  )
}

export default App

