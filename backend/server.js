require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("./models");
const AppRoutes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.status(200).send("server running successfully");
});

app.use("/api/v1", AppRoutes);
const server = app;
const PORT = 5000 || process.env.PORT;
server.listen(PORT, async () => {
  await sequelize.authenticate();
  console.log("Connected to database");
  console.log("server running on port ", PORT);
});
