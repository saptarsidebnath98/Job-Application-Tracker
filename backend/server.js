require("dotenv").config();


const db = require("./db");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/authMiddleware.js');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
  }));
app.use(express.json());

const VALID_STATUSES = [
  "Applied",
  "Interview Scheduled",
  "Rejected"
];


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

//jobs
app.get("/jobs", authMiddleware, async (req, res) => {
  try {
    let sqlCommand = `SELECT * FROM jobs WHERE user_id = ?`
    const dbQueryArr = [req.userId];

    const validQueryKeys = ["search", "status"];
    Object.entries(req.query).forEach(([key, value]) => {
      if (validQueryKeys.includes(key)) {
        if (key === "search") {
          sqlCommand += ` AND company LIKE ? `;
          dbQueryArr.push(`%${value}%`);
        } else {
          sqlCommand += ` AND ${key} = ? `;
          dbQueryArr.push(`${value}`);
        }
      }
    });

    const [rows] = await db.query(sqlCommand , dbQueryArr);
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

app.post("/jobs", authMiddleware,  async (req, res) => {
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
  (id, company, position, status, user_id)
  VALUES (?, ?, ?, ?, ?)
  `,
  [id, company, position, status, req.userId]
);
return res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.delete("/jobs/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM jobs WHERE id = ? AND user_id = ?", [id, req.userId]);

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

app.put("/jobs/:id", authMiddleware, async (req, res) => {
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
      WHERE id = ? AND user_id = ? ;`, [company, position, status, id, req.userId]);

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

//register
const validateUserForRegister = (body) => {
  const { name, email, password } = body;

  if (!name?.trim()) {
    return "Name is required";
  }

  if (!email?.trim()) {
    return "Email is required";
  }

  if (!password?.trim()) {
    return "Password is required";
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (email && !emailRegex.test(email)) {
    return "Invalid email format";
  }

  if(password && password.length < 8){
    return "Password length must be 8 or above";
  }

  return null;
}

app.post("/register", async (req, res) => {
  try {
    const error = validateUserForRegister(req.body);

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }
const { name, email, password } = req.body;
const [rows] = await db.query(
  `
SELECT * FROM users 
WHERE email = ?
  `,
  [email]
);

if(rows.length > 0){
  return res.status(409).json({
    message: "Email already exists"
  })
}
const hashedPassword = await bcrypt.hash(password, 10);
await db.query(
  ` 
  INSERT INTO users
  (name, email, password)
  VALUES (?, ?, ?)
  `,[name, email, hashedPassword])
return res.status(201).json({
  message : "User registered successfully!"
});
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }

})

//login
const validateUserForLogin = (body) => {
  const {email, password} = body;

  if(!email?.trim()){
    return "Email is required"
  }

  if(!password?.trim()){
    return "Password is required"
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (email && !emailRegex.test(email)) {
    return "Invalid email format";
  }

  if(password && password.length < 8){
    return "Password length must be 8 or above";
  }
  return null;

}

app.post("/login",async(req, res) => {
    try {
    const error = validateUserForLogin(req.body);

    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    const {email, password} = req.body;

    const [rows] = await db.query(`
      SELECT * FROM users
      WHERE email = ?
      `, [email]);

    if(rows.length === 0){
      return res.status(401).json({
        message: "Invalid email or password"
      })
    }

    const {password : dbPassword} = rows[0];

    const isUser = await bcrypt.compare(password, dbPassword);

    if(!isUser){
      return res.status(401).json({
        message: "Invalid email or password"
      })
    }

    const {id} = rows[0];

    const secretKey = process.env.JWT_SECRET;

    const payload = {id};

    const token = jwt.sign(payload, secretKey, { expiresIn: '30d' });
    
    return res.status(200).json({
      token
    })
      
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      })
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
