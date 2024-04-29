const { ResponseMessage } = require("../../helpers/Response");
const { MarketIndices, Sequelize } = require("../../models");
const fs = require("fs");
exports.make = async (req, res) => {
    try {
        const buffer = req.file.buffer;
        const fileExtension = path.extname(req.file?.originalname);

        if (fileExtension && fileExtension !== ".csv") {
            console.error("Invalid file format. Please upload an csv file.");
            return ResponseMessage(res, false, 400, "Invalid file format.", {});
        }

        let csv_data = [];
        // Read the CSV file and store the data in an array
        await new Promise((resolve, reject) => {
            fs.createReadStream(buffer)
                .pipe(csv())
                .on("data", (row) => {
                    csv_data.push(row);
                })
                .on("end", resolve)
                .on("error", reject);
        });


        for (let i = 0; i < csv_data.length; i++) {
            const __data = csv_data[i];
            const indices = await MarketIndices.findOne({
                where: {
                    estateId: __data.estateId,
                }
            });

            if (indices) {
                const indexValue = (indices.indexValue) + ((indices.indexValue * __data.priceChange) / 100)
                await MarketIndices.create({ ...data, indexValue })
            }
        }
        // const data = req.body;
        // const newIndices = await MarketIndices.create(data);
        return ResponseMessage(res, true, 200, "indices updated successfully", csv_data);
    } catch (error) {
        console.log(error.message)
        ResponseMessage(res, false, 500, error.message ?? "Internal server error", {});
    }
}


exports.getIndices = async (req, res) => {
    try {
        const { range } = req.query;
        const { id } = req.params;
        const startDate = new Date(range);
        const endDate = new Date();
        const indices = await MarketIndices.findAndCountAll({
            distinct: true,
            where: {
                estateId: id,
                createdAt: range ? {
                    [Sequelize.Op.between]: [startDate, endDate] // Find records between start date and end date
                } : undefined
            },
            order: [["createdAt", "ASC"]],
        });
        return ResponseMessage(res, true, 200, "Indices fetched", indices);
    } catch (error) {
        console.log(error)
        ResponseMessage(res, false, 500, "Internal server error", {});
    }
}


