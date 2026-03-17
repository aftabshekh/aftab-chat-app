import express from "express";
import {
  addMessage,
  getLastMessage,
  getMessages,
} from "../controllers/messageController";
import requireAuth from "../middlewares/requireAuth";

const router = express.Router();

// ✅ protect all routes
router.use(requireAuth);

// ✅ send message
router.post("/", addMessage);

// ✅ get all messages between 2 users
router.get("/:senderId/:receiverId", getMessages);

// ✅ get last message
router.get("/lastMessage/:senderId/:receiverId", getLastMessage);

export default router;