import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { analyticsAPI } from '../utils/api';

const Contact = ({ data, setPortfolioData }) => {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMessage(null);

        const templateParams = {
            from_name: formData.name,
            reply_to: formData.email,
            subject: formData.subject,
            message: formData.message,
        };

        try {
            await emailjs.send(
                'service_tca71ad',
                'template_r2j6w3f',
                templateParams,
                'bVLy_3TxrXY0yPWWn'
            );

            setStatusMessage({ type: 'success', text: 'Message Sent Successfully!' });
            setFormData({ email: '', name: '', subject: '', message: '' });
            setTimeout(() => setStatusMessage(null), 3000);

            await analyticsAPI.updateStat('contactMails');

        } catch (error) {
            setStatusMessage({ type: 'error', text: 'Oops! Something went wrong. Please try again.' });
            console.error('Submission Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (

        <div className="min-h-[80vh] bg-background px-4 sm:px-8 py-16 flex flex-col justify-start items-center pt-8 gap-8 transition-all duration-300 w-full">

            <div className="text-center z-10 max-w-2xl">
                <h1 className="text-4xl md:text-5xl text-primary-text font-bold mb-2">Contact Me</h1>
                <p className="text-secondary-text text-base md:text-xl">Let's Build Something Marvelous Together</p>
            </div>

            <div className="contactForm flex flex-col md:flex-row items-center md:items-stretch gap-8 w-full max-w-5xl mt-4">

                <div className="getintouch flex flex-col justify-center gap-4 w-full md:w-1/2 text-center md:text-left items-center md:items-start px-2">
                    <p className="font-bold text-primary-text text-xl sm:text-2xl lg:text-3xl leading-snug">
                        Get In Touch, before I write another line of code..
                    </p>
                    <p className="text-secondary-text text-sm sm:text-base mb-4 max-w-md md:max-w-none">
                        Seeking software development roles (MERN Stack) and freelance opportunities. If you have a project or position in mind, I'd love to hear from you.
                    </p>

                    <div className="flex flex-col gap-2.5 items-center md:items-start text-sm sm:text-base">
                        <p className="text-secondary-text flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M13.6177 21.367C13.1841 21.773 12.6044 22 12.0011 22C11.3978 22 10.8182 21.773 10.3845 21.367C6.41302 17.626 1.09076 13.4469 3.68627 7.37966C5.08963 4.09916 8.45834 2 12.0011 2C15.5439 2 18.9126 4.09916 20.316 7.37966C22.9082 13.4393 17.599 17.6389 13.6177 21.367Z"></path>
                                <path d="M15.5 11C15.5 12.933 13.933 14.5 12 14.5C10.067 14.5 8.5 12.933 8.5 11C8.5 9.067 10.067 7.5 12 7.5C13.933 7.5 15.5 9.067 15.5 11Z"></path>
                            </svg>
                            <span>{data?.location || "Vasai, Palghar"}</span>
                        </p>
                        <p className="text-secondary-text flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                <path d="M9.1585 5.71217L8.75584 4.80619C8.49256 4.21382 8.36092 3.91762 8.16405 3.69095C7.91732 3.40688 7.59571 3.19788 7.23592 3.08779C6.94883 2.99994 6.6247 2.99994 5.97645 2.99994C5.02815 2.99994 4.554 2.99994 4.15597 3.18223C3.68711 3.39696 3.26368 3.86322 3.09497 4.35054C2.95175 4.76423 2.99278 5.18937 3.07482 6.03964C3.94815 15.0901 8.91006 20.052 17.9605 20.9254C18.8108 21.0074 19.236 21.0484 19.6496 20.9052C20.137 20.7365 20.6032 20.3131 20.818 19.8442C21.0002 19.4462 21.0002 18.972 21.0002 18.0237C21.0002 17.3755 21.0002 17.0514 20.9124 16.7643C20.8023 16.4045 20.5933 16.0829 20.3092 15.8361C20.0826 15.6393 19.7864 15.5076 19.194 15.2443L18.288 14.8417C17.6465 14.5566 17.3257 14.414 16.9998 14.383C16.6878 14.3533 16.3733 14.3971 16.0813 14.5108C15.7762 14.6296 15.5066 14.8543 14.9672 15.3038C14.4304 15.7511 14.162 15.9748 13.834 16.0946C13.5432 16.2009 13.1588 16.2402 12.8526 16.1951C12.5071 16.1442 12.2426 16.0028 11.7135 15.7201C10.0675 14.8404 9.15977 13.9327 8.28011 12.2867C7.99738 11.7576 7.85602 11.4931 7.80511 11.1476C7.75998 10.8414 7.79932 10.457 7.90554 10.1662C8.02536 9.83822 8.24905 9.5698 8.69643 9.03294C9.14586 8.49362 9.37058 8.22396 9.48939 7.91885C9.60309 7.62688 9.64686 7.31234 9.61719 7.00042C9.58618 6.67446 9.44362 6.3537 9.1585 5.71217Z"></path>
                            </svg>
                            <span>{data?.phone || "8928144768"}</span>
                        </p>
                        <p className="text-secondary-text flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                                <path d="M2 6L8.91302 9.91697C11.4616 11.361 12.5384 11.361 15.087 9.91697L22 6"></path>
                                <path d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"></path>
                            </svg>
                            <span>{data?.email || "work.prabhat73@gmail.com"}</span>
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="sendmsg w-full md:w-1/2 bg-card flex flex-col gap-4 p-5 sm:p-8 rounded-2xl border border-border shadow-sm relative hover:scale-[1.01] hover:-translate-y-1 hover:shadow-glow transition-all duration-300 overflow-hidden group">

                    <div className="absolute -left-16 -top-16 w-56 h-52 bg-active-button/10 blur-[45px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

                    <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                        <div className="email w-full sm:w-1/2">
                            <p className="text-secondary-text text-sm font-semibold mb-1">Email</p>
                            <input
                                required
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="p-2.5 bg-background rounded-xl w-full border border-border focus:outline-none focus:border-active-button text-primary-text text-sm transition-colors"
                                type="email"
                                placeholder="e.g. john@gmail.com"
                            />
                        </div>
                        <div className="name w-full sm:w-1/2">
                            <p className="text-secondary-text text-sm font-semibold mb-1">Full Name</p>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="p-2.5 bg-background rounded-xl w-full border border-border focus:outline-none focus:border-active-button text-primary-text text-sm transition-colors"
                                type="text"
                                placeholder="e.g. John Locke"
                            />
                        </div>
                    </div>
                    <div className="subject relative z-10">
                        <p className="text-secondary-text text-sm font-semibold mb-1">Subject</p>
                        <input
                            required
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="p-2.5 bg-background rounded-xl w-full border border-border focus:outline-none focus:border-active-button text-primary-text text-sm transition-colors"
                            type="text"
                            placeholder="e.g. Project Proposal"
                        />
                    </div>
                    <div className="msg relative z-10">
                        <p className="text-secondary-text text-sm font-semibold mb-1">Message</p>
                        <textarea
                            required
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="p-2.5 bg-background rounded-xl w-full resize-none border border-border focus:outline-none focus:border-active-button text-primary-text text-sm transition-colors"
                            rows="5"
                            placeholder="Describe your message..."
                        />
                    </div>

                    <div className="submit flex flex-col-reverse sm:flex-row justify-between items-center gap-3 mt-2 relative z-10">
                        <div className="w-full sm:flex-1 text-center sm:text-left min-h-[20px]">
                            {statusMessage && (
                                <p className={`text-xs sm:text-sm font-semibold ${statusMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                    {statusMessage.text}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`p-2.5 bg-active-button rounded-xl text-white px-5 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto
                                ${isSubmitting ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02] hover:shadow-md'}`}
                        >
                            {!isSubmitting && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="currentColor" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21.0477 3.05293C18.8697 0.707363 2.48648 6.4532 2.50001 8.551C2.51535 10.9299 8.89809 11.6617 10.6672 12.1581C11.7311 12.4565 12.016 12.7625 12.2613 13.8781C13.3723 18.9305 13.9301 21.4435 15.2014 21.4996C17.2278 21.5892 23.1733 5.342 21.0477 3.05293Z"></path>
                                    <path d="M11.4999 12.5L14.9999 9" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            )}
                            <span className="font-semibold text-sm tracking-wide">
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default Contact;