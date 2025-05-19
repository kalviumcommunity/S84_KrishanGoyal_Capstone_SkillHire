import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import LandingPage from './Pages/LandingPage'
import SignupMultiStep from './Pages/SignupMultiStep'
import Login from './Pages/Login'
import ProDashboard from './Pages/ProDashboard'
import GoDashboard from './Pages/GoDashboard'
import Client from './Pages/Client'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element = {<LandingPage/>}/>
        <Route path='/home' element = {<Home/>}/>
        <Route path='/signup' element = {<SignupMultiStep/>}/>
        <Route path='/login' element = {<Login/>}/>
        <Route path='/pro' element = {<ProDashboard/>}/>
        <Route path='/go' element = {<GoDashboard/>}/>
        <Route path='/client' element = {<Client/>}/>
      </Routes>
    </>
  )
}

export default App
