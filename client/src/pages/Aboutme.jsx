import React from 'react'
import secProfile from '../assets/secProfile2.jpeg'

const Aboutme = ({ data }) => {
    
    const quickBitsArray = Array.isArray(data?.quickBits) ? data.quickBits : [];

    const midPoint = Math.ceil(quickBitsArray.length / 2);
    const leftColumnBits = quickBitsArray.slice(0, midPoint);
    const rightColumnBits = quickBitsArray.slice(midPoint);

    return (
        <div className="aboutmeContainer w-full min-h-screen flex items-center justify-center py-20 md:py-0 px-6 md:px-12 lg:px-24 bg-background transition-colors duration-300">
            
            <div className="w-full max-w-[90vw] flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-20 items-center justify-center">

                <div className="secProfile w-full md:w-[40%] flex justify-center items-center">
                    <div className="relative w-[75%] sm:w-[60%] md:w-full max-w-[320px] aspect-[3/4]">
                        <div className="absolute -bottom-5 -left-5 md:-bottom-6 md:-left-6 w-full h-full border-b-[12px] border-l-[12px] md:border-b-[16px] md:border-l-[16px] border-card z-0 transition-colors duration-300"></div>
                        <img 
                            className="relative z-10 w-full h-full shadow-2xl rounded-sm object-cover border border-border/50" 
                            src={data?.secondaryImage || secProfile} 
                            alt="Prabhat" 
                        />
                    </div>
                </div>

                <div className="aboutme flex flex-col gap-4 w-full md:w-[60%]">
                    <div className="card bg-card text-primary-text px-4 py-2 w-fit rounded-xl flex items-center gap-2 shadow-sm border border-border">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500"></span>
                        </span>
                        About Me
                    </div>

                    <div className="flex flex-col gap-4 items-start">
                        <div className="text-primary-text text-3xl md:text-4xl font-bold leading-tight tracking-tight">
                            {data?.aboutTagline || "Bridging the gap between design and robust architecture."}
                        </div>

                        <div className="about text-secondary-text text-base md:text-md leading-relaxed">
                            
                            <div className="whitespace-pre-wrap mb-6 text-secondary-text/90">
                                {data?.completeAboutDesc || "I'm a passionate MERN stack developer..."}
                            </div>

                            {quickBitsArray.length > 0 && (
                                <div className="mb-6">
                                    <p className="mb-3 text-primary-text font-semibold text-sm uppercase tracking-wider">Finally, some quick bits about me.</p>
                                    <div className="quickbits flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center bg-card p-4 rounded-xl border border-border shadow-sm">
                                        <div className="hidden sm:block h-12 w-[3px] bg-active-button rounded-full"></div>
                                        
                                        <div className="flex flex-col gap-1.5">
                                            {leftColumnBits.map((bit, index) => (
                                                <p key={index} className="flex items-center gap-2 text-sm">
                                                    <span className="text-active-button text-xs">▹</span> {bit}
                                                </p>
                                            ))}
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            {rightColumnBits.map((bit, index) => (
                                                <p key={index} className="flex items-center gap-2 text-sm">
                                                    <span className="text-active-button text-xs">▹</span> {bit}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data?.humour && (
                                <p className="humour text-secondary-text/80 italic border-l-2 border-active-button pl-4 py-1 text-sm bg-card/30 rounded-r-lg pr-2">
                                    {data.humour}
                                </p>
                            )}
                            
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Aboutme;