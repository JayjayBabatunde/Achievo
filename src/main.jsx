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

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  {
    path: '/dashboard',
    element: <Dashboard />,
    children: [
      { path: '', element: <OverviewPage /> },
      { path: 'goals', element: <Goals /> },
      { path: 'track-goals', element: <TrackGoals /> },
      { path: 'communities', element: <Communities /> },

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

