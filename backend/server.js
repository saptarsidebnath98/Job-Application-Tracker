const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

let jobs = [
  {
    id: "1",
    company: "Google",
    position: "Frontend Developer",
    status: "Applied",
  },
  {
    id: "2",
    company: "Microsoft",
    position: "React Developer",
    status: "Interview Scheduled",
  },
  {
    id: "3",
    company: "Amazon",
    position: "Frontend Engineer",
    status: "Rejected",
  },
];

app.get("/jobs", (req, res) => {
  res.json(jobs);
});

const validateJob = (body) => {
  const { company, position, status } = body;
  const validStatus = ["Applied", "Interview Scheduled", "Rejected"];

  if (!company?.trim()) {
    return "Company is required";
  }

  if (!position?.trim()) {
    return "Position is required";
  }

  if (!status?.trim()) {
    return "Status is required";
  }

  if (!validStatus.includes(status.trim())) {
    return "Invalid status";
  }

  return null;
};

app.post("/jobs", (req, res) => {
  try {
    const error = validateJob(req.body);

    if (error) {
      return res.status(400).json({
        message: error,
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

app.delete("/jobs/:id", (req, res) => {
  try {
    const { id } = req.params;

    const initialLength = jobs.length;

    jobs = jobs.filter((job) => job.id !== id);
    if (jobs.length === initialLength) {
      return res.status(404).json({
        message: "Job Not Found!",
      });
    }

    return res.status(200).json({
      message: "Job deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.put("/jobs/:id", (req, res) => {
  try {
    const { id } = req.params;
    const index = jobs.findIndex((job) => job.id === id);

    if (index === -1) {
      return res.status(404).json({
        message: "Job Not Found!",
      });
    }

    const error = validateJob(req.body);

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    jobs[index] = { ...jobs[index], ...req.body };
    return res.status(200).json(jobs[index]);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
