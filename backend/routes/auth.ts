import express from "express";

const router = express.Router();

// ✅ LOGIN API
router.post("/login", (req, res) => {
  res.json({
    message: "Login route working ✅"
  });
});

// ✅ REGISTER API
router.post("/register", (req, res) => {
  res.json({
    message: "Register route working ✅"
  });
});

export default router;