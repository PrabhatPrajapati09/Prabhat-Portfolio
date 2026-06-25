import React, { useState, useEffect } from 'react'
import { useAdmin } from '../context/authContext';
import { projectsAPI, analyticsAPI } from '../utils/api';

const Projects = ({ projects, updateProjects }) => {
    const { devMode } = useAdmin();
    const [selectedProject, setSelectedProject] = useState(null);
    const [project, setProject] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState("All");

    const [formData, setFormData] = useState({
        title: "",
        date: "",
        image: "",
        description: "",
        techStack: "",
        sourceCode: "",
        liveDemo: ""
    });

    useEffect(() => {
        if (projects) {
            setProject(projects)
        } 
    }, [projects])

    const resetForm = () => {
        setFormData({
            title: "",
            date: "",
            image: "",
            description: "",
            techStack: "",
            sourceCode: "",
            liveDemo: ""
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const filteredProjects = project?.filter((pr) => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery ||
            pr.title?.toLowerCase().includes(lowerCaseQuery) ||
            pr.description?.toLowerCase().includes(lowerCaseQuery) ||
            pr.techStack?.some(tech => tech.toLowerCase().includes(lowerCaseQuery));

        let matchesCategory = true;
        if (activeCategory === "MERN") {
            matchesCategory = pr.techStack?.some(tech => tech.toLowerCase() === "mern");
        } else if (activeCategory === "Live") {
            matchesCategory = pr.liveDemo && pr.liveDemo !== "#";
        } else if (activeCategory === "Upcoming") {
            matchesCategory = !pr.liveDemo || pr.liveDemo === "#";
        }

        return matchesSearch && matchesCategory;
    });

    const getFormattedPayload = () => {
        return {
            ...formData,
            techStack: formData.techStack.split(',').map(t => t.trim()).filter(Boolean)
        };
    };

    const handleProjectsCardClick = async (targetProject) => {
        setSelectedProject(targetProject);
        try {
            await analyticsAPI.updateStat('projectClicks');
        } catch (error) {
            console.log("Failed to update project clicks counts", error.message);
        }
    }

    const handleAddProject = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        try {
            const payload = getFormattedPayload();
            const response = await projectsAPI.create(payload);
            updateProjects([...projects, response.newProject || response]);
            setIsAdding(false);
            resetForm();
        } catch (error) {
            alert("Project not added: " + (error.response?.data?.message || error.message));
        }
    }

    const handleEditProject = async (e, id) => {
        e.preventDefault();
        try {
            const payload = getFormattedPayload();
            const response = await projectsAPI.update(id, payload);
            updateProjects(project.map(pr => pr._id === id ? (response.project || response) : pr));
            setIsEditing(false);
            setEditingId(null);
            resetForm();
        } catch (error) {
            alert("Project not updated: " + (error.response?.data?.message || error.message));
        }
    }

    const handleDeleteProject = async (projectToDelete) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await projectsAPI.delete(projectToDelete._id);
            updateProjects(projects.filter(pr => pr._id !== projectToDelete._id));
        } catch (error) {
            alert("Project not deleted: " + (error.response?.data?.message || error.message));
        }
    }

    const startEditing = (projectToEdit) => {
        setEditingId(projectToEdit._id);
        setFormData({
            title: projectToEdit.title || "",
            date: projectToEdit.date || "",
            image: projectToEdit.image || "",
            description: projectToEdit.description || "",
            techStack: projectToEdit.techStack ? projectToEdit.techStack.join(', ') : "",
            sourceCode: projectToEdit.sourceCode || "",
            liveDemo: projectToEdit.liveDemo || ""
        });
        setIsEditing(true);
    }

    return (
        <div className='min-h-screen bg-background px-4 sm:px-8 py-16 flex flex-col justify-start items-center gap-8 relative w-full'>
            
            <div className="text-center z-10 max-w-3xl">
                <h1 className="text-4xl md:text-5xl text-primary-text font-bold mb-2">Projects Grid</h1>
                <p className="text-secondary-text text-base md:text-xl">Here are some of my projects on which I have been working on recently</p>
            </div>

            {devMode &&
                <div className="w-full max-w-6xl flex justify-end px-2 sm:px-4">
                    <button className="bg-disabled-button text-primary-text px-4 py-2 rounded-full flex items-center gap-2 hover:bg-card border border-border transition-all duration-300 shadow-md" onClick={() => setIsAdding(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Add Project
                    </button>
                </div>
            }

            <div className="w-full max-w-6xl">
                <div className="categories flex flex-col md:flex-row justify-between items-center gap-4 border-b border-border/50 pb-4">
                    
                    <div className="searchbar relative flex items-center w-full md:w-auto max-w-md">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="currentColor" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 text-secondary-text">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="M21 21L16.65 16.65"></path>
                        </svg>
                        <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border border-border rounded-lg pl-10 pr-4 py-2 text-primary-text transition-colors duration-300 focus:outline-none focus:border-active-button placeholder:text-secondary-text w-full md:w-64 text-sm" type="text" placeholder="Search by Keyword..." />
                    </div>

                    <div className="cats flex w-full md:w-auto justify-center md:justify-end">
                        <ul className="flex flex-wrap gap-2 text-sm text-secondary-text">
                            {['All', 'MERN', 'Live', 'Upcoming'].map((cat) => (
                                <li 
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`cursor-pointer px-4 py-1.5 rounded-xl transition-all duration-300 ${
                                        activeCategory === cat 
                                        ? 'bg-active-button text-white shadow-md' 
                                        : 'ring-1 ring-border hover:text-primary-text hover:ring-active-button'
                                    }`}
                                >
                                    {cat}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8 justify-items-center">
                    
                    {filteredProjects.length === 0 && (
                        <div className='col-span-full text-center text-secondary-text py-12'>
                            <p className="text-lg font-medium">No projects found matching your selection.</p>
                        </div>
                    )}

                    {filteredProjects?.map((pr) => (
                        <div
                            key={pr.id || pr._id}
                            className="project flex flex-col bg-card rounded-2xl p-4 border border-border transition-all duration-300 hover:scale-[1.02] hover:shadow-glow hover:-translate-y-2 w-full max-w-[340px] h-full relative group overflow-hidden"
                        >
                            <div className="absolute -left-16 -top-16 w-52 h-52 bg-active-button/15 blur-[45px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>

                            {devMode && (
                                <div className="absolute top-6 right-6 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 p-1.5 rounded-xl border border-border backdrop-blur">
                                    <button onClick={(e) => { e.stopPropagation(); startEditing(pr); }} className="p-1.5 bg-blue-500 rounded-lg text-white hover:scale-105 transition-transform shadow">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" /></svg>
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(pr); }} className="p-1.5 bg-red-500 rounded-lg text-white hover:scale-105 transition-transform shadow">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" /></svg>
                                    </button>
                                </div>
                            )}

                            <div onClick={() => handleProjectsCardClick(pr)} className="cursor-pointer h-full flex flex-col relative z-10">
                                <img src={pr.image || "/assets/default_project.jpg"} className="w-full aspect-video object-cover rounded-xl mb-4 bg-background border border-border/30" alt={pr.title} />
                                <h2 className="text-xl text-primary-text font-bold border-t border-border/50 pt-2 line-clamp-1">{pr.title}</h2>
                                <p className="text-secondary-text text-[11px] font-medium mb-2">{pr.date}</p>
                                <p className="text-secondary-text text-xs md:text-sm font-medium mb-4 line-clamp-4 leading-relaxed flex-grow">{pr.description}</p>

                                <div className="tech flex flex-wrap gap-1.5 mt-auto pt-2">
                                    {pr.techStack?.map((t, index) => (
                                        <p key={index} className="text-secondary-text text-[10px] font-medium border border-border px-2 py-0.5 rounded-md bg-background/50">{t}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setSelectedProject(null)}>
                    <div className="bg-card w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-5 md:p-6 border border-border shadow-2xl relative flex flex-col gap-4 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 text-secondary-text hover:text-primary-text transition-colors bg-background p-2 rounded-full border border-border">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="currentColor" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L6 18M6 6l12 12"></path>
                            </svg>
                        </button>

                        <img src={selectedProject.image || "/assets/default_project.jpg"} alt={selectedProject.title} className="w-full rounded-xl object-cover border border-border max-h-[320px] bg-background" />

                        <div>
                            <h2 className="text-2xl md:text-3xl text-primary-text font-bold">{selectedProject.title}</h2>
                            <p className="text-active-button text-xs font-semibold mt-1">{selectedProject.date}</p>
                        </div>

                        <p className="text-secondary-text text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                            {selectedProject.description}
                        </p>

                        <div className="tech flex flex-wrap gap-2 my-1">
                            {selectedProject.techStack?.map((t, index) => (
                                <p key={index} className="text-primary-text bg-background text-xs font-medium border border-border px-2.5 py-1 rounded-md">
                                    {t}
                                </p>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-2 pt-4 border-t border-border">
                            {selectedProject.sourceCode && (
                                <a href={selectedProject.sourceCode} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-background text-primary-text border border-border hover:border-active-button hover:text-active-button py-2.5 rounded-xl text-sm transition-all duration-300">
                                    Source Code
                                </a>
                            )}
                            {selectedProject.liveDemo && selectedProject.liveDemo !== "#" ? (
                                <a href={selectedProject.liveDemo} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-active-button text-white py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-md">
                                    Launch Demo
                                </a>
                            ) : (
                                <div className="flex-1 flex items-center justify-center gap-2 bg-card text-secondary-text py-2.5 rounded-xl text-sm border border-border cursor-not-allowed">
                                    Not Live Yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {(isEditing || isAdding) && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
                    <div className="bg-slate-950 border border-border p-6 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-primary-text">{isEditing ? 'Edit Project' : 'Add New Project'}</h2>
                            <button onClick={() => { setIsAdding(false); setIsEditing(false); resetForm(); }} className="text-secondary-text hover:text-red-500 transition-colors">✕</button>
                        </div>

                        <form onSubmit={(e) => isEditing ? handleEditProject(e, editingId) : handleAddProject(e)} className='flex flex-col gap-3 text-sm'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                <div>
                                    <label className="text-xs text-secondary-text mb-1 block">Project Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-primary-text focus:outline-none focus:border-active-button text-xs" placeholder="Project Name" required />
                                </div>
                                <div>
                                    <label className="text-xs text-secondary-text mb-1 block">Project Date</label>
                                    <input type="text" name="date" value={formData.date} onChange={handleChange} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-primary-text focus:outline-none focus:border-active-button text-xs" placeholder="e.g. Feb 2026" />
                                </div>
                            </div>

                            <div>
                                <label className='text-xs text-secondary-text mb-1 block'>Project Image URL</label>
                                <div className="flex gap-2 items-center">
                                    <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-primary-text focus:outline-none focus:border-active-button text-xs" placeholder="/assets/image.png or URL" required />
                                    {formData.image && (
                                        <img src={formData.image} alt="Preview" className="w-8 h-8 object-cover rounded border border-border bg-background" />
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className='text-xs text-secondary-text mb-1 block'>Project Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-primary-text focus:outline-none focus:border-active-button resize-none h-20 text-xs" placeholder="Describe the application scope..." required></textarea>
                            </div>

                            <div>
                                <label className='text-xs text-secondary-text mb-1 block'>Tech Stack</label>
                                <input type="text" name="techStack" value={formData.techStack} onChange={handleChange} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-primary-text focus:outline-none focus:border-active-button text-xs" placeholder='React, Node, MongoDB' required />
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                                <div>
                                    <label className='text-xs text-secondary-text mb-1 block'>Source Code Link</label>
                                    <input type="text" name="sourceCode" value={formData.sourceCode} onChange={handleChange} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-primary-text focus:outline-none focus:border-active-button text-xs" placeholder="https://github.com..." />
                                </div>
                                <div>
                                    <label className='text-xs text-secondary-text mb-1 block'>Live Link</label>
                                    <input type="text" name="liveDemo" value={formData.liveDemo} onChange={handleChange} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-primary-text focus:outline-none focus:border-active-button text-xs" placeholder="https://..." />
                                </div>
                            </div>

                            <div className='flex justify-end gap-3 mt-3'>
                                <button type="button" onClick={() => { setIsAdding(false); setIsEditing(false); resetForm(); }} className="px-4 py-1.5 bg-card border border-border text-primary-text rounded-md text-xs transition">Cancel</button>
                                <button type="submit" className="px-4 py-1.5 bg-active-button text-white rounded-md text-xs transition">{isEditing ? 'Save' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Projects;