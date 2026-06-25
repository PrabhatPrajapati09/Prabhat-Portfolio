import PortfolioDetails from "../models/PortfolioDetails.js";
import Analytics from "../models/Analytics.js";

export const getPortfolioDetails = async (req, res) => {
    try {
        let details = await PortfolioDetails.findOne();
        if(!details){
            details = await PortfolioDetails.create({});
        }

        await Analytics.findOneAndUpdate({ key: "analytics" }, { $inc: { pageViews: 1 }}, { upsert: true, new: true});

        res.status(200).json(details);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePortfolioDetails = async (req, res) => {
    try {
        let details = await PortfolioDetails.findOne();
        if(!details){
            details = new PortfolioDetails(req.body);
        } else {
            Object.assign(details, req.body);
        }

        await details.save()

        res.status(200).json({details, message: "Portfolio details updated successfully"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
