import mongoose from "mongoose";

const Skills = new mongoose.Schema({
    skillName: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    topics: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    proficiency: {
        type: Number,
        default: 50
    }
})

export default mongoose.model("Skills", Skills);