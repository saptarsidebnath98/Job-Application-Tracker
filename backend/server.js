const VALID_STATUSES = [
  "Applied",
  "Interview Scheduled",
  "Rejected"
];

const db = require("./db");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());



(async () => {
  try {
    await db.query("SELECT 1");
    console.log("Database Connected ✅");
  } catch (error) {
    console.error(error);
  }
})();

app.get("/", (req, res) => {
  res.send("Backend is running!");
});


app.get("/jobs", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM jobs");
    return res.json(rows)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
});

const validateJob = (body) => {
  const { company, position, status } = body;

  if (!company?.trim()) {
    return "Company is required";
  }

  if (!position?.trim()) {
    return "Position is required";
  }

  if (!status?.trim()) {
    return "Status is required";
  }

  if (!VALID_STATUSES.includes(status.trim())) {
    return "Invalid status";
  }

  return null;
};

app.post("/jobs", async (req, res) => {
  try {
    const error = validateJob(req.body);

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    const newJob = {
  ...req.body,
  id: crypto.randomUUID()
};

const { id, company, position, status } = newJob;

await db.query(
  `
  INSERT INTO jobs
  (id, company, position, status)
  VALUES (?, ?, ?, ?)
  `,
  [id, company, position, status]
);
return res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.delete("/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM jobs WHERE id = ?", [id]);

    if(result.affectedRows === 0){
      return res.status(404).json({
    message: "Job Not Found!"
  })
    }

    return res.status(200).json({
      message: "Job deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.put("/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const error = validateJob(req.body);

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }
    const { company, position, status } = req.body;

    const [updatedResult] = await db.query(
      `UPDATE jobs 
      SET company = ?, position = ?, status = ?
      WHERE id = ?;`, [company, position, status, id]);

    if(updatedResult.affectedRows === 0){
      return res.status(404).json({
    message: "Job Not Found!"
    })
    }

    return res.status(200).json({id, ...req.body});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
