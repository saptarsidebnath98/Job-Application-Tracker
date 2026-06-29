
require("dotenv").config();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {

    const authHeader = req.headers?.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    const token = authHeader.replace("Bearer ","");

    const {id: userId} = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = userId;
    console.log(userId);
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = authMiddleware; 