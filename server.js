import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Save prediction data (for project marks)
app.post("/save", (req, res) => {
  let data = [];

  try {
    data = JSON.parse(fs.readFileSync("db.json"));
  } catch {}

  data.push(req.body);

  fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
  res.send({ message: "Saved successfully" });
});

app.listen(3000, () =>
  console.log("🌱 EcoVision running at http://localhost:3000")
);