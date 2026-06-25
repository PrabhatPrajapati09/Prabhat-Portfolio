import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/authContext';

const Footer = ({ data, setPortfolioData }) => {
    const { login } = useAdmin();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [details, setDetails] = useState({
        location: 'Vasai, Palghar',
        phone: '8928144768',
        email: 'work.prabhat73@gmail.com',
        githubUrl: 'https://github.com/PrabhatPrajapati09',
        linkedinUrl: 'https://www.linkedin.com/in/prabhat-prajapati-266423323'
    });

    useEffect(() => {
        if (data) {
            setDetails(prev => ({ ...prev, ...data }));
        }
    }, [data]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await login(email, secretKey);

            if (!response.success) {
                setError(response.message);
                setIsLoading(false);
                return;
            }

            setIsModalOpen(false);
            setEmail('');
            setSecretKey('');

            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background w-full h-fit px-6 sm:px-12 md:px-16 lg:px-24 transition-all duration-300">
            
            <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-6 text-center sm:text-left">
                <div>
                    <div
                        onDoubleClick={() => setIsModalOpen(true)}
                        className="logo text-3xl font-['Caveat'] font-bold tracking-wider text-primary-text select-none cursor-default mb-1"
                    >
                        {"<PrabhatP/>"}
                    </div>
                    <p className="text-secondary-text text-xs tracking-wide">MERN Stack Developer | Full-Stack Web Developer</p>
                </div>

                <div className="links flex items-center gap-3 text-primary-text">
                    <div className="github cursor-pointer bg-card p-2 rounded-xl hover:scale-[1.05] transition-all duration-300 border border-border/40">
                        <a href={details.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="Github Profile">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6.51734 17.1132C6.91177 17.6905 8.10883 18.9228 9.74168 19.2333M9.86428 22C8.83582 21.8306 2 19.6057 2 12.0926C2 5.06329 8.0019 2 12.0008 2C15.9996 2 22 5.06329 22 12.0926C22 19.6057 15.1642 21.8306 14.1357 22C14.1357 22 13.9267 18.5826 14.0487 17.9969C14.1706 17.4113 13.7552 16.4688 13.7552 16.4688C14.7262 16.1055 16.2043 15.5847 16.7001 14.1874C17.0848 13.1032 17.3268 11.5288 16.2508 10.0489C16.2508 10.0489 16.5318 7.65809 15.9996 7.56548C15.4675 7.47287 13.8998 8.51192 13.8998 8.51192C13.4432 8.38248 12.4243 8.13476 12.0018 8.17939C11.5792 8.13476 10.5568 8.38248 10.1002 8.51192C10.1002 8.51192 8.53249 7.47287 8.00036 7.56548C7.46823 7.65809 7.74917 10.0489 7.74917 10.0489C6.67316 11.5288 6.91516 13.1032 7.2999 14.1874C7.79575 15.5847 9.27384 16.1055 10.2448 16.4688C10.2448 16.4688 9.82944 17.4113 9.95135 17.9969C10.0733 18.5826 9.86428 22 9.86428 22Z"></path>
                            </svg>
                        </a>
                    </div>
                    <div className="linkedin cursor-pointer bg-card p-2 rounded-xl text-primary-text hover:scale-[1.05] transition-all duration-300 border border-border/40">
                        <a href={details.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                            <svg width="20" height="20" viewBox="0 0 192 192" color='currentColor' fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><rect width="132" height="132" x="30" y="30" stroke="currentColor" strokeWidth="12" rx="16" /><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12" d="M66 86v44" /><circle cx="66" cy="64" r="8" fill="currentColor" /><path stroke="currentColor" strokeLinecap="round" strokeWidth="12" d="M126 130v-26c0-9.941-8.059-18-18-18v0c-9.941 0-18 8.059-18 18v26" /></svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-5xl mx-auto h-[1px] bg-border/60"></div>

            <div className="w-full max-w-5xl mx-auto text-secondary-text py-5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="copyright text-xs hover:text-disabled-button text-center md:text-left transition-all duration-300 order-2 md:order-1">
                    © 2026 Prabhat Prajapati, All Rights Reserved
                </div>
                
                <div className="info flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-6 text-xs order-1 md:order-2 w-full sm:w-auto">
                    <p className="text-secondary-text flex items-center gap-1.5 hover:text-disabled-button cursor-pointer transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M13.6177 21.367C13.1841 21.773 12.6044 22 12.0011 22C11.3978 22 10.8182 21.773 10.3845 21.367C6.41302 17.626 1.09076 13.4469 3.68627 7.37966C5.08963 4.09916 8.45834 2 12.0011 2C15.5439 2 18.9126 4.09916 20.316 7.37966C22.9082 13.4393 17.599 17.6389 13.6177 21.367Z"></path>
                            <path d="M15.5 11C15.5 12.933 13.933 14.5 12 14.5C10.067 14.5 8.5 12.933 8.5 11C8.5 9.067 10.067 7.5 12 7.5C13.933 7.5 15.5 9.067 15.5 11Z"></path>
                        </svg>
                        <span>{details.location}</span>
                    </p>
                    <p className="text-secondary-text flex items-center hover:text-disabled-button cursor-pointer transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            <path d="M9.1585 5.71217L8.75584 4.80619C8.49256 4.21382 8.36092 3.91762 8.16405 3.69095C7.91732 3.40688 7.59571 3.19788 7.23592 3.08779C6.94883 2.99994 6.6247 2.99994 5.97645 2.99994C5.02815 2.99994 4.554 2.99994 4.15597 3.18223C3.68711 3.39696 3.26368 3.86322 3.09497 4.35054C2.95175 4.76423 2.99278 5.18937 3.07482 6.03964C3.94815 15.0901 8.91006 20.052 17.9605 20.9254C18.8108 21.0074 19.236 21.0484 19.6496 20.9052C20.137 20.7365 20.0632 20.3131 20.818 19.8442C21.0002 19.4462 21.0002 18.972 21.0002 18.0237C21.0002 17.3755 21.0002 17.0514 20.9124 16.7643C20.8023 16.4045 20.5933 16.0829 20.3092 15.8361C20.0826 15.6393 19.7864 15.5076 19.194 15.2443L18.288 14.8417C17.6465 14.5566 17.3257 14.414 16.9998 14.383C16.6878 14.3533 16.3733 14.3971 16.0813 14.5108C15.7762 14.6296 15.5066 14.8543 14.9672 15.3038C14.4304 15.7511 14.162 15.9748 13.834 16.0946C13.5432 16.2009 13.1588 16.2402 12.8526 16.1951C12.5071 16.1442 12.2426 16.0028 11.7135 15.7201C10.0675 14.8404 9.15977 13.9327 8.28011 12.2867C7.99738 11.7576 7.85602 11.4931 7.80511 11.1476C7.75998 10.8414 7.79932 10.457 7.90554 10.1662C8.02536 9.83822 8.24905 9.5698 8.69643 9.03294C9.14586 8.49362 9.37058 8.22396 9.48939 7.91885C9.60309 7.62688 9.64686 7.31234 9.61719 7.00042C9.58618 6.67446 9.44362 6.3537 9.1585 5.71217Z"></path>
                        </svg>
                        <span className='ml-1'>{details.phone}</span>
                    </p>
                    <p className="text-secondary-text flex items-center gap-1.5 cursor-pointer hover:text-disabled-button transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                            <path d="M2 6L8.91302 9.91697C11.4616 11.361 12.5384 11.361 15.087 9.91697L22 6"></path>
                            <path d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"></path>
                        </svg>
                        <span>{details.email}</span>
                    </p>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
                    <div className="bg-background border border-border p-6 md:p-8 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up">

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-primary-text font-['Caveat'] tracking-wider">Admin Protocol</h2>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setError('');
                                }}
                                className="text-secondary-text hover:text-red-500 transition"
                            >
                                ✕
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="flex flex-col gap-4 text-sm">
                            <div>
                                <label className="text-sm text-secondary-text mb-1 block">Authentication Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-card border border-border rounded-lg p-2.5 md:p-3 text-primary-text focus:outline-none focus:border-active-button"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm text-secondary-text mb-1 block">Secret Key</label>
                                <input
                                    type="password"
                                    value={secretKey}
                                    onChange={(e) => setSecretKey(e.target.value)}
                                    className="w-full bg-card border border-border rounded-lg p-2.5 md:p-3 text-primary-text focus:outline-none focus:border-active-button tracking-widest"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-2 w-full py-3 rounded-lg bg-active-button hover:bg-base-button text-white font-medium disabled:opacity-50 transition-colors text-sm"
                            >
                                {isLoading ? 'Verifying...' : 'Initialize Override'}
                            </button>
                        </form>

                    </div>
                </div>
            )}

        </div>
    )
}

export default Footer;