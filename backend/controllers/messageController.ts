import { Request, Response } from "express";
import Message from "../models/messageModel";

// ✅ SEND MESSAGE
export async function addMessage(req: Request, res: Response) {
  const { text, image, audio, senderId, receiverId } = req.body;

  try {
    const message = await Message.create({
      text,
      image,
      audio,
      senderId,
      receiverId,
    });

    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

// ✅ GET ALL MESSAGES (CLEAN QUERY)
export async function getMessages(req: Request, res: Response) {
  const { senderId, receiverId } = req.params;

  try {
    const chats = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

// ✅ GET LAST MESSAGE
export async function getLastMessage(req: any, res: Response) {
  const { senderId, receiverId } = req.params;

  try {
    const lastMessage = await Message.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
      .sort({ createdAt: -1 })
      .select("text image audio senderId");

    if (!lastMessage) {
      return res.status(200).json(null);
    }

    // ✅ MEDIA CHECK
    if (!lastMessage.text && (lastMessage.image || lastMessage.audio)) {
      return res.status(200).json({ text: "media-alt-send" });
    }

    res.status(200).json(lastMessage);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}