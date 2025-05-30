import { Navigate, Route, Routes } from 'react-router-dom';
import FloatingShape from './components/FloatingShape';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import LoadingSpinner from './components/LoadingSpinner';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

//Protect routes for authenticated users
const ProtectedRoute = ({children}) => {
  const {isAuthenticated, user } = useAuthStore();
  if(!isAuthenticated ) {
    return <Navigate to="/login" replace />;
  }
  if(user && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  return children;
}
//Redirect to home if user is already authenticated
const RedirectAuthenticatedUsers = ({children}) => {
  const {isAuthenticated, user } = useAuthStore();
  if(isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }
  return children;
}
function App() {

  const {isCheckingAuth, checkAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth) {
    return <LoadingSpinner/>
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 
      flex items-center justify-center relative overflow-hidden">  
        <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
        <FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
        <FloatingShape color='bg-green-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />

        <Routes>
          <Route path='/' 
          element={
            <ProtectedRoute>
              <DashboardPage/>
            </ProtectedRoute>
          }/>
          <Route path='/login' 
          element={
            <RedirectAuthenticatedUsers>
                <LoginPage />
            </RedirectAuthenticatedUsers>
          } 
          />
          <Route path='/signup' 
          element={
            <RedirectAuthenticatedUsers>
                <SignupPage />
            </RedirectAuthenticatedUsers>
            } 
          />
          <Route path='/verify-email' element={<EmailVerificationPage />} />
          <Route path='/forgot-password' element={<RedirectAuthenticatedUsers>
            <ForgotPasswordPage/>
          </RedirectAuthenticatedUsers>}/>
          <Route
            path='/reset-password/:token'
            element={
              <RedirectAuthenticatedUsers>
                <ResetPasswordPage/>
              </RedirectAuthenticatedUsers>
            }
          />

          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster/>
      </div>
    </>
  )
}

export default App
