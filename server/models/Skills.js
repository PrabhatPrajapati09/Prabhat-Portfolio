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
    description:{
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
})

export default mongoose.model("Skills", Skills);