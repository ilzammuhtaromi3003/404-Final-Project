const express = require("express");
const cors = require("cors");
const router = require("./routes/index");
const path = require("path");
const app = express();

app.use(cors()); // Letakkan ini di sini
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(router);

app.use(
  cors({
    origin: "http://localhost:5173",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    optionsSuccessStatus: 200,
  })
);

app.listen(3000, () => {
  console.log("Server started at http://localhost:3000");
});
