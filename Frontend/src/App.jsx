import { useMemo, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CreatePost from './pages/CreatePost'
import Feed from './pages/Feed'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'

const App = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('audiostream_user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const handleAuthSuccess = (loggedInUser) => {
    setUser(loggedInUser)
    localStorage.setItem('audiostream_user', JSON.stringify(loggedInUser))
  }

  const handleLogoutLocal = () => {
    setUser(null)
    localStorage.removeItem('audiostream_user')
  }

  const userRole = useMemo(() => user?.role || 'guest', [user])

  return (
    <Router>
      <Navbar user={user} onLogoutLocal={handleLogoutLocal} />
      <Routes>
        <Route path="/" element={<Login onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/register" element={<Register onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/library" element={<Feed user={user} />} />
        <Route path="/artist" element={<CreatePost user={user} userRole={userRole} />} />
      </Routes>
    </Router>
  )
}

export default App