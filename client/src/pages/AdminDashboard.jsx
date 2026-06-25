import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useAdmin } from '../context/authContext'
import { useNavigate } from 'react-router-dom';
import { analyticsAPI, portfolioAPI } from '../utils/api';
import { ImSpinner9 } from 'react-icons/im';

const AdminDashboard = () => {
    const { isAdmin, loading } = useAdmin();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('analytics');
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("app-theme");
        return savedTheme ? savedTheme : "dark"
    });

    const [analytics, setAnalytics] = useState({
        pageViews: 0,
        resumeDownloads: 0,
        projectClicks: 0,
        contactMails: 0
    });
    const [loadAnalytics, setLoadAnalytics] = useState(false);

    const [portfolioData, setPortfolioData] = useState({});
    const [loadPortfolioData, setLoadPortfolioData] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [editModes, setEditModes] = useState({
        details: false,
        about: false,
        contacts: false,
        links: false
    });

    const [formData, setFormData] = useState({
        name: '',
        title: '',
        about: '',
        primaryImage: '',
        secondaryImage: '',
        aboutTagline: '',
        completeAboutDesc: '',
        quickBits: '', 
        humour: '',
        resumeUrl: '',
        githubUrl: '',
        linkedInUrl: '',
        music: '',
        email: '',
        phone: '',
        location: ''
    });

    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate('/');
        }
    }, [isAdmin, loading, navigate]);

    useEffect(() => {
        localStorage.setItem("app-theme", theme);
    }, [theme]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!isAdmin || activeTab !== 'analytics') return;
            setLoadAnalytics(true);
            try {
                const data = await analyticsAPI.get();
                setAnalytics(data);
            } catch (error) {
                console.log("Failed to get analytics", error.message);
            } finally {
                setLoadAnalytics(false);
            }
        };
        fetchAnalytics();
    }, [isAdmin, activeTab]);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            if (!isAdmin || activeTab !== 'portfolio') return;
            setLoadPortfolioData(true);
            try {
                const data = await portfolioAPI.get();
                setPortfolioData(data);
                
                setFormData({
                    ...data,
                    quickBits: Array.isArray(data.quickBits) ? data.quickBits.join(', ') : (data.quickBits || '')
                }); 
            } catch (error) {
                console.log("Failed to get portfolio data", error.message);
            } finally {
                setLoadPortfolioData(false);
            }
        };
        fetchPortfolioData();
    }, [isAdmin, activeTab]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSave = async (section) => {
        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                quickBits: typeof formData.quickBits === 'string' 
                    ? formData.quickBits.split(',').map(bit => bit.trim()).filter(Boolean)
                    : formData.quickBits
            };

            const response = await portfolioAPI.update(payload);
            const savedData = response.details || response;
            
            setPortfolioData(savedData);
            
            setFormData({
                ...savedData,
                quickBits: Array.isArray(savedData.quickBits) ? savedData.quickBits.join(', ') : (savedData.quickBits || '')
            }); 

            setEditModes(prev => ({ ...prev, [section]: false }));
        } catch (error) {
            alert("Failed to update: " + (error.response?.data?.message || error.message));
        } finally {
            setIsSaving(false);
        }
    }

    const handleCancel = (section) => {
        setFormData({
            ...portfolioData,
            quickBits: Array.isArray(portfolioData.quickBits) ? portfolioData.quickBits.join(', ') : (portfolioData.quickBits || '')
        });
        setEditModes(prev => ({ ...prev, [section]: false }));
    }

    const getInputClass = (isEditing) => `w-full px-3 py-2 rounded-xl transition-all duration-300 ${isEditing
        ? "bg-background border border-border text-primary-text focus:outline-none focus:border-active-button"
        : "bg-transparent border border-transparent text-secondary-text cursor-default"
        }`;

    if (loading || !isAdmin) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center">
                <ImSpinner9 size={30} className="animate-spin text-purple-500" />
                <h1 className="text-2xl text-white font-bold mt-2">Loading Portfolio Resources...</h1>
            </div>
        )
    }

    const safeDivide = (numerator) => analytics.pageViews > 0 ? (numerator / analytics.pageViews) : 0;
    const downloadRate = (safeDivide(analytics.resumeDownloads) * 100).toFixed(1);
    const clickRate = (safeDivide(analytics.projectClicks) * 100).toFixed(1);
    const mailRate = (safeDivide(analytics.contactMails) * 100).toFixed(1);
    const pageViewGoal = 1000;
    const viewProgress = Math.min((analytics.pageViews / pageViewGoal) * 100, 100).toFixed(1);

    const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" /></svg>;
    const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16.8787 2H12C9.17157 2 7.75736 2 6.87868 2.87868C6 3.75736 6 5.17157 6 8V12C6 14.8284 6 16.2426 6.87868 17.1213C7.75736 18 9.17157 18 12 18H16C18.8284 18 20.2426 18 21.1213 17.1213C22 16.2426 22 14.8284 22 12V7.12132C22 6.25606 22 5.82342 21.8851 5.42026C21.822 5.19879 21.7335 4.98533 21.6216 4.78409C21.4178 4.41775 21.1118 4.11183 20.5 3.5C19.8882 2.88817 19.5822 2.58225 19.2159 2.37843C19.0147 2.26647 18.8012 2.17805 18.5797 2.11492C18.1766 2 17.7439 2 16.8787 2Z"></path>
        <path d="M2 6V12.0002C2 16.7143 2 19.0713 3.46447 20.5357C4.92893 22.0002 7.28597 22.0002 12 22.0002L18 22.0002"></path>
        <path d="M10 2C10 3.88562 10 4.82843 10.5858 5.41421C11.1716 6 12.1144 6 14 6C15.8856 6 16.8284 6 17.4142 5.41421C18 4.82843 18 3.88562 18 2"></path>
        <path d="M18 18V15C18 13.1144 18 12.1716 17.4142 11.5858C16.8284 11 15.8856 11 14 11C12.1144 11 11.1716 11 10.5858 11.5858C10 12.1716 10 13.1144 10 15V18"></path>
    </svg>;
    const CancelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="5 5 14 14" width="14" height="14" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.43212 18.5679C6.00828 19.144 6.94243 19.144 7.51859 18.5679L12.0003 14.0863L16.4814 18.5672C17.0573 19.1431 17.9909 19.1434 18.5672 18.5679C19.144 17.9919 19.1443 17.0573 18.5679 16.4809L14.0868 12L18.5679 7.51913C19.1438 6.94326 19.1441 6.0097 18.5686 5.43346C17.9925 4.85669 17.0578 4.85638 16.4814 5.43278L12.0003 9.91365L7.51859 5.4321C6.94243 4.85597 6.00828 4.85597 5.43212 5.4321C4.85596 6.00823 4.85596 6.94232 5.43212 7.51845L9.91387 12L5.43212 16.4816C4.85596 17.0577 4.85596 17.9918 5.43212 18.5679Z"></path>
    </svg>;

    return (
        <div className={theme}>
            <Navbar theme={theme} setTheme={setTheme} />
            <div className='min-h-screen flex flex-col items-center pt-24 pb-10 gap-6 bg-background transition-colors duration-300'>
                <div className='flex items-center w-full justify-center'>
                    <div className="flex flex-col md:flex-row items-center justify-between w-[80vw] gap-4">
                        <div>
                            <h1 className='text-3xl text-primary-text font-bold'>Admin Dashboard</h1>
                            <p className='text-secondary-text'>View analytics, monitor user activity, manage content, and gain insights</p>
                        </div>
                        <div className='flex gap-4 p-2 bg-card rounded-2xl border border-border shadow-sm'>
                            <ul className='flex items-center gap-2 text-secondary-text'>
                                <li
                                    onClick={() => setActiveTab('analytics')}
                                    className={`rounded-xl px-4 py-2 cursor-pointer transition-all duration-300 ${activeTab === 'analytics' ? 'bg-active-button text-white shadow-md' : 'hover:text-primary-text hover:bg-background'}`}
                                >
                                    Analytics
                                </li>
                                <li
                                    onClick={() => setActiveTab('portfolio')}
                                    className={`rounded-xl px-4 py-2 cursor-pointer transition-all duration-300 ${activeTab === 'portfolio' ? 'bg-active-button text-white shadow-md' : 'hover:text-primary-text hover:bg-background'}`}
                                >
                                    Edit Details
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className='w-[80vw] h-[1px] bg-border my-2'></div>

                {activeTab === 'analytics' && (
                    <div className='flex flex-col justify-center items-start w-[80vw] animate-fade-in-up'>
                        <div className="flex items-center gap-4 mb-6">
                            <h2 className='text-2xl font-bold text-primary-text'>System Analytics</h2>
                            {loadAnalytics && <ImSpinner9 className="animate-spin text-active-button" />}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                            <div className="statics flex flex-col justify-center gap-2 col-span-1 lg:col-span-2 bg-card px-6 py-6 rounded-2xl border border-border shadow-sm relative group overflow-hidden transition-all duration-300 hover:scale-[1.02]">
                                <div className="absolute -left-12 -top-12 w-48 h-48 bg-purple-500/30 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-14 h-14 bg-background text-active-button rounded-2xl flex items-center justify-center shadow-sm border border-border">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M8 22V19C8 17.1144 8 16.1716 8.58579 15.5858C9.17157 15 10.1144 15 12 15C13.8856 15 14.8284 15 15.4142 15.5858C16 16.1716 16 17.1144 16 19V22" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M10 7H14" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M3 11.8584C3 7.28199 3 4.99376 4.38674 3.54394C4.43797 3.49038 4.49038 3.43797 4.54394 3.38674C5.99376 2 8.28199 2 12.8584 2C13.943 2 14.4655 2.00376 14.9628 2.18936C15.4417 2.3681 15.8429 2.70239 16.6452 3.37099L18.8411 5.20092C19.9027 6.08561 20.4335 6.52795 20.7168 7.13266C21 7.73737 21 8.42833 21 9.81025V13C21 16.7497 21 18.6246 20.0451 19.9389C19.7367 20.3634 19.3634 20.7367 18.9389 21.0451C17.6246 22 15.7497 22 12 22C8.25027 22 6.3754 22 5.06107 21.0451C4.6366 20.7367 4.26331 20.3634 3.95491 19.9389C3 18.6246 3 16.7497 3 13V11.8584Z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-primary-text font-bold text-xl">Conversion Overview</p>
                                        <p className='text-secondary-text text-sm'>Real-time tracking of visitor engagement</p>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-4 border-t border-border pt-4 relative z-10">
                                    <div>
                                        <p className="text-secondary-text text-xs uppercase tracking-wider">Download Ratio</p>
                                        <p className='text-primary-text font-bold text-2xl'>{downloadRate}%</p>
                                    </div>
                                    <div>
                                        <p className="text-secondary-text text-xs uppercase tracking-wider">Contact Ratio</p>
                                        <p className='text-primary-text font-bold text-2xl'>{mailRate}%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-box bg-card px-5 py-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between relative group overflow-hidden transition-all duration-300 hover:scale-[1.02]">
                                <div className="absolute -left-12 -top-12 w-32 h-32 bg-blue-500/30 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
                                <div className="relative z-10">
                                    <p className="text-secondary-text text-sm font-medium">Total Page Views</p>
                                    <p className='text-primary-text font-bold text-4xl mt-1'>{analytics.pageViews}</p>
                                </div>
                                <div className="w-full mt-4 relative z-10">
                                    <div className="flex justify-between text-xs text-secondary-text mb-1">
                                        <span>Progress</span>
                                        <span>{viewProgress}% of 1K Goal</span>
                                    </div>
                                    <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border">
                                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${viewProgress}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-box bg-card px-5 py-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between relative group overflow-hidden transition-all duration-300 hover:scale-[1.02]">
                                <div className="absolute -left-12 -top-12 w-32 h-32 bg-green-500/30 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
                                <div className="relative z-10">
                                    <p className="text-secondary-text text-sm font-medium">Resume Downloads</p>
                                    <p className='text-primary-text font-bold text-4xl mt-1'>{analytics.resumeDownloads}</p>
                                </div>
                                <div className="w-full mt-4 relative z-10">
                                    <div className="flex justify-between text-xs text-secondary-text mb-1">
                                        <span>Conversion Rate</span>
                                        <span>{downloadRate}%</span>
                                    </div>
                                    <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border">
                                        <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${downloadRate}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-box bg-card px-5 py-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between relative group overflow-hidden transition-all duration-300 hover:scale-[1.02]">
                                <div className="absolute -left-12 -top-12 w-32 h-32 bg-purple-500/30 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
                                <div className="relative z-10">
                                    <p className="text-secondary-text text-sm font-medium">Project Clicks</p>
                                    <p className='text-primary-text font-bold text-4xl mt-1'>{analytics.projectClicks}</p>
                                </div>
                                <div className="w-full mt-4 relative z-10">
                                    <div className="flex justify-between text-xs text-secondary-text mb-1">
                                        <span>Click-Through Rate</span>
                                        <span>{clickRate}%</span>
                                    </div>
                                    <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border">
                                        <div className="bg-purple-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${clickRate}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-box bg-card px-5 py-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between relative group overflow-hidden transition-all duration-300 hover:scale-[1.02]">
                                <div className="absolute -left-12 -top-12 w-32 h-32 bg-orange-500/30 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
                                <div className="relative z-10">
                                    <p className="text-secondary-text text-sm font-medium">Contact Mails</p>
                                    <p className='text-primary-text font-bold text-4xl mt-1'>{analytics.contactMails}</p>
                                </div>
                                <div className="w-full mt-4 relative z-10">
                                    <div className="flex justify-between text-xs text-secondary-text mb-1">
                                        <span>Contact Rate</span>
                                        <span>{mailRate}%</span>
                                    </div>
                                    <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border">
                                        <div className="bg-orange-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${mailRate}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="stat-box bg-card px-5 py-5 rounded-2xl border border-border shadow-sm flex flex-col justify-between relative group overflow-hidden transition-all duration-300 hover:scale-[1.02]">
                                <div className="absolute -left-12 -top-12 w-32 h-32 bg-rose-500/30 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
                                <div className="relative z-10">
                                    <p className="text-secondary-text text-sm font-medium">Portfolio Likes</p>
                                    <p className='text-primary-text font-bold text-4xl mt-1'>{analytics.portfolioLikes}</p>
                                </div>
                                <div className="w-full mt-4 relative z-10">
                                    <div className="flex justify-between text-xs text-secondary-text mb-1">
                                        <span>Portfolio Like Rate</span>
                                        <span>{mailRate}%</span>
                                    </div>
                                    <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border">
                                        <div className="bg-rose-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${mailRate}%` }}></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {activeTab === 'portfolio' && (
                    <div className='flex flex-col items-center w-full max-w-5xl animate-fade-in-up'>
                        <div className="flex items-center self-start gap-4 mb-6">
                            <h2 className='text-2xl font-bold text-primary-text'>Portfolio Configuration</h2>
                            {(loadPortfolioData || isSaving) && <ImSpinner9 className="animate-spin text-active-button" />}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                            <div className="flex flex-col bg-card p-6 rounded-2xl border border-border shadow-sm relative group overflow-hidden">
                                <div className="absolute -left-12 -top-12 w-32 h-32 bg-blue-500/20 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

                                <div className="flex justify-between items-center z-10 mb-4">
                                    <p className="text-primary-text text-xl font-bold">Identity Details</p>
                                    <div className="flex gap-2">
                                        {editModes.details ? (
                                            <>
                                                <button onClick={() => handleSave('details')} disabled={isSaving} className="p-2 bg-green-500 rounded-full text-white hover:scale-110 shadow-md transition-all">
                                                    <SaveIcon />
                                                </button>
                                                <button onClick={() => handleCancel('details')} disabled={isSaving} className="p-2 bg-red-500 rounded-full text-white hover:scale-110 shadow-md transition-all">
                                                    <CancelIcon />
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => setEditModes(p => ({ ...p, details: true }))} className="p-2 bg-blue-500 rounded-full text-white hover:scale-110 shadow-md transition-all">
                                                <EditIcon />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className='h-[1px] w-full bg-border mb-4 z-10'></div>

                                <div className="flex flex-col gap-3 z-10">
                                    <div>
                                        <label className="text-secondary-text text-xs uppercase tracking-wider font-semibold pl-1">Full Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!editModes.details} className={getInputClass(editModes.details)} />
                                    </div>
                                    <div>
                                        <label className="text-secondary-text text-xs uppercase tracking-wider font-semibold pl-1">Professional Title</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange} disabled={!editModes.details} className={getInputClass(editModes.details)} />
                                    </div>
                                    <div>
                                        <label className="text-secondary-text text-xs uppercase tracking-wider font-semibold pl-1">Primary Image Path</label>
                                        <input type="text" name="primaryImage" value={formData.primaryImage} onChange={handleChange} disabled={!editModes.details} className={getInputClass(editModes.details)} placeholder="/assets/image.png" />
                                    </div>
                                    <div>
                                        <label className="text-secondary-text text-xs uppercase tracking-wider font-semibold pl-1">Hero About Text</label>
                                        <textarea name="about" value={formData.about} onChange={handleChange} disabled={!editModes.details} rows="4" className={`${getInputClass(editModes.details)} resize-none`} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col bg-card p-6 rounded-2xl border border-border shadow-sm relative group overflow-hidden">
                                <div className="absolute -left-12 -top-12 w-32 h-32 bg-purple-500/20 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

                                <div className="flex justify-between items-center z-10 mb-4">
                                    <p className="text-primary-text text-xl font-bold">About Section</p>
                                    <div className="flex gap-2">
                                        {editModes.about ? (
                                            <>
                                                <button onClick={() => handleSave('about')} disabled={isSaving} className="p-2 bg-green-500 rounded-full text-white hover:scale-110 shadow-md transition-all">
                                                    <SaveIcon />
                                                </button>
                                                <button onClick={() => handleCancel('about')} disabled={isSaving} className="p-2 bg-red-500 rounded-full text-white hover:scale-110 shadow-md transition-all">
                                                    <CancelIcon />
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => setEditModes(p => ({ ...p, about: true }))} className="p-2 bg-blue-500 rounded-full text-white hover:scale-110 shadow-md transition-all">
                                                <EditIcon />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className='h-[1px] w-full bg-border mb-4 z-10'></div>

                                <div className="flex flex-col gap-3 z-10 h-full">
                                    <div>
                                        <label className="text-secondary-text text-xs uppercase tracking-wider font-semibold pl-1">Tagline</label>
                                        <input type="text" name="aboutTagline" value={formData.aboutTagline} onChange={handleChange} disabled={!editModes.about} className={getInputClass(editModes.about)} />
                                    </div>
                                    <div>
                                        <label className="text-secondary-text text-xs uppercase tracking-wider font-semibold pl-1">Secondary Image Path</label>
                                        <input type="text" name="secondaryImage" value={formData.secondaryImage} onChange={handleChange} disabled={!editModes.about} className={getInputClass(editModes.about)} placeholder="/assets/image.png" />
                                    </div>
                                    <div>
                                        <label className="text-secondary-text text-xs uppercase tracking-wider font-semibold pl-1">Quick Bits</label>
                                        <input type="text" name="quickBits" value={formData.quickBits} onChange={handleChange} disabled={!editModes.about} className={getInputClass(editModes.about)} placeholder="e.g. Coder, Writer, Gamer" />
                                    </div>
                                    <div>
                                        <label className="text-secondary-text text-xs uppercase tracking-wider font-semibold pl-1">Humour</label>
                                        <input type="text" name="humour" value={formData.humour} onChange={handleChange} disabled={!editModes.about} className={getInputClass(editModes.about)} />
                                    </div>
                                    <div className="flex-grow flex flex-col">
                                        <label className="text-secondary-text text-xs uppercase tracking-wider font-semibold pl-1">Complete Biography</label>
                                        <textarea name="completeAboutDesc" value={formData.completeAboutDesc} onChange={handleChange} disabled={!editModes.about} className={`${getInputClass(editModes.about)} resize-none flex-grow min-h-[80px]`} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col bg-card p-6 rounded-2xl border border-border shadow-sm relative group overflow-hidden">
                                <div className="absolute -left-12 -top-12 w-32 h-32 bg-orange-500/20 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

                                <div className="flex justify-between items-center z-10 mb-4">
                                    <p className="text-primary-text text-xl font-bold">Contact Info</p>
                                    <div className="flex gap-2">
                                        {editModes.contacts ? (
                                            <>
                                                <button onClick={() => handleSave('contacts')} disabled={isSaving} className="p-2 bg-green-500 rounded-full text-white hover:scale-110 shadow-md transition-all">
                                                    <SaveIcon />
                                                </button>
                                                <button onClick={() => handleCancel('contacts')} disabled={isSaving} className="p-2 bg-red-500 rounded-full text-white hover:scale-110 shadow-md transition-all">
                                                    <CancelIcon />
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => setEditModes(p => ({ ...p, contacts: true }))} className="p-2 bg-blue-500 rounded-full text-white hover:scale-110 shadow-md transition-all">
                                                <EditIcon />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className='h-[1px] w-full bg-border mb-4 z-10'></div>

                                <div className="flex flex-col gap-3 z-10">
                                    <div>
                                        <label className="text-secondary-text text-xs uppercase tracking-wider font-semibold pl-1">Email Address</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!editModes.contacts} className={getInputClass(editModes.contacts)} />
                                    </div>
                                    <div>
                                        <label className="text-secondary-text text-xs uppercase tracking-wider font-semibold pl-1">Phone Number</label>
                                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={!editModes.contacts} className={getInputClass(editModes.contacts)} />
                                    </div>
                                    <div>
                                        <label className="text-secondary-text text-xs uppercase tracking-wider font-semibold pl-1">Location</label>
                                        <input type="text" name="location" value={formData.location} onChange={handleChange} disabled={!editModes.contacts} className={getInputClass(editModes.contacts)} placeholder="e.g. Mumbai, India" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col bg-card p-6 rounded-2xl border border-border shadow-sm relative group overflow-hidden">
                                <div className="absolute -left-12 -top-12 w-32 h-32 bg-green-500/20 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

                                <div className="flex justify-between items-center z-10 mb-4">
                                    <p className="text-primary-text text-xl font-bold">Links & URLs</p>
                                    <div className="flex gap-2">
                                        {editModes.links ? (
                                            <>
                                                <button onClick={() => handleSave('links')} disabled={isSaving} className="p-2 bg-green-500 rounded-full text-white hover:scale-110 shadow-md transition-all">
                                                    <SaveIcon />
                                                </button>
                                                <button onClick={() => handleCancel('links')} disabled={isSaving} className="p-2 bg-red-500 rounded-full text-white hover:scale-110 shadow-md transition-all">
                                                    <CancelIcon />
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => setEditModes(p => ({ ...p, links: true }))} className="p-2 bg-blue-500 rounded-full text-white hover:scale-110 shadow-md transition-all">
                                                <EditIcon />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className='h-[1px] w-full bg-border mb-4 z-10'></div>

                                <div className="flex flex-col gap-3 z-10">
                                    <div>
                                        <label className="text-secondary-text text-xs uppercase tracking-wider font-semibold pl-1">GitHub Profile URL</label>
                                        <input type="text" name="githubUrl" value={formData.githubUrl} onChange={handleChange} disabled={!editModes.links} className={getInputClass(editModes.links)} />
                                    </div>
                                    <div>
                                        <label className="text-secondary-text text-xs uppercase tracking-wider font-semibold pl-1">LinkedIn Profile URL</label>
                                        <input type="text" name="linkedInUrl" value={formData.linkedInUrl} onChange={handleChange} disabled={!editModes.links} className={getInputClass(editModes.links)} />
                                    </div>
                                    <div>
                                        <label className="text-secondary-text text-xs uppercase tracking-wider font-semibold pl-1">Resume File Path / URL</label>
                                        <input type="text" name="resumeUrl" value={formData.resumeUrl} onChange={handleChange} disabled={!editModes.links} className={getInputClass(editModes.links)} placeholder="/assets/resume.pdf" />
                                    </div>
                                    <div>
                                        <label className="text-secondary-text text-xs uppercase tracking-wider font-semibold pl-1">Background Music URL</label>
                                        <input type="text" name="music" value={formData.music} onChange={handleChange} disabled={!editModes.links} className={getInputClass(editModes.links)} placeholder="/assets/bgMusic.mp3" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard