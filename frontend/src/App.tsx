import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home'
import LoginPage from './pages/login/Login'
import RegisterPage from './pages/register/Register'
import DashboardPage from './pages/dashboard/Dashboard'
import HousesPage from './pages/houses/Houses'
import GamesPage from './pages/games/Games'
import ProfilePage from './pages/profile/Profile'
import Layout from './components/layout/Layout'
import PrivateRoute from './components/routing/PrivateRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/houses"
        element={
          <PrivateRoute>
            <Layout>
              <HousesPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/games"
        element={
          <PrivateRoute>
            <Layout>
              <GamesPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  )
}
