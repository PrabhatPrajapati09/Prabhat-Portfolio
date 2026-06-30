import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../context/authContext';
import { skillsAPI } from '../utils/api';

const Skills = ({ skillsData, updateSkills }) => {
    const { devMode } = useAdmin();
    const [skill, setSkill] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showMore, setShowMore] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState(null); 

    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        skillName: '',
        icon: '',
        description: '',
        topics: '',
        proficiency: 50,
        category: 'frontend'
    });

    useEffect(() => {
        if (skillsData) {
            setSkill(skillsData);
        }
    }, [skillsData]);

    useEffect(() => {
        setShowMore(false);
    }, [searchQuery, selectedCategory]);

    const resetForm = () => {
        setFormData({
            skillName: '',
            icon: '',
            description: '',
            topics: '',
            proficiency: 50,
            category: 'frontend'
        });
    }

    const categories = [
        'All',
        'Frontend',
        'Backend',
        'Database',
        'Programming Languages',
        'Tools'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!formData.skillName.trim()) return;
        try {
            const response = await skillsAPI.create(formData);
            updateSkills([...skillsData, response.newSkill || response]);
            setIsAdding(false);
            resetForm();
        } catch (error) {
            alert("Skill not added: " + (error.response?.data?.message || error.message));
        }
    }

    const handleEditSkill = async (e, id) => {
        e.preventDefault();
        try {
            const response = await skillsAPI.update(id, formData);
            updateSkills(skill.map(sk => sk._id === id ? (response.skill || response) : sk));
            setIsEditing(false);
            setEditingId(null);
            resetForm();
        } catch (error) {
            alert("Skill not updated: " + (error.response?.data?.message || error.message));
        }
    }

    const handleDeleteSkill = async (e, skillToDelete) => {
        e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete ${skillToDelete.skillName}?`)) return;
        try {
            await skillsAPI.delete(skillToDelete._id);
            updateSkills(skillsData.filter(sk => sk._id !== skillToDelete._id));
        } catch (error) {
            alert("Skill not deleted: " + (error.response?.data?.message || error.message));
        }
    }

    const startEditing = (e, skillToEdit) => {
        e.stopPropagation();
        setEditingId(skillToEdit._id);
        setFormData({
            skillName: skillToEdit.skillName || '',
            icon: skillToEdit.icon || '',
            description: skillToEdit.description || '',
            topics: skillToEdit.topics || '',
            proficiency: skillToEdit.proficiency || 50,
            category: skillToEdit.category || 'frontend'
        });
        setIsEditing(true);
    }

    const filteredSkills = skill.filter(sk => {
        const matchesCategory = selectedCategory === 'All' || sk.category?.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = sk.skillName?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const displaySkills = showMore ? filteredSkills : filteredSkills.slice(0, 12);
    const hasMore = filteredSkills.length > 12;

    const renderIcon = (iconStr, sizeClass = "w-7 h-7") => {
        if (!iconStr) return null;
        if (iconStr.trim().startsWith('<svg')) {
            return <div className={`${sizeClass} flex items-center justify-center [&>svg]:w-full [&>svg]:h-full text-current`} dangerouslySetInnerHTML={{ __html: iconStr }} />;
        }
        return <img src={iconStr} alt="icon" className={`${sizeClass} object-contain`} />;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 24 } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
    };

    return (
        <div className="min-h-screen bg-background px-4 sm:px-8 pt-16 flex flex-col justify-start items-center gap-8 transition-colors duration-300 relative overflow-hidden">

            <div className="text-center z-10 relative w-[90vw] md:w-[85vw] max-w-7xl flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl text-primary-text font-bold mb-2">Technical Skills</h1>
                <p className="text-secondary-text text-md md:text-xl max-w-2xl">Here are some of my skills on which I have been working on recently</p>
            </div>
            {devMode && (
                <div className="w-full max-w-6xl flex justify-end px-2 sm:px-4 z-10">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4 bg-disabled-button text-primary-text px-4 py-2 rounded-full flex items-center gap-2 hover:bg-card border border-border transition-all shadow-md"
                        onClick={() => setIsAdding(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Add Skill
                    </motion.button>
                </div>
            )}

            <div className="w-[90vw] md:w-[85vw] max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 mt-4 pb-6 border-b border-border z-10">
                <div className="relative w-full md:w-auto md:min-w-[300px]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-4 text-secondary-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-border bg-transparent rounded-lg py-2 pl-12 pr-4 text-primary-text focus:outline-none focus:border-active-button transition-colors duration-300"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto w-full md:w-auto hide-scrollbar scroll-smooth">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`whitespace-nowrap cursor-pointer px-4 py-1.5 rounded-xl text-sm transition-all duration-300 border ${selectedCategory === cat
                                ? 'bg-active-button text-white border-active-button shadow-md'
                                : 'bg-card text-secondary-text border-border hover:border-active-button hover:text-primary-text'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div id="skills-grid" className="w-[90vw] md:w-[85vw] max-w-7xl relative mt-4">
                <motion.div
                    key={showMore ? "expanded" : "collapsed"}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ${!showMore && hasMore ? 'pb-24' : 'pb-6'}`}
                >
                    <AnimatePresence mode="popLayout">
                        {displaySkills.map(sk => (
                            <motion.div
                                layoutId={`skill-card-${sk._id}`}
                                variants={itemVariants} 
                                key={sk._id}
                                onClick={() => setSelectedSkill(sk)}
                                whileHover={{ scale: 1.02 }}
                                className="bg-card rounded-2xl p-5 border border-border cursor-pointer shadow-sm transition-colors duration-300 hover:shadow-glow relative overflow-hidden group"
                            >
                                <div className="absolute -left-12 -top-12 w-40 h-40 bg-active-button/20 blur-[35px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

                                <div className="relative z-10 flex flex-col gap-3">
                                    {devMode && (
                                        <div className="absolute -top-2 -right-2 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 backdrop-blur rounded-lg p-1.5 border border-border">
                                            <button onClick={(e) => startEditing(e, sk)} className="text-blue-500 hover:scale-110 transition-transform">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" /></svg>
                                            </button>
                                            <button onClick={(e) => handleDeleteSkill(e, sk)} className="text-red-500 hover:scale-110 transition-transform">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" /></svg>
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center text-primary-text drop-shadow-sm">
                                                {renderIcon(sk.icon, "w-7 h-7")}
                                            </div>
                                            <h3 className="text-primary-text font-bold text-md tracking-wide">{sk.skillName}</h3>
                                        </div>
                                        <span className="text-active-button font-bold text-sm">{sk.proficiency || 50}%</span>
                                    </div>

                                    <div className="w-full bg-background border border-border/40 h-[6px] rounded-full overflow-hidden mt-1 relative z-10">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${sk.proficiency || 50}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="bg-active-button h-full rounded-full"
                                        />
                                    </div>

                                    {sk.topics && (
                                        <div className="text-xs text-secondary-text line-clamp-1 mt-1 font-medium">
                                            {sk.topics}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {!showMore && hasMore && (
                    <div className="absolute bottom-0 -left-1 w-[85vw] h-56 flex flex-col items-center justify-end pb-4 z-20">
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-[3px] bg-gradient-to-t from-background/95 via-background/60 to-transparent pointer-events-auto z-10 rounded-b-2xl" />

                        <button
                            onClick={() => setShowMore(true)}
                            className="relative z-20 bg-active-button hover:bg-base-button text-white px-6 py-2 rounded-full transition shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Show More
                        </button>
                    </div>
                )}

                {showMore && (
                    <div className="flex justify-center mt-6 mb-4">
                        <button
                            onClick={() => {
                                setShowMore(false);
                                requestAnimationFrame(() => {
                                    document.getElementById("skills-grid")?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start"
                                    });
                                });
                            }}
                            className="bg-card border border-border hover:border-active-button text-primary-text px-6 py-2 rounded-full transition shadow-sm hover:shadow-md"
                        >
                            Show Less
                        </button>
                    </div>
                )}
            </div>

            <AnimatePresence>

                {selectedSkill && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setSelectedSkill(null)}
                        />
                        <motion.div
                            layoutId={`skill-card-${selectedSkill._id}`}
                            className="bg-card border border-border w-full max-w-lg rounded-2xl p-6 md:p-8 z-10 shadow-2xl overflow-hidden relative"
                        >
                            <button
                                onClick={() => setSelectedSkill(null)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-background rounded-full border border-border text-secondary-text hover:text-primary-text hover:bg-border transition-colors"
                            >
                                ✕
                            </button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 flex items-center justify-center text-primary-text drop-shadow-md">
                                    {renderIcon(selectedSkill.icon, "w-10 h-10")}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-primary-text">{selectedSkill.skillName}</h2>
                                    {selectedSkill.category && (
                                        <span className="text-xs font-mono uppercase tracking-wider text-active-button">{selectedSkill.category}</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                {selectedSkill.proficiency !== undefined && (
                                    <div className="w-full">
                                        <div className="flex justify-between text-sm font-medium text-secondary-text mb-2">
                                            <span>Proficiency Mastery</span>
                                            <span className="text-active-button font-bold">{selectedSkill.proficiency}%</span>
                                        </div>
                                        <div className="w-full bg-background border border-border h-2.5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${selectedSkill.proficiency}%` }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                                className="bg-active-button h-full rounded-full"
                                            />
                                        </div>
                                    </div>
                                )}

                                {selectedSkill.description && (
                                    <div>
                                        <h4 className="text-sm font-bold text-primary-text mb-1">Overview</h4>
                                        <p className="text-secondary-text text-sm leading-relaxed">{selectedSkill.description}</p>
                                    </div>
                                )}

                                {selectedSkill.topics && (
                                    <div>
                                        <h4 className="text-sm font-bold text-primary-text mb-2">Key Topics</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedSkill.topics.split(',').map((topic, i) => (
                                                <span key={i} className="bg-background border border-border/60 text-secondary-text text-xs px-3 py-1.5 rounded-lg shadow-sm">
                                                    {topic.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}

                {(isAdding || isEditing) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => { setIsAdding(false); setIsEditing(false); resetForm(); }}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-card border border-border p-6 md:p-8 rounded-2xl w-full max-w-md shadow-2xl z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl md:text-2xl font-bold text-primary-text">{isEditing ? 'Edit Skill' : 'Add New Skill'}</h2>
                                <button onClick={() => { setIsAdding(false); setIsEditing(false); resetForm(); }} className="text-secondary-text hover:text-red-500 transition-colors">✕</button>
                            </div>

                            <form onSubmit={isEditing ? (e) => handleEditSkill(e, editingId) : handleAddSkill} className="flex flex-col gap-4">
                                <div>
                                    <label className="text-xs md:text-sm text-secondary-text mb-1 block font-medium">Skill Name</label>
                                    <input type="text" name="skillName" value={formData.skillName} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-2.5 text-primary-text focus:outline-none focus:border-active-button text-sm" required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs md:text-sm text-secondary-text mb-1 block font-medium">Category</label>
                                        <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-2.5 text-primary-text focus:outline-none focus:border-active-button text-sm" required>
                                            {categories.filter(c => c !== 'All').map(cat => (
                                                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs md:text-sm text-secondary-text mb-1 block font-medium">Proficiency (0-100)</label>
                                        <input type="number" name="proficiency" min="0" max="100" value={formData.proficiency} onChange={handleChange} className="w-full bg-background border border-border rounded-lg p-2.5 text-primary-text focus:outline-none focus:border-active-button text-sm" required />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs md:text-sm text-secondary-text mb-1 block font-medium">Icon (SVG Code or Image URL)</label>
                                    <textarea name="icon" value={formData.icon} onChange={handleChange} rows="2" className="w-full bg-background border border-border rounded-lg p-2.5 text-primary-text focus:outline-none focus:border-active-button font-mono text-xs" placeholder="<svg>...</svg> or /assets/icon.png" required />
                                </div>

                                <div>
                                    <label className="text-xs md:text-sm text-secondary-text mb-1 block font-medium">Topics (Comma separated)</label>
                                    <input type="text" name="topics" value={formData.topics} onChange={handleChange} placeholder="React, Context API, Redux..." className="w-full bg-background border border-border rounded-lg p-2.5 text-primary-text focus:outline-none focus:border-active-button text-sm" required />
                                </div>

                                <div>
                                    <label className="text-xs md:text-sm text-secondary-text mb-1 block font-medium">Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-background border border-border rounded-lg p-2.5 text-primary-text focus:outline-none focus:border-active-button text-sm" required />
                                </div>

                                <div className="flex justify-end gap-3 mt-4 text-sm font-medium">
                                    <button type="button" onClick={() => { setIsAdding(false); setIsEditing(false); resetForm(); }} className="px-4 py-2 rounded-lg border border-border text-primary-text hover:bg-background transition-colors">Cancel</button>
                                    <button type="submit" className="px-4 py-2 rounded-lg bg-active-button hover:bg-base-button text-white transition-colors shadow-sm">
                                        {isEditing ? 'Save Changes' : 'Add Skill'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Skills;