// import { useState } from 'react'
import './App.css'
import Nav from './components/shared/Nav'
import Routes from "./Routes"
import { useEffect } from 'react'



function App() {
  
  useEffect(() => {
    fetch("http://localhost:8000")
  }, [])
  return (
    <>
      <Nav />
      <Routes />
      <div className='App'>
      </div>
    </>
  )
}


export default App