import mongoose from "mongoose";

const Analytics = new mongoose.Schema({
    key: {
        type: String,
        default: "analytics",
        unique: true
    },
    pageViews: {
        type: Number,
        default: 0
    },
    resumeDownloads: {
        type: Number,
        default: 0
    },
    projectClicks: {
        type: Number,
        default: 0
    },
    contactMails: {
        type: Number,
        default: 0
    },
    portfolioLikes: {
        type: Number,
        default: 0
    }
}, { timestamps : true })

export default mongoose.model("Analytics", Analytics);