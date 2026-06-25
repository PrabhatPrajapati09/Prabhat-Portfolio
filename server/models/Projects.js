import mongoose from "mongoose";

const Projects = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        default: ""
    },
    techStack: {
        type: [String],
        required: true,
        default: []
    },
    sourceCode: {
        type: String,
        default: ""
    },
    liveDemo: {
        type: String,
        default: ""
    }
},{
    timestamps: true
})

export default mongoose.model("Projects", Projects);