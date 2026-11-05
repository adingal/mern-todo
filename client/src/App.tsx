import { Routes, Route, useNavigate } from 'react-router'
import Login from './components/Login'
import Todos from './components/Todos'
import ProtectedRoute from './routes/ProtectedRoute'
import './App.css'

function LoginPage() {
  const navigate = useNavigate()
  return <Login onSuccess={() => navigate('/todos')} />
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path='/todos' element={<Todos />} />
      </Route>
    </Routes>
  )
}

export default App
