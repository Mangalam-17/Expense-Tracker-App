const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("Failed to connect MongoDB : ", err));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is running successfully !");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
