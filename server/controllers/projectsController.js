import Projects from "../models/Projects.js";

export const getProjects = async (req, res) => {
    try {
        const projects = await Projects.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addProject = async (req, res) => {
    try {
        const { title, date, description, image, techStack, sourceCode, liveDemo } = req.body;

        if (!title || !description || !image || !techStack) {
            return res.status(400).json({ message: "Title, Description, Image and Tech Stack are required" });
        }

        const newProject = new Projects({
            title,
            date,
            description,
            image,
            techStack: Array.isArray(techStack) ? techStack : [],
            sourceCode,
            liveDemo
        });

        await newProject.save();

        return res.status(200).json({ project: newProject, message: "Project added successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, description, image, techStack, sourceCode, liveDemo } = req.body;

        const project = await Projects.findById(id);
        if(!project){
            return res.status(404).json({message: "Project not found"});
        }

        if(title !== undefined) project.title = title;
        if(date !== undefined) project.date = date;
        if(description !== undefined) project.description = description;
        if(image !== undefined) project.image = image;
        if(techStack !== undefined) project.techStack = Array.isArray(techStack) ? techStack : [];
        if(sourceCode !== undefined) project.sourceCode = sourceCode;
        if(liveDemo !== undefined) project.liveDemo = liveDemo;

        await project.save();
        return res.status(200).json({project, message: "Project updated successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Projects.findByIdAndDelete(id);

        if(!project){
            return res.status(404).json({message: "Project not found"});
        }

        return res.status(200).json({message: "Project deleted successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}