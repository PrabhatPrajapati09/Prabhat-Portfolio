import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/authContext';
import { skillsAPI } from '../utils/api';

const Skills = ({ skillsData, updateSkills }) => {
    const { devMode } = useAdmin();
    const [skill, setSkill] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        skillName: '',
        icon: '',
        description: '', 
        category: 'frontend'
    });

    useEffect(() => {
        if (skillsData) {
            setSkill(skillsData);
        }
    }, [skillsData]);

    const resetForm = () => {
        setFormData({
            skillName: '',
            icon: '',
            description: '',
            category: 'frontend'
        });
    }

    const categories = [
        'Frontend',
        'Backend',
        'Database',
        'Programming Languages',
        'Tools'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

    const handleDeleteSkill = async (skillToDelete) => {
        if (!window.confirm(`Are you sure you want to delete ${skillToDelete.skillName}?`)) return;
        try {
            await skillsAPI.delete(skillToDelete._id);
            updateSkills(skillsData.filter(sk => sk._id !== skillToDelete._id));
        } catch (error) {
            alert("Skill not deleted: " + (error.response?.data?.message || error.message));
        }
    }

    const startEditing = (skillToEdit) => {
        setEditingId(skillToEdit._id);
        setFormData({
            skillName: skillToEdit.skillName,
            icon: skillToEdit.icon,
            description: skillToEdit.description,
            category: skillToEdit.category
        });
        setIsEditing(true);
    }

    const getSkillsByCategory = (category) => {
        return skill.filter(sk => sk.category?.toLowerCase() === category.toLowerCase());
    }

    const renderIcon = (iconStr) => {
        if (!iconStr) return null;
        if (iconStr.trim().startsWith('<svg')) {
            return <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full text-current" dangerouslySetInnerHTML={{ __html: iconStr }} />;
        }
        return <img src={iconStr} alt="icon" className="w-8 h-8 md:w-10 md:h-10 object-contain" />;
    };

    return (
        <div className="min-h-screen bg-background px-4 sm:px-8 py-16 flex flex-col justify-start items-center gap-8 transition-colors duration-300 relative w-full">

            <div className="text-center z-10 relative w-full max-w-5xl flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl text-primary-text font-bold mb-2">Technical Skills</h1>
                <p className="text-secondary-text text-md md:text-xl max-w-2xl">Here are some of my skills on which I have been working on recently</p>
                
                {devMode && (
                    <button 
                        className="mt-4 bg-disabled-button text-primary-text px-4 py-2 rounded-full flex items-center gap-2 hover:bg-card border border-border transition-all duration-300 shadow-md" 
                        onClick={() => setIsAdding(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 window-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Add Skill
                    </button>
                )}
            </div>

            <div className="skillCards grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pb-10 mt-4 w-full max-w-5xl">
                {categories.map((category, index) => {
                    const categorySkills = getSkillsByCategory(category);

                    if (categorySkills.length === 0 && !devMode) return null;

                    const isLastOdd = index === categories.length - 1 && categories.length % 2 !== 0;

                    return (
                        <div 
                            key={category} 
                            className={`bg-card rounded-2xl p-5 md:p-6 border border-border transition-all duration-300 hover:scale-[1.01] hover:shadow-glow relative group overflow-hidden ${
                                isLastOdd ? 'md:col-span-2' : ''
                            }`}
                        >
                            <div className="absolute -left-16 -top-16 w-72 h-72 bg-base-button/15 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

                            <div className="card bg-background text-primary-text px-4 py-1.5 w-fit rounded-xl flex items-center gap-2 mb-6 shadow-sm border border-border relative z-10">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                </span>
                                <span className="text-sm font-medium tracking-wide">{category}</span>
                            </div>

                            <div className="flex flex-wrap gap-4 md:gap-6 relative z-10">
                                {categorySkills.map((sk) => (
                                    <div key={sk._id} className="relative flex flex-col items-center gap-2 group/icon transition-all duration-300">

                                        {devMode && (
                                            <div className="absolute -top-2 -right-2 flex gap-1 z-30 opacity-0 group-hover/icon:opacity-100 transition-opacity bg-background/90 p-1 rounded-lg border border-border backdrop-blur shadow-sm">
                                                <button onClick={() => startEditing(sk)} className="p-1 bg-blue-500 rounded-md text-white hover:scale-105 transition-transform">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" /></svg>
                                                </button>
                                                <button onClick={() => handleDeleteSkill(sk)} className="p-1 bg-red-500 rounded-md text-white hover:scale-105 transition-transform">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" /></svg>
                                                </button>
                                            </div>
                                        )}

                                        <div className="w-14 h-14 md:w-16 md:h-16 bg-background rounded-2xl flex items-center justify-center shadow-sm border border-border z-20 group-hover/icon:border-active-button text-primary-text transition-colors duration-300">
                                            {renderIcon(sk.icon)}
                                        </div>
                                        <p className="text-secondary-text text-xs md:text-sm font-medium group-hover/icon:text-active-button transition-colors duration-300">{sk.skillName}</p>
                                    </div>
                                ))}

                                {categorySkills.length === 0 && devMode && (
                                    <p className="text-secondary-text text-sm italic">No skills in this category yet.</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {(isAdding || isEditing) && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4">
                    <div className="bg-slate-950 border border-border p-6 md:p-8 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-primary-text">{isEditing ? 'Edit Skill' : 'Add New Skill'}</h2>
                            <button onClick={() => { setIsAdding(false); setIsEditing(false); resetForm(); }} className="text-secondary-text hover:text-red-500 transition-colors">✕</button>
                        </div>

                        <form onSubmit={isEditing ? (e) => handleEditSkill(e, editingId) : handleAddSkill} className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs md:text-sm text-secondary-text mb-1 block font-medium">Skill Name</label>
                                <input type="text" name="skillName" value={formData.skillName} onChange={handleChange} className="w-full bg-card border border-border rounded-lg p-2.5 md:p-3 text-primary-text focus:outline-none focus:border-active-button text-sm" required />
                            </div>

                            <div>
                                <label className="text-xs md:text-sm text-secondary-text mb-1 block font-medium">Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-card border border-border rounded-lg p-2.5 md:p-3 text-primary-text focus:outline-none focus:border-active-button text-sm" required>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs md:text-sm text-secondary-text mb-1 block font-medium">Icon (SVG Code or Image Path)</label>
                                <textarea name="icon" value={formData.icon} onChange={handleChange} rows="3" className="w-full bg-card border border-border rounded-lg p-2.5 md:p-3 text-primary-text focus:outline-none focus:border-active-button font-mono text-xs md:text-sm" placeholder="<svg>...</svg> or /assets/icon.png" required />
                            </div>

                            <div>
                                <label className="text-xs md:text-sm text-secondary-text mb-1 block font-medium">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full bg-card border border-border rounded-lg p-2.5 md:p-3 text-primary-text focus:outline-none focus:border-active-button text-sm" />
                            </div>

                            <div className="flex justify-end gap-3 mt-2 text-sm font-medium">
                                <button type="button" onClick={() => { setIsAdding(false); setIsEditing(false); resetForm(); }} className="px-4 py-2 rounded-lg border border-border text-primary-text hover:bg-card transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 rounded-lg bg-active-button hover:bg-base-button text-white transition-colors">
                                    {isEditing ? 'Save Changes' : 'Add Skill'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Skills;