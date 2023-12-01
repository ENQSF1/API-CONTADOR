const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
app.set("port", process.env.PORT || 3000);

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

let jsonData = process.env.JSON_DATA ? JSON.parse(process.env.JSON_DATA) : [];

app.get("/api/json", (req, res) => {
  res.json(jsonData);
});

app.post("/api/json", (req, res) => {
  const newItem = req.body;
  newItem.id = jsonData.length + 1;

  jsonData.push(newItem);
  process.env.JSON_DATA = JSON.stringify(jsonData);
  res.status(201).json(newItem);
});

app.delete("/api/json", (req, res) => {
  jsonData = [];
  delete process.env.JSON_DATA;
  res.json({ message: "Todos los elementos JSON han sido eliminados" });
});

app.listen(app.get("port"), () => {
  console.log(`server on port ${app.get("port")}`);
});
