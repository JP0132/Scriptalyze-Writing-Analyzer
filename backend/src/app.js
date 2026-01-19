const express = require("express");
const cors = require("cors");
const analysisRoutes = require("./routes/analysisRoutes");

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Register Routes
app.use("/api", analysisRoutes);

module.exports = app;
