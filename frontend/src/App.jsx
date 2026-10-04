import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
// import useGetCurrentUser from './hooks/useGetCurrentUser'
import Dashboard from './pages/Dashboard'
import { useSelector } from 'react-redux'
import Generate from './pages/Generate'
import WebsiteEditor from './pages/WebsiteEditor'
import LiveSite from './pages/LiveSite'
import Pricing from './pages/Pricing'



const App = () => {
  // useGetCurrentUser()
  const {userData} = useSelector(state=>state.user)
  return (
    <BrowserRouter>   
       <Routes>
         <Route path='/' element={<Home/>}/>
         <Route path='/dashboard' element={userData?<Dashboard/>:<Home/>}/>
         <Route path='/generate' element={userData?<Generate/>:<Home/>}/>
         <Route path='/editor/:id' element={userData?<WebsiteEditor/>:<Home/>}/>
         <Route path='/site/:id' element={<LiveSite/>}/>
         <Route path='/pricing' element={<Pricing/>}/>
       </Routes>
    </BrowserRouter>
  )
}

export default App
