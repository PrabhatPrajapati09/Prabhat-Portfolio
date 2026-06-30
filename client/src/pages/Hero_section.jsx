import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import profilePhoto from '../assets/profile.jpeg';
import reactIcon from '../assets/react.svg';
import nodeIcon from '../assets/node.svg';
import mongoIcon from '../assets/mongo.svg';
import expressIcon from '../assets/express.svg';
import { analyticsAPI } from '../utils/api';

const COLORS = [
  '#8b5cf6', '#ec4899', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#06b6d4', '#3b82f6', '#6366f1', '#d946ef'
];

const TITLES = [
  "MERN Stack Developer",
  "Full Stack Developer",
  "Full Stack AI Developer"
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 300, damping: 24 } 
  },
};

const iconFloatVariants = (duration, delay = 0) => ({
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    y: [0, -12, 0],
    transition: {
      opacity: { duration: 0.5, delay },
      scale: { type: 'spring', stiffness: 260, damping: 20, delay },
      y: {
        repeat: Infinity,
        duration: duration,
        ease: 'easeInOut',
        delay: delay + 0.5,
      },
    },
  },
});

const Hero_section = ({ data, setPortfolioData }) => {
  const [blobColor, setBlobColor] = useState(COLORS[0]);
  
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBlobColor((prevColor) => {
        let newColor;
        do {
          newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        } while (newColor === prevColor);
        return newColor;
      });
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const currentTitle = TITLES[titleIndex];
    let typingTimer;

    if (isDeleting) {
      typingTimer = setTimeout(() => {
        setDisplayedTitle(currentTitle.substring(0, displayedTitle.length - 1));
        
        if (displayedTitle.length === 0) {
          setIsDeleting(false);
          setTitleIndex((prevIndex) => (prevIndex + 1) % TITLES.length);
        }
      }, 50); 
    } else {
      
      typingTimer = setTimeout(() => {
        setDisplayedTitle(currentTitle.substring(0, displayedTitle.length + 1));
        
        
        if (displayedTitle.length === currentTitle.length) {
          typingTimer = setTimeout(() => setIsDeleting(true), 2000);
        }
      }, 100); 
    }

    return () => clearTimeout(typingTimer);
  }, [displayedTitle, isDeleting, titleIndex]);

  const updateContactMails = async () => {
    try {
      await analyticsAPI.updateStat('contactMails');
    } catch (error) {
      console.log("Failed to update contact mails counts", error.message);
    }
  };

  const updateResumeDownloads = async () => {
    try {
      await analyticsAPI.updateStat('resumeDownloads');
    } catch (error) {
      console.log("Failed to update resume downloads counts", error.message);
    }
  };

  return (
    <div className='min-h-screen flex flex-col-reverse md:flex-row items-center justify-center gap-12 md:gap-20 lg:gap-40 px-6 md:px-12 py-24 md:py-0 bg-background transition-colors duration-300'>
      
      <motion.div 
        className="info w-full md:w-1/2 flex flex-col gap-2 text-center md:text-left items-center md:items-start z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className='text-3xl sm:text-4xl md:text-5xl text-primary-text font-bold'>
          Hi, I'm
        </motion.h1>
        
        <motion.h1 variants={itemVariants} className='text-3xl sm:text-4xl md:text-5xl text-primary-text font-bold'>
          {data?.name}
        </motion.h1>
        
        <motion.h1 variants={itemVariants} className='text-active-button text-xl sm:text-2xl font-semibold min-h-[1.5em]'>
         <span className="text-primary-text">I am</span> {displayedTitle}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            className="inline-block text-active-button"
          >
            |
          </motion.span>
        </motion.h1>

        <motion.h2 variants={itemVariants} className='text-base sm:text-lg text-secondary-text max-w-2xl'>
          {data?.about}
        </motion.h2>
        
        <motion.div variants={itemVariants} className="links flex flex-wrap justify-center md:justify-start items-center gap-4 mt-4 w-full">
          
          <a href={data?.resumeUrl} download="Prabhat_Prajapati_Resume.pdf" onClick={updateResumeDownloads}>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="resume cursor-pointer text-primary-text bg-active-button hover:bg-base-button px-5 py-2.5 rounded-xl w-fit flex items-center gap-2 transition-colors duration-300"
            >
              Resume
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19.0001 13V14C19.0001 17.2998 19.0001 18.9497 17.9749 19.9749C16.9498 21 15.2999 21 12.0001 21H10.0001C6.70023 21 5.05031 21 4.02519 19.9749C3.00006 18.9497 3.00006 17.2998 3.00006 14V12C3.00006 8.70017 3.00006 7.05025 4.02519 6.02513C5.05031 5 6.70023 5 10.0001 5H11.0001"></path>
                  <path d="M14 3H18C19.4142 3 20.1213 3 20.5607 3.43934C21 3.87868 21 4.58579 21 6V10M20 4L11 13"></path>
                </svg>
              </span>
            </motion.div>
          </a>

          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=work.prabhat73@gmail.com&su=Excited%20to%20connect!" onClick={updateContactMails} target="_blank" rel="noopener noreferrer">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="contactme cursor-pointer text-primary-text border border-border hover:bg-card px-5 py-2.5 rounded-xl w-fit flex items-center gap-2 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                <path d="M2 6L8.91302 9.91697C11.4616 11.361 12.5384 11.361 15.087 9.91697L22 6"></path>
                <path d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"></path>
              </svg>
              Contact Me
            </motion.div>
          </a>
        </motion.div>
      </motion.div>

      <div className="relative flex justify-center items-center mt-10 md:mt-0">
        
        <motion.div custom={2.5} variants={iconFloatVariants(2.5, 0.4)} initial="hidden" animate="visible" className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-12 h-12 md:w-16 md:h-16 bg-background hover:bg-card rounded-full flex items-center justify-center shadow-lg border border-border z-20 transition-colors">
          <img src={reactIcon} alt="React" className="w-8 h-8 md:w-10 md:h-10" />
        </motion.div>

        <motion.div custom={3} variants={iconFloatVariants(3, 0.6)} initial="hidden" animate="visible" className="absolute top-4 -right-6 md:-right-10 w-10 h-10 md:w-14 md:h-14 bg-background hover:bg-card rounded-full flex items-center justify-center shadow-lg border border-border z-20 transition-colors">
          <img src={nodeIcon} alt="Node.js" className="w-6 h-6 md:w-8 md:h-8" />
        </motion.div>

        <motion.div custom={2.8} variants={iconFloatVariants(2.8, 0.8)} initial="hidden" animate="visible" className="absolute bottom-6 -left-6 md:bottom-8 md:-left-10 w-12 h-12 md:w-16 md:h-16 bg-background hover:bg-card rounded-full flex items-center justify-center shadow-lg border border-border z-20 transition-colors">
          <img src={mongoIcon} alt="MongoDB" className="w-8 h-8 md:w-10 md:h-10" />
        </motion.div>

        <motion.div custom={2.2} variants={iconFloatVariants(2.2, 1)} initial="hidden" animate="visible" className="absolute -bottom-4 right-0 md:-bottom-4 md:right-0 w-10 h-10 md:w-14 md:h-14 bg-background hover:bg-card rounded-full flex items-center justify-center shadow-lg border border-border z-20 transition-colors">
          <img src={expressIcon} alt="Express" className="w-6 h-6 md:w-8 md:h-8" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className='w-64 h-64 md:w-80 md:h-80 border-4 animate-blob flex items-center justify-center overflow-hidden z-10 bg-card'
          style={{
            borderColor: blobColor,
            transition: 'border-color 3s ease-in-out, box-shadow 3s ease-in-out',
            boxShadow: `0 0 40px ${blobColor}40`
          }}
        >
          <img 
            src={data?.primaryImage || profilePhoto} 
            alt={data?.name || "Profile"} 
            className="w-full h-full object-cover"
          />
        </motion.div>

      </div>

    </div>
  )
}

export default Hero_section;