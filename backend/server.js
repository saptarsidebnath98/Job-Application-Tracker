const express = require("express");

const app = express();

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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});