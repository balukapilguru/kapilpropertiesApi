const express = require("express");
require("dotenv").config();
require("./models");
const db = require("./models");
const otpRoutes = require("./routes/otpRoutes");
const mailRoutes = require("./routes/mailRoute");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use("/api/otp", otpRoutes);
app.use("/api/mail", mailRoutes);

db.sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully.");
  })
  .catch((err) => {
    console.error("Error syncing database:", err.message);
  });

// Start the server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
