import Analytics from "../models/Analytics.js";

export const getAnalytics = async (req, res) => {
    try {
        let analytics = await Analytics.findOne({ key: "analytics" });
        if (!analytics) {
            analytics = await Analytics.create({ key: "analytics" })
        }
        return res.status(200).json({
            pageViews: analytics.pageViews,
            resumeDownloads: analytics.resumeDownloads,
            projectClicks: analytics.projectClicks,
            contactMails: analytics.contactMails,
            portfolioLikes: analytics.portfolioLikes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPublicAnalytics = async (req, res) => {
    try {
        const analytics = await Analytics.findOne({ key: "analytics" });

        return res.status(200).json({
            pageViews: analytics.pageViews,
            portfolioLikes: analytics.portfolioLikes
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const updateStats = async (req, res) => {
    const { statType } = req.body;
    if (!statType) {
        return res.status(400).json({ message: "Stat type is required" });
    }

    try {
        let updateStat = {};
        if (statType === "pageViews") {
            updateStat = { $inc: { pageViews: 1 } };
        } else if (statType === "resumeDownloads") {
            updateStat = { $inc: { resumeDownloads: 1 } };
        } else if (statType === "projectClicks") {
            updateStat = { $inc: { projectClicks: 1 } };
        } else if (statType === "contactMails") {
            updateStat = { $inc: { contactMails: 1 } };
        } else if (statType === "portfolioLikes") {
            updateStat = { $inc: { portfolioLikes: 1 } };
        } else {
            return res.status(400).json({ message: "Invalid stat type" });
        }

        const analytics = await Analytics.findOneAndUpdate({ key: "analytics" }, updateStat, { upsert: true, new: true });
        return res.status(200).json({ analytics, message: "Stat Updated Successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}