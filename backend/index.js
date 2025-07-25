const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const fontRouter = require("./routes/font.route");
const fontGroupRouter = require("./routes/fontGroup.route");

const app = express();

dotenv.config();

// const corsOptions = {
//     origin: "http://localhost:5173",
//     credentials: true,
// };

// app.use(cors(corsOptions));

app.use(cors({ origin: "*" }));

app.use(express.json()); // Parses data as JSON
app.use(express.text()); // Parses data as text
app.use(express.urlencoded({ extended: true })); // Parses data as urlencoded

// checks invalid json file
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ message: "invalid json file" });
  }
  next();
});

const PORT = process.env.PORT || 3005;

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/fonts", fontRouter);
app.use("/fonts/groups", fontGroupRouter);

// ✅ Default Route
app.get("/", (req, res) => {
  return res.status(200).send({
    name: "zepto apps task 1 backend",
    developer: "Abir",
    version: "1.0.0",
    description: "Backend server for zepto apps task 1",
    status: "success",
  });
});

// Route to handle all other invalid requests
app.use((req, res) => {
  return res.status(400).send({ message: "Route doesnt exist" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
