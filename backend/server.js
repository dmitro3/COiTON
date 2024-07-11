require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("./models");
const AppRoutes = require("./routes");
const axios = require("axios");
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("common"));
// const axios = require("axios");

app.get("/", (req, res) => {
  res.status(200).send("server running successfully");
});

app.get("/token/:chain/:address", async (req, res) => {
  try {
    const { chain, address } = req.params;

    const response = await axios.get(
      `https://public-api.dextools.io/trial/v2/token/${chain}/${address}`,
      {
        headers: {
          accept: "application/json",
          "x-api-key": req.headers["acceptx-api-key"],
        },
      }
    );
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.send({ statusCode: 400 });
  }
});

// app.get("/yo", async (req, res) => {
//   try {
//     const apiKey = process.env.API_KEY; // Your API key, securely managed
//     const data = {
//       model: "dall-e-2",
//       prompt: "a girl",
//       n: 1,
//       size: "1024x1024",
//     };
//     const headers = {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${apiKey}`,
//     };
//     const response = await axios.post(
//       "https://api.openai.com/v1/images/generations",
//       data,
//       {
//         headers,
//       }
//     );

//     res.status(200).send({ data: response.data.data[0] });
//   } catch (error) {
//     console.log(apiKeyyy);
//     console.log(error.message);
//     res.status(500).send(error);
//   }
// });

app.use("/api/v1", AppRoutes);
const server = app;
const PORT = 5000 || process.env.PORT;
server.listen(PORT, async () => {
  await sequelize.authenticate();
  console.log("Connected to database");
  console.log("server running on port ", PORT);
});
