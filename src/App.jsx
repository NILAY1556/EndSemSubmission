import { useState } from 'react'
import GharPage  from './components/GharPage'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GharPage />
    </>
  )
}

export default App
