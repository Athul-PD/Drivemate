import './App.css'
import { createBrowserRouter,createRoutesFromElements,Route,RouterProvider, Outlet } from 'react-router-dom'
import Signup from './pages/auth/Signup'
import Signin from './pages/auth/Signin'
import AdminUser from './pages/home/AdminUser'
import Dashboard from './pages/dashboard/Dashboard'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AuthProvider><Outlet /></AuthProvider>}>
        <Route path='/' element={<Signup/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route 
          path='/adminuser' 
          element={
            <ProtectedRoute requiredWorkspace={false}>
              <AdminUser/>
            </ProtectedRoute>
          }
        />
        <Route 
          path='/dashboard' 
          element={
            <ProtectedRoute requiredWorkspace={true}>
              <Dashboard/>
            </ProtectedRoute>
          }
        />
      </Route>
    )
  )

  return (
    <RouterProvider router={router} />
  )
}

export default App
