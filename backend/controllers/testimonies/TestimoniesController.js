const { ResponseMessage } = require("../../helpers/Response");
const { Testimonies } = require("../../models");

exports.createTestimony = async (req, res) => {
    try {
        const data = req.body;
        delete data.approved;
        const newTestimony = await Testimonies.create(data);
        return ResponseMessage(res, true, 200, "Testimony created successfully", newTestimony);
    } catch (error) {
        console.log(error.message)
        ResponseMessage(res, false, 500, error.message ?? "Internal server error", {});
    }
}


exports.getAllTestimonies = async (req, res) => {
    try {
        const { page, size } = req.query;
        const testimonies = await Testimonies.findAndCountAll({
            distinct: true,
            limit: size ?? 50,
            offset: (page ?? 0) * (size ?? 50),
            order: [["createdAt", "ASC"]],
        })
        return ResponseMessage(res, true, 200, "Testimonies fetched", testimonies);
    } catch (error) {
        console.log(error)
        ResponseMessage(res, false, 500, "Internal server error", {});
    }
}


exports.getApprovedTestimonies = async (req, res) => {
    try {
        const { page, size } = req.query;
        const testimonies = await Testimonies.findAndCountAll({
            distinct: true,
            where: {
                approved: true
            },
            limit: size ?? 50,
            offset: (page ?? 0) * (size ?? 50),
            order: [["createdAt", "DESC"]],
        })
        return ResponseMessage(res, true, 200, "Testimonies fetched", testimonies);
    } catch (error) {
        console.log(error)
        ResponseMessage(res, false, 500, "Internal server error", {});
    }
}

exports.approveTestimony = async (req, res) => {
    try {
        const { id } = req.params;
        const testimony = await Testimonies.findByPk(id);
        if (testimony) {
            await testimony.update({ approved: true });
        }
        return ResponseMessage(res, true, 200, "Testimony updated", testimony);
    } catch (error) {
        console.log(error)
        ResponseMessage(res, false, 500, error.message ?? "Internal server error", {});
    }
}

exports.deleteTestimony = async (req, res) => {
    try {
        const { id } = req.params;
        const testimony = await Testimonies.findByPk(id);
        if (testimony) {
            await testimony.destroy();
        }
        return ResponseMessage(res, true, 200, "Testimony deleted", testimony);
    } catch (error) {
        console.log(error)
        ResponseMessage(res, false, 500, error.message ?? "Internal server error", {});
    }
}