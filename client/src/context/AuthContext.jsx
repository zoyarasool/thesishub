import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { accessToken, ...userData } = res.data.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData)
    const { accessToken, ...userData } = res.data.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData }
    localStorage.setItem('user', JSON.stringify(merged))
    setUser(merged)
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)