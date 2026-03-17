"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessage = addMessage;
exports.getMessages = getMessages;
exports.getLastMessage = getLastMessage;
const messageModel_1 = __importDefault(require("../models/messageModel"));
// ✅ SEND MESSAGE
function addMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { text, image, audio, senderId, receiverId } = req.body;
        try {
            const message = yield messageModel_1.default.create({
                text,
                image,
                audio,
                senderId,
                receiverId,
            });
            res.status(200).json(message);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
// ✅ GET ALL MESSAGES (CLEAN QUERY)
function getMessages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { senderId, receiverId } = req.params;
        try {
            const chats = yield messageModel_1.default.find({
                $or: [
                    { senderId, receiverId },
                    { senderId: receiverId, receiverId: senderId },
                ],
            }).sort({ createdAt: 1 });
            res.status(200).json(chats);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
// ✅ GET LAST MESSAGE
function getLastMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { senderId, receiverId } = req.params;
        try {
            const lastMessage = yield messageModel_1.default.findOne({
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
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
}
