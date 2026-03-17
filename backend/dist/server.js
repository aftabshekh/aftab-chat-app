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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
// routes
const auth_1 = __importDefault(require("./routes/auth"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const userFriendRoute_1 = __importDefault(require("./routes/userFriendRoute"));
const messageRoute_1 = __importDefault(require("./routes/messageRoute"));
dotenv_1.default.config();
mongoose_1.default.set("strictQuery", false);
class Connection {
    constructor() {
        this.app = (0, express_1.default)();
        this.server = http_1.default.createServer(this.app);
        // ✅ 🔥 SOCKET.IO CORS (FINAL FIX)
        this.io = new socket_io_1.Server(this.server, {
            cors: {
                origin: true, // ✅ IMPORTANT (auto allow)
                credentials: true
            }
        });
        this.activeUsers = [];
    }
    test() {
        this.app.get("/", (req, res) => {
            res.status(200).json({
                message: "Aftab Chat API Running 🚀"
            });
        });
    }
    useMiddleWares() {
        this.app.use(express_1.default.json({ limit: "50mb" }));
        // ✅ 🔥 EXPRESS CORS (FINAL FIX)
        this.app.use((0, cors_1.default)({
            origin: true, // ✅ auto allow all origins
            credentials: true
        }));
    }
    initializeRoutes() {
        this.app.use("/api/auth", auth_1.default);
        this.app.use("/api/user", userRoute_1.default);
        this.app.use("/api/friend", userFriendRoute_1.default);
        this.app.use("/api/message", messageRoute_1.default);
    }
    initSocketConnection() {
        this.io.on("connection", (socket) => {
            console.log("🔥 User connected:", socket.id);
            // ✅ Add user
            socket.on("add-new-user", (userId) => {
                if (!this.activeUsers.find((user) => user.userId === userId) &&
                    userId) {
                    this.activeUsers.push({
                        userId,
                        socketId: socket.id
                    });
                }
                this.io.emit("get-online-users", this.activeUsers);
            });
            // ✅ Send message
            socket.on("send-message", (data) => {
                const user = this.activeUsers.find((user) => user.userId === data.receiverId);
                if (user) {
                    this.io.to(user.socketId).emit("receive-message", data);
                }
            });
            // ✅ Disconnect
            socket.on("disconnect", () => {
                console.log("❌ User disconnected:", socket.id);
                this.activeUsers = this.activeUsers.filter((user) => user.socketId !== socket.id);
                this.io.emit("get-online-users", this.activeUsers);
            });
        });
    }
    listen() {
        const PORT = process.env.PORT || 5000;
        this.server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    connectToDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const DB_URI = process.env.DB_URI;
                if (!DB_URI) {
                    throw new Error("DB_URI is missing");
                }
                yield mongoose_1.default.connect(DB_URI);
                console.log("✅ MongoDB Connected");
                this.listen();
            }
            catch (error) {
                console.error("❌ MongoDB error:", error);
                process.exit(1);
            }
        });
    }
}
// ✅ INIT ORDER
const server = new Connection();
server.useMiddleWares();
server.initializeRoutes();
server.initSocketConnection();
server.test();
server.connectToDB();
