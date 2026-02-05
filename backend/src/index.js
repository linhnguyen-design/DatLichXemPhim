const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🎬 Welcome to DatLichXemPhim API!");
});

app.listen(5000, () => {
  console.log("🚀 Server đang chạy tại http://localhost:5000");
});
