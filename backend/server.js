const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const jobs = [
  {
    id: 1,
    company: "Google",
    position: "Frontend Developer",
    status: "Applied",
  },
  {
    id: 2,
    company: "Microsoft",
    position: "React Developer",
    status: "Interview Scheduled",
  },
  {
    id: 3,
    company: "Amazon",
    position: "Frontend Engineer",
    status: "Rejected",
  },
];

app.get("/jobs", (req, res) => {
  res.json(jobs);
});

app.post("/jobs", (req, res) => {
  try {
    const { company, position, status } = req.body;
    const validStatus = ["Applied","Interview Scheduled", "Rejected"];

    if (!company?.trim() || !position?.trim() || !status?.trim() || !validStatus.includes(status?.trim())) {
      return res.status(400).json({
        message: "All fields are required with proper values",
      });
    }

      const newJob = { ...req.body, id: crypto.randomUUID() };
      jobs.push(newJob);
      return res.status(201).json(newJob);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
