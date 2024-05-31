const { ResponseMessage } = require("../../helpers/Response");
const { MarketIndices, Sequelize } = require("../../models");
const CONTRACT_INTERACTION = require("../../helpers/ContractInterraction");
const path = require("path");
const csv = require("csv-parser");
const { Readable } = require("stream");
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
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null); // No more data

      stream
        .pipe(csv())
        .on("data", (row) => {
          csv_data.push(row);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    for (let i = 0; i < csv_data.length; i++) {
      const __data = csv_data[i];

      await MarketIndices.create({ ...__data, type: 1 });
    }
    return ResponseMessage(
      res,
      true,
      200,
      "indices updated successfully",
      csv_data
    );
  } catch (error) {
    console.log(error.message);
    ResponseMessage(
      res,
      false,
      500,
      error.message ?? "Internal server error",
      {}
    );
  }
};

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
        createdAt: range
          ? {
              [Sequelize.Op.between]: [startDate, endDate], // Find records between start date and end date
            }
          : undefined,
      },
      order: [["createdAt", "ASC"]],
    });
    return ResponseMessage(res, true, 200, "Indices fetched", indices);
  } catch (error) {
    console.log(error);
    ResponseMessage(res, false, 500, "Internal server error", {});
  }
};

exports.getStats = async (_, res) => {
  try {
    const indices = await MarketIndices.findAll({
      distinct: true,
      where: {
        type: 1,
        marked: false,
      },
      order: [["createdAt", "DESC"]],
    });

    let data = [];

    for (let index = 0; index < indices.length; index++) {
      const element = indices[index];
      let findDuplicate = data.findIndex(
        (fd) => fd.estateId === element.estateId
      );
      if (findDuplicate === -1) {
        data.push(element);
      } else {
        data[findDuplicate] = {
          ...data[findDuplicate],
          indexValue: element.indexValue + data[findDuplicate].indexValue,
        };
      }
    }

    ResponseMessage(res, true, 200, "Indices fetched", {});
    if (data.length !== 0) {
      const mapped_data = data.map((mp) => ({
        id: mp.id,
        value: mp.indexValue,
      }));
      await CONTRACT_INTERACTION.bulkUpdate(mapped_data);
      await MarketIndices.update(
        {
          marked: true,
        },
        {
          where: {
            marked: false,
            type: 1,
          },
        }
      );
    }
  } catch (error) {
    console.log(error);
    ResponseMessage(res, false, 500, "Internal server error", {});
  }
};
