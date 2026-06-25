import Skills from "../models/Skills.js";

export const getSkills = async (req, res) => {
    try {
        const skills = await Skills.find();
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addSkill = async (req, res) => {
    try {
        const { skillName, icon, description, category } = req.body;

        if (!skillName || !category || !description) {
            return res.status(400).json({ message: "Skill Name, Category and Description are required" });
        }

        const skill = new Skills({ skillName, icon, description, category });
        await skill.save();
        return res.status(200).json({ newSkill: skill, message: "Skill added successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const { skillName, icon, description, category } = req.body;

        const skill = await Skills.findById(id);
        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }

        if( skillName !== undefined ) skill.skillName = skillName;
        if (icon !== undefined) skill.icon = icon;
        if (description !== undefined) skill.description = description;
        if (category !== undefined) skill.category = category;

        await skill.save();
        return res.status(200).json({ skill, message: "Skill updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const skill = await Skills.findByIdAndDelete(id);

        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }

        return res.status(200).json({ message: "Skill deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}