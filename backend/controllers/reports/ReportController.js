const { ResponseMessage } = require("../../helpers/Response");
const { Report } = require("../../models");

exports.createReport = async (req, res) => {
    try {
        const data = req.body;
        const newReport = await Report.create(data);
        return ResponseMessage(res, true, 200, "Report created successfully", newReport);
    } catch (error) {
        console.log(error.message)
        ResponseMessage(res, false, 500, error.message ?? "Internal server error", {});
    }
}


exports.getReports = async (req, res) => {
    try {
        const { page, size } = req.query;
        const reports = await Report.findAndCountAll({
            distinct: true,
            limit: size ?? 50,
            offset: (page ?? 0) * (size ?? 50),
            order: [["createdAt", "ASC"]],
        })
        return ResponseMessage(res, true, 200, "Reports fetched", reports);
    } catch (error) {
        console.log(error)
        ResponseMessage(res, false, 500, "Internal server error", {});
    }
}


exports.deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await Report.findByPk(id);
        if (report) {
            await report.destroy();
        }
        return ResponseMessage(res, true, 200, "Report deleted", report);
    } catch (error) {
        console.log(error)
        ResponseMessage(res, false, 500, error.message ?? "Internal server error", {});
    }
}