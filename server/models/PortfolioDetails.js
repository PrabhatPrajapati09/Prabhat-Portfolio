import mongoose from "mongoose";

const PortfolioDetails = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: "Prabhat Prajapati"
    },
    title: {
        type: String,
        required: true,
        defailt: "MERN Stack Developer"
    },
    about: {
        type: String,
        required: true,
        default: "Hello! I'm Prabhat, a passionate MERN stack developer focused on building scalable, full-stack web applications. I bridge the gap between seamless user interfaces and secure, efficient backend architecture.My expertise lies in designing databases with MongoDB, building fast APIs with Node.js and Express, and bringing responsive designs to life using React.js. I thrive in environments where I can take an idea from a rough concept all the way to deployment, ensuring clean code and a great user experience every step of the way."
    },
    primaryImage: {
        type: String,
        default: ""
    },
    secondaryImage: {
        type: String,
        default: ""
    },
    aboutTagline:{
        type: String,
        required: true,
        default: "Curious About Me, Here You Have It.."
    },
    completeAboutDesc: {
        type: String,
        default: ""
    },
    quickBits: {
        type: [String],
        default: ""
    },
    humour: {
        type: String,
        default: ""
    },
    resumeUrl: {
        type: String,
        default: ""
    },
    linkedInUrl: {
        type: String,
        required: true
    },
    githubUrl: {
        type: String,
        required: true
    },
    music: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }
})

export default mongoose.model("PortfolioDetails", PortfolioDetails);