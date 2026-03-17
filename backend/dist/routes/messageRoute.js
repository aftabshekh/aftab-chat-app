"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = require("../controllers/messageController");
const requireAuth_1 = __importDefault(require("../middlewares/requireAuth"));
const router = express_1.default.Router();
// ✅ protect all routes
router.use(requireAuth_1.default);
// ✅ send message
router.post("/", messageController_1.addMessage);
// ✅ get all messages between 2 users
router.get("/:senderId/:receiverId", messageController_1.getMessages);
// ✅ get last message
router.get("/lastMessage/:senderId/:receiverId", messageController_1.getLastMessage);
exports.default = router;
