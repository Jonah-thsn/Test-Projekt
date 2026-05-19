import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const buildTimestamp = new Date().toISOString()

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      <div style={{ padding: '2rem', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <h1>Paperclip Dev — React build</h1>
        <button onClick={() => setCount((count) => count + 1)}>
          Click me
        </button>
        <p>Counter: {count}</p>
        <p><small>Build timestamp: {buildTimestamp}</small></p>
        <footer style={{ marginTop: '2rem', color: '#666' }}>
          Deployed via Paperclip agent
        </footer>
      </div>
    </div>
  )
}

export default App
