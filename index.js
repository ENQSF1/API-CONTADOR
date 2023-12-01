const express = require("express");
const fs = require("fs/promises"); // Módulo fs para trabajar con el sistema de archivos de forma asíncrona
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

const JSON_FILE_PATH = "data.json"; // Nombre del archivo JSON

// Función para cargar datos desde el archivo JSON
async function loadJsonData() {
  try {
    const data = await fs.readFile(JSON_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Función para guardar datos en el archivo JSON
async function saveJsonData(data) {
  await fs.writeFile(JSON_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

let jsonData;

// Cargar datos al iniciar la aplicación
loadJsonData().then((data) => {
  jsonData = data;
});

app.get("/api/json", (req, res) => {
  res.json(jsonData);
});

app.post("/api/json", async (req, res) => {
  const newItem = req.body;
  newItem.id = jsonData.length + 1;

  jsonData.push(newItem);

  // Guardar los datos actualizados en el archivo JSON
  await saveJsonData(jsonData);

  res.status(201).json(newItem);
});

app.delete("/api/json", async (req, res) => {
  jsonData = [];

  // Limpiar el archivo JSON al eliminar todos los elementos
  await saveJsonData(jsonData);

  res.json({ message: "Todos los elementos JSON han sido eliminados" });
});

app.listen(app.get("port"), () => {
  console.log(`server on port ${app.get("port")}`);
});
