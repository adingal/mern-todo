import { Routes, Route, useNavigate } from 'react-router'
import Login from './components/Login'
import './App.css'

function LoginPage() {
  const navigate = useNavigate()
  return <Login onSuccess={() => navigate('/todos')} />
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
    </Routes>
  )
}

export default App
