import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import Page from './pages'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Page />
      </BrowserRouter>
    </div>
  )
}

export default App
