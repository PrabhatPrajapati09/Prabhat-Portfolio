import React, { useState, useEffect } from 'react'
import Hero_section from './Hero_section'
import Navbar from '../components/Navbar'
import Aboutme from './Aboutme'
import Skills from './Skills'
import Projects from './Projects'
import Contact from './Contact'
import GithubStats from './GithubStats'
import Footer from '../components/Footer'
import CursorGlow from '../components/CursorGlow'

const Home = ({
  portfolioData, setPortfolioData,
  skillsData, setSkillsData,
  projectsData, setProjectsData,
  analyticsData, setAnalyticsData
}) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("app-theme");
    return savedTheme ? savedTheme : "dark"
  });

  useEffect(() => {
    localStorage.setItem("app-theme", theme);
  }, [theme])


  return (
    <div className={theme}>
      <CursorGlow theme={theme} />
      <Navbar theme={theme} setTheme={setTheme} data={portfolioData} />
      <Hero_section data={portfolioData} setPortfolioData={setPortfolioData} />
      <Aboutme data={portfolioData} setPortfolioData={setPortfolioData} />
      <Skills skillsData={skillsData} updateSkills={setSkillsData} />
      <Projects projects={projectsData} updateProjects={setProjectsData} />
      <Contact data={portfolioData} setPortfolioData={setPortfolioData} />
      <GithubStats analyticsData={analyticsData} setAnalyticsData={setAnalyticsData} />
      <Footer data={portfolioData} setPortfolioData={setPortfolioData} />
    </div>
  )
}

export default Home
