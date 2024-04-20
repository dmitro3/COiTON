require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("./models");



const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("common"));
const server = app;
const PORT = 5000 || process.env.PORT
server.listen(PORT, async () => {
    sequelize.authenticate();
    console.log("server running on port ", PORT);

});
