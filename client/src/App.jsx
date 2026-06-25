import { useState, useEffect } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Hero_section from './pages/Hero_section';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import AdminProvider from './context/authContext';
import { skillsAPI, projectsAPI, portfolioAPI, analyticsAPI } from './utils/api';
import { ImSpinner9 } from "react-icons/im";


function App() {
  const [portfolioData, setPortfolioData] = useState(null)
  const [skillsData, setSkillsData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const [details, skills, projects, analytics] = await Promise.all([
          portfolioAPI.get(),
          skillsAPI.getAll(),
          projectsAPI.getAll(),
          analyticsAPI.getPublicStats()
        ]);

        setPortfolioData(details);
        setSkillsData(skills);
        setProjectsData(projects);
        setAnalyticsData(analytics);

      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center">
        <ImSpinner9 size={30} className="animate-spin text-purple-500" />
        <h1 className="text-2xl text-white font-bold mt-2">Loading Portfolio Resources...</h1>
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home
        portfolioData={portfolioData}
        skillsData={skillsData}
        projectsData={projectsData}
        setPortfolioData={setPortfolioData}
        setSkillsData={setSkillsData}
        setProjectsData={setProjectsData}
        analyticsData={analyticsData}
        setAnalyticsData={setAnalyticsData}
      />,
    },
    {
      path: "/admin",
      element: <AdminDashboard />,
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    }

  ])

  return (
    <>
      <AdminProvider>
        <RouterProvider router={router} />
      </AdminProvider>
    </>
  )
}

export default App
