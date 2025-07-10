'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthContextType } from '@/types'
import { authApi } from '@/lib/api'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Verificar se há token salvo no localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user_data')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      
      // Verificar se o token ainda é válido
      authApi.verifyToken()
        .then((response) => {
          if (response.data.valid) {
            setUser(response.data.user)
          } else {
            logout()
          }
        })
        .catch(() => {
          logout()
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authApi.login({ email, password })
      const { user: userData, token: userToken } = response.data

      setUser(userData)
      setToken(userToken)
      
      localStorage.setItem('auth_token', userToken)
      localStorage.setItem('user_data', JSON.stringify(userData))
    } catch (error: unknown) {
      const message = error instanceof Error && 'response' in error && 
                     typeof error.response === 'object' && error.response !== null &&
                     'data' in error.response && 
                     typeof error.response.data === 'object' && error.response.data !== null &&
                     'error' in error.response.data
                     ? String(error.response.data.error) 
                     : 'Erro ao fazer login'
      throw new Error(message)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const response = await authApi.register({ name, email, password })
      const { user: userData, token: userToken } = response.data

      setUser(userData)
      setToken(userToken)
      
      localStorage.setItem('auth_token', userToken)
      localStorage.setItem('user_data', JSON.stringify(userData))
    } catch (error: unknown) {
      const message = error instanceof Error && 'response' in error && 
                     typeof error.response === 'object' && error.response !== null &&
                     'data' in error.response && 
                     typeof error.response.data === 'object' && error.response.data !== null &&
                     'error' in error.response.data
                     ? String(error.response.data.error) 
                     : 'Erro ao criar conta'
      throw new Error(message)
    }
  }

  const logout = (): void => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

