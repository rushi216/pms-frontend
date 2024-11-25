import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useIsAuthenticated } from "@azure/msal-react"
import DashboardLayout from './layouts/DashboardLayout'
import Reviews from './pages/Reviews'
import AddReview from './pages/AddReview'
import EditReview from './pages/EditReview'
import Team from './pages/Team'
import Admin from './pages/Admin'
import { Login } from './components/Login'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './components/AuthProvider'

function AppRoutes() {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  // Only redirect if we're not already on the login page
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" /> : <Login />
      } />
      
      <Route path="/*" element={
        <ProtectedRoute>
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/reviews" replace />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/reviews/add" element={<AddReview />} />
              <Route path="/reviews/edit/:id" element={<EditReview />} />
              <Route path="/team" element={<Team />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </DashboardLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App
