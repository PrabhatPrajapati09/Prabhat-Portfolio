import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GitHubCalendar } from 'react-github-calendar';
import { FaHeart } from 'react-icons/fa';
import { analyticsAPI } from '../utils/api';

const GithubStats = ({ analyticsData, setAnalyticsData }) => {
    const [githubData, setGithubData] = useState(null);
    const [hasLiked, setHasLiked] = useState(false);
    
    const [theme, setTheme] = useState(
        () => localStorage.getItem("app-theme") || "dark"
    );

    const username = "PrabhatPrajapati09";

    useEffect(() => {
        const handleStorageChange = () => {
            setTheme(localStorage.getItem("app-theme") || "dark");
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    useEffect(() => {
        const fetchGithubData = async () => {
            try {
                const { data } = await axios.get(`https://api.github.com/users/${username}`);
                setGithubData(data);
            } catch (error) {
                console.error("Failed to query public GitHub profile data wrapper:", error);
            }
        };

        const fetchAnalyticsDataStatic = async () => {
            try {
                const response = await analyticsAPI.get(); 
                setAnalyticsData(response?.details || response);
            } catch (error) {
                console.log("Failed to fetch static analytics data snapshot:", error.message);
            }
        };

        fetchGithubData();
        fetchAnalyticsDataStatic();

        if (localStorage.getItem("portfolio_has_liked") === "true") {
            setHasLiked(true);
        }
    }, [setAnalyticsData]);

    const handleLike = async () => {
        if (hasLiked) return;

        try {
            const updatedAnalytics = await analyticsAPI.updateStat('portfolioLikes');
            
            setAnalyticsData(updatedAnalytics?.details || updatedAnalytics);
            setHasLiked(true);
            localStorage.setItem("portfolio_has_liked", "true");
        } catch (error) {
            console.log("Failed to save client appreciation context call:", error.message);
        }
    };

    if (!githubData) return null;

    const themeCalendarColors = {
        light: [
            "#ebedf0", 
            "#f3e8ff", 
            "#c084fc", 
            "#9333ea", 
            "#581c87", 
        ],
        dark: [
            "#161b22", 
            "#3b0764", 
            "#7e22ce", 
            "#a855f7", 
            "#d8b4fe", 
        ],
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center py-20 px-6 md:px-12 lg:px-24 bg-background transition-colors duration-300 border-b-2 border-border">
            <section className="py-20 px-4 sm:px-8 bg-background max-w-5xl mx-auto w-full flex flex-col gap-10 animate-fade-in-up transition-colors duration-300">

                <div className="text-center max-w-3xl mx-auto">
                    <div className="card bg-card text-primary-text px-4 py-2 w-fit rounded-xl flex items-center gap-2 shadow-sm border border-border mx-auto mb-4 text-xs font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                        </span>
                        Metrics & Overview
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary-text tracking-tight">
                        About This Portfolio
                    </h2>
                    <p className="text-secondary-text text-base md:text-lg mt-3 leading-relaxed">
                        This system showcases my dynamic projects, production tech stacks, open-source
                        contributions, and full-stack architecture history as a MERN Developer.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between relative group overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-glow">
                        <div className="absolute -left-12 -top-12 w-36 h-36 bg-blue-500/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

                        <div className="relative z-10">
                            <h3 className="text-secondary-text text-sm font-semibold uppercase tracking-wider">
                                Total Portfolio Traffic
                            </h3>
                            <p className="text-4xl md:text-5xl mt-3 font-bold text-primary-text font-mono">
                                {analyticsData?.pageViews || 0}
                            </p>
                        </div>
                        <p className="text-secondary-text text-xs mt-4 relative z-10">Dynamically compiled views running live data</p>
                    </div>

                    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between relative group overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-glow">
                        <div className="absolute -left-12 -top-12 w-36 h-36 bg-purple-500/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <h3 className="text-secondary-text text-sm font-semibold uppercase tracking-wider">
                                    Appreciation Count
                                </h3>
                                <p className="text-4xl md:text-5xl mt-3 font-bold text-primary-text font-mono">
                                    {analyticsData?.portfolioLikes || 0}
                                </p>
                            </div>

                            <button
                                onClick={handleLike}
                                disabled={hasLiked}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white tracking-wide transition-all duration-300 shadow-md ${hasLiked
                                        ? 'bg-border text-secondary-text cursor-default scale-100 shadow-none border border-transparent'
                                        : 'bg-active-button hover:bg-base-button hover:scale-105 active:scale-95'
                                    }`}
                            >
                                <FaHeart className={hasLiked ? "text-purple-400" : "animate-pulse text-white"} />
                                {hasLiked ? 'Appreciated!' : 'Leave a Like'}
                            </button>
                        </div>
                        <p className="text-secondary-text text-xs mt-4 relative z-10">Click the action button above to lock a portfolio upvote event</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <h3 className="text-xl md:text-2xl font-bold text-primary-text tracking-tight">
                        GitHub Open Source Contributions
                    </h3>

                    <div className="overflow-x-auto bg-card p-6 rounded-2xl border border-border shadow-sm flex justify-center w-full group relative">
                        <div className="absolute -left-12 -top-12 w-48 h-48 bg-active-button/5 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        <div className="w-full text-primary-text min-w-[700px] flex justify-center [&>div]:w-full">
                            <GitHubCalendar
                                key={theme}
                                username={username}
                                colorScheme={theme}
                                theme={themeCalendarColors}
                                fontSize={14}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4 w-full">
                    <StatCard title="Hireable Context" value="Open To Work" accentColor="bg-green-500/10" />
                    <StatCard title="Public Repositories" value={githubData.public_repos || 0} accentColor="bg-blue-500/10" />
                    <StatCard title="Highest Streak" value="20 Days" accentColor="bg-cyan-500/10" />
                    <StatCard title="Followers Reached" value={githubData.followers || 0} accentColor="bg-purple-500/10" />
                    <StatCard title="Following Connections" value={githubData.following || 0} accentColor="bg-pink-500/10" />
                    <StatCard title="Base Location" value={githubData.location || "Mumbai, IN"} accentColor="bg-orange-500/10" />
                </div>

            </section>
        </div>
    );
};

const StatCard = ({ title, value, accentColor = "bg-primary/5", className = "" }) => {
    return (
        <div className={`bg-card rounded-xl p-5 border border-border shadow-sm flex flex-col justify-between relative group overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-glow ${className}`}>
            <div className={`absolute -left-8 -top-8 w-20 h-20 ${accentColor} blur-[25px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0`}></div>

            <div className="relative z-10">
                <h4 className="text-secondary-text text-xs font-semibold uppercase tracking-wider mb-2">
                    {title}
                </h4>
                <p className="text-xl md:text-2xl font-bold text-primary-text truncate">
                    {value}
                </p>
            </div>
        </div>
    );
};

export default GithubStats;