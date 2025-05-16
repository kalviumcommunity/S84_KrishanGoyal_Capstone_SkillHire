import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import LandingPage from './Pages/LandingPage'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element = {<LandingPage/>}/>
        <Route path='/home' element = {<Home/>}/>
      </Routes>
    </>
  )
}

export default App
