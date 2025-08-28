import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx';
import { ThemeProvider } from './components/overviewComponents/ThemeProvider.jsx';
import Goals from './pages/Goals.jsx';
import OverviewPage from './pages/OverviewPage.jsx';
import TrackGoals from './pages/TrackGoals.jsx';
import Communities from './pages/Communities.jsx';
import { ToastContainer } from 'react-toastify';
import Settings from './pages/Settings.jsx';
import AvaChatbot from './pages/AvaChatbot.jsx';
import EmailVerification from './pages/EmailVerification.jsx';
import Onboarding from './pages/Onboarding.jsx';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/verify-email', element: <EmailVerification /> },
  { path: '/onboarding', element: <Onboarding /> },

  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      { path: '', element: <OverviewPage /> },
      { path: 'goals', element: <Goals /> },
      { path: 'analytics', element: <TrackGoals /> },
      { path: 'communities', element: <Communities /> },
      { path: 'settings', element: <Settings /> },
      { path: 'Ava-assistant', element: <AvaChatbot /> },

    ],
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Provider store={store}> */}
    <ThemeProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </ThemeProvider>
    {/* </Provider> */}
  </StrictMode>,
)

