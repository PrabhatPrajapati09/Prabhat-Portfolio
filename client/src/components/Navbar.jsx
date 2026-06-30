import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/authContext';
import { Link, useLocation } from 'react-router-dom'; 
import { analyticsAPI } from '../utils/api'; 

const navContainerVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: 'spring', 
      stiffness: 120, 
      damping: 20,
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const navItemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0, overflow: 'hidden' },
  visible: { 
    opacity: 1, 
    height: 'auto',
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    height: 0,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

const Navbar = ({ theme, setTheme, data }) => {
  const { isAdmin, devMode, toggleDevMode, logout } = useAdmin();
  const location = useLocation(); 
  const [time, setTime] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const audioRef = useRef(null);
  const isDashboard = location.pathname === '/admin';

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("isPlaying", isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.log("Audio play blocked by browser policies", err));
    }
    setIsPlaying(!isPlaying);
  };

  const updateResumeDownloads = async () => {
    try {
      await analyticsAPI.updateStat('resumeDownloads');
    } catch (error) {
      console.log("Failed to update resume downloads counts", error.message);
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={navContainerVariants}
      className="w-full border-b-2 border-border bg-background/70 backdrop-blur-md fixed top-0 left-0 z-50 transition-colors duration-300"
    >
      <audio ref={audioRef} src={data?.music} loop={true} />

      <div className="w-full h-16 flex items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        
        <div className="text-primary-text flex items-center gap-4 sm:gap-6">
          <motion.div variants={navItemVariants}>
            <Link to="/" className="logo text-3xl font-['Caveat'] font-bold tracking-wider select-none block">
              {"<PrabhatP/>"}
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <motion.a 
              variants={navItemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={data?.resumeUrl} 
              className="resume flex items-center gap-1 cursor-pointer group hover:text-active-button transition-colors duration-300" 
              onClick={updateResumeDownloads}
            >
              Resume
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19.0001 13V14C19.0001 17.2998 19.0001 18.9497 17.9749 19.9749C16.9498 21 15.2999 21 12.0001 21H10.0001C6.70023 21 5.05031 21 4.02519 19.9749C3.00006 18.9497 3.00006 17.2998 3.00006 14V12C3.00006 8.70017 3.00006 7.05025 4.02519 6.02513C5.05031 5 6.70023 5 10.0001 5H11.0001"></path>
                <path d="M14 3H18C19.4142 3 20.1213 3 20.5607 3.43934C21 3.87868 21 4.58579 21 6V10M20 4L11 13"></path>
              </svg>
            </motion.a>

            <motion.a 
              variants={navItemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://www.linkedin.com/in/prabhat-prajapati-266423323" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="linkedin flex items-center gap-1 cursor-pointer group hover:text-active-button transition-colors duration-300"
            >
              Linkedin
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19.0001 13V14C19.0001 17.2998 19.0001 18.9497 17.9749 19.9749C16.9498 21 15.2999 21 12.0001 21H10.0001C6.70023 21 5.05031 21 4.02519 19.9749C3.00006 18.9497 3.00006 17.2998 3.00006 14V12C3.00006 8.70017 3.00006 7.05025 4.02519 6.02513C5.05031 5 6.70023 5 10.0001 5H11.0001"></path>
                <path d="M14 3H18C19.4142 3 20.1213 3 20.5607 3.43934C21 3.87868 21 4.58579 21 6V10M20 4L11 13"></path>
              </svg>
            </motion.a>
          </div>
        </div>

        <div className="hidden md:flex items-center">
          <ul className="flex items-center gap-4 lg:gap-6">
            
            <motion.li variants={navItemVariants} className="flex items-center gap-2 font-mono text-xs font-medium text-primary-text bg-card rounded-3xl px-3.5 py-1.5 border border-border/40 select-none shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              {time.toLocaleTimeString()}
            </motion.li>

            <motion.li 
              variants={navItemVariants}
              whileHover={{ scale: 1.1, rotate: isPlaying ? 15 : 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMusic} 
              className={`cursor-pointer transition-colors duration-300 hover:text-active-button ${isPlaying ? 'text-active-button drop-shadow' : 'text-primary-text'}`} 
              aria-label="Toggle Background Ambient Stream"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="6.5" cy="18.5" r="3.5"></circle>
                <circle cx="18" cy="16" r="3"></circle>
                <path d="M10 18.5L10 7C10 6.07655 10 5.61483 10.2635 5.32794C10.5269 5.04106 11.0175 4.9992 11.9986 4.91549C16.022 4.57222 18.909 3.26005 20.3553 2.40978C20.6508 2.236 20.7986 2.14912 20.8993 2.20672C21 2.26432 21 2.4315 21 2.76587V16" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M10 10C15.8667 10 19.7778 7.66667 21 7" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </motion.li>

            <motion.li 
              variants={navItemVariants}
              whileHover={{ scale: 1.1, rotate: -30 }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer text-primary-text hover:text-active-button transition-colors" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="5"></circle>
                  <path d="M12 2V3.5M12 20.5V22M19.0708 19.0713L18.0101 18.0106M5.98926 5.98926L4.9286 4.9286M22 12H20.5M3.5 12H2M19.0713 4.92871L18.0106 5.98937M5.98975 18.0107L4.92909 19.0714" strokeLinecap="round"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 14.0784C20.3003 14.7189 18.9301 15.0821 17.4751 15.0821C12.7491 15.0821 8.91792 11.2509 8.91792 6.52485C8.91792 5.06986 9.28105 3.69968 9.92163 2.5C5.66765 3.49698 2.5 7.31513 2.5 11.8731C2.5 17.1899 6.8101 21.5 12.1269 21.5C16.6849 21.5 20.503 18.3324 21.5 14.0784Z"></path>
                </svg>
              )}
            </motion.li>

            <motion.li 
              variants={navItemVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="cursor-pointer text-primary-text hover:text-active-button transition-colors"
            >
              <a href="https://github.com/PrabhatPrajapati09" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="24" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6.51734 17.1132C6.91177 17.6905 8.10883 18.9228 9.74168 19.2333M9.86428 22C8.83582 21.8306 2 19.6057 2 12.0926C2 5.06329 8.0019 2 12.0008 2C15.9996 2 22 5.06329 22 12.0926C22 19.6057 15.1642 21.8306 14.1357 22C14.1357 22 13.9267 18.5826 14.0487 17.9969C14.1706 17.4113 13.7552 16.4688 13.7552 16.4688C14.7262 16.1055 16.2043 15.5847 16.7001 14.1874C17.0848 13.1032 17.3268 11.5288 16.2508 10.0489C16.2508 10.0489 16.5318 7.65809 15.9996 7.56548C15.4675 7.47287 13.8998 8.51192 13.8998 8.51192C13.4432 8.38248 12.4243 8.13476 12.0018 8.17939C11.5792 8.13476 10.5568 8.38248 10.1002 8.51192C10.1002 8.51192 8.53249 7.47287 8.00036 7.56548C7.46823 7.65809 7.74917 10.0489 7.74917 10.0489C6.67316 11.5288 6.91516 13.1032 7.2999 14.1874C7.79575 15.5847 9.27384 16.1055 10.2448 16.4688C10.2448 16.4688 9.82944 17.4113 9.95135 17.9969C10.0733 18.5826 9.86428 22 9.86428 22Z"></path>
                </svg>
              </a>
            </motion.li>

            {isAdmin && (
              <>
                <motion.div variants={navItemVariants} className="w-[1.5px] h-6 bg-border rounded-full mx-1"></motion.div>

                {!isDashboard ? (
                  <>
                    <motion.li variants={navItemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="cursor-pointer bg-card border border-border/60 hover:border-active-button px-3 py-1.5 rounded-xl transition-all">
                      <button onClick={toggleDevMode} className={`text-xs font-semibold tracking-wide ${devMode ? "text-active-button" : "text-secondary-text"}`}>
                        {devMode ? "Dev Mode: ON" : "Dev Mode: OFF"}
                      </button>
                    </motion.li>
                    <motion.li variants={navItemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="cursor-pointer bg-card border border-border/60 hover:text-active-button px-4 py-1.5 rounded-xl transition-all text-xs font-semibold text-primary-text">
                      <Link to="/admin">Dashboard</Link>
                    </motion.li>
                  </>
                ) : (
                  <motion.li variants={navItemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="cursor-pointer bg-active-button hover:bg-active-button/90 text-white px-4 py-1.5 rounded-xl transition-all text-xs font-semibold shadow-sm">
                    <Link to="/">View Live Site</Link>
                  </motion.li>
                )}

                <motion.li variants={navItemVariants} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="cursor-pointer text-secondary-text hover:text-red-500 transition-colors">
                  <Link to="/" onClick={logout} aria-label="Terminate Session Overview">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 18C18 18.4644 18 18.6965 17.978 18.8918C17.7952 20.5145 16.5145 21.7952 14.8919 21.978C14.6965 22 14.4644 22 14 22H11C7.70017 22 6.05025 22 5.02513 20.9749C4 19.9498 4 18.2998 4 15L4.00001 8.99998C4.00001 5.70016 4.00003 4.05024 5.02514 3.02512C6.05027 2 7.70018 2 11 2H14C14.4644 2 14.6965 2 14.8919 2.02201C16.5145 2.20483 17.7952 3.48547 17.978 5.10816C18 5.30347 18 5.53565 18 6"></path>
                      <path d="M8.07612 11.1183C8 11.3021 8 11.535 8 12.001C8 12.4669 8 12.6999 8.07612 12.8837C8.17761 13.1287 8.37229 13.3234 8.61732 13.4249C8.80109 13.501 9.03406 13.501 9.5 13.501H14.5C14.5002 15.2503 14.511 16.1299 15.0623 16.3858C15.0829 16.3954 15.1037 16.4042 15.1249 16.4124C15.7045 16.6353 16.3999 16.0139 17.7907 14.7711C19.2576 13.4602 19.9912 12.7851 20 11.957C19.9912 11.1289 19.2576 10.4538 17.7907 9.14301C16.3999 7.90018 15.7045 7.27876 15.1249 7.50171C15.1037 7.50985 15.0829 7.51869 15.0623 7.52822C14.5018 7.78844 14.5 8.69318 14.5 10.501H9.5C9.03406 10.501 8.80109 10.501 8.61732 10.5771C8.37229 10.6786 8.17761 10.8733 8.07612 11.1183Z"></path>
                    </svg>
                  </Link>
                </motion.li>
              </>
            )}

          </ul>
        </div>

        <div className="flex md:hidden items-center gap-4 text-primary-text">
          <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            aria-label="Toggle Navigation Stack Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
            </svg>
          </motion.button>
        </div>

      </div>

      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full bg-background border-t border-border flex flex-col md:hidden p-5 gap-4 shadow-xl font-medium text-center text-primary-text"
          >
            <div className="flex justify-center gap-6 text-sm border-b border-border/40 pb-3">
              <div onClick={() => { updateResumeDownloads(); setIsMobileMenuOpen(false); }} className="cursor-pointer hover:text-active-button transition-colors">Resume</div>
              <a href="https://www.linkedin.com/in/prabhat-prajapati-266423323" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-active-button transition-colors">LinkedIn</a>
              <a href="https://github.com/PrabhatPrajapati09" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-active-button transition-colors">GitHub</a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 py-2">
              <span className="text-xs font-mono bg-card px-3 py-1.5 rounded-full border border-border/50">{time.toLocaleTimeString()}</span>
              
              <button onClick={toggleMusic} className={`p-1.5 rounded-xl border transition-colors ${isPlaying ? 'text-active-button border-active-button/40' : 'text-secondary-text border-border/60'}`}>
                Music: {isPlaying ? "ON" : "OFF"}
              </button>
              
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-1.5 rounded-xl border border-border/60 text-secondary-text transition-colors">
                Mode: {theme === 'dark' ? "Dark" : "Light"}
              </button>
            </div>

            {isAdmin && (
              <div className="flex flex-col gap-3 pt-3 border-t border-border/40 text-xs">
                {!isDashboard ? (
                  <>
                    <button onClick={() => { toggleDevMode(); setIsMobileMenuOpen(false); }} className={`py-2 rounded-lg bg-card border transition-colors ${devMode ? "text-active-button border-active-button/40" : "text-secondary-text border-border"}`}>
                      {devMode ? "Dev Mode: Active" : "Dev Mode: Offline"}
                    </button>
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="py-2 bg-card border border-border rounded-lg text-primary-text font-semibold transition-colors">
                      Dashboard Overview
                    </Link>
                  </>
                ) : (
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 bg-active-button text-white rounded-lg font-semibold shadow-sm transition-colors">
                    Exit to Live Site
                  </Link>
                )}
                <Link to="/" onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="py-2 border border-red-500/30 text-red-500 rounded-lg bg-red-500/5 transition-colors">
                  Logout Session
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;