import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;
const frontendDist = path.join(__dirname, "frontend", "dist");

app.use(express.json());
app.use(express.static(frontendDist));

// Save prediction data (for project marks)
app.post("/save", (req, res) => {
  let data = [];

  try {
    data = JSON.parse(fs.readFileSync(path.join(__dirname, "db.json")));
  } catch {}

  data.push(req.body);

  fs.writeFileSync(path.join(__dirname, "db.json"), JSON.stringify(data, null, 2));
  res.send({ message: "Saved successfully" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

app.listen(port, () =>
  console.log(`🌱 EcoVision running at http://localhost:${port}`)
);
