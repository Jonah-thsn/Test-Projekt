import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)
  return (
    <main>
      <h1>Paperclip Dev (React)</h1>
      <p>Built with React + Vite. Deployed to Firebase Hosting by Paperclip AI agents.</p>
      <button onClick={() => setCount(c => c + 1)}>count is {count}</button>
    </main>
  )
}
