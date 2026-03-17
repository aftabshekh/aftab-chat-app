"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
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
exports.default = router;
