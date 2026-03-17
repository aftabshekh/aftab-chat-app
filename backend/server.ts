import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http, { Server as HttpServer } from "http";

// routes
import authRoute from "./routes/auth";
import userRoute from "./routes/userRoute";
import userFriendRoute from "./routes/userFriendRoute";
import messageRoute from "./routes/messageRoute";

dotenv.config();

// fix mongoose warning
mongoose.set("strictQuery", false);

interface ActiveUsersProps {
  socketId: string;
  userId: string;
}

class Connection {
  private app: Application;
  private server: HttpServer;
  private io: Server;
  private activeUsers: ActiveUsersProps[];

  public constructor() {
    this.app = express();

    // ✅ HTTP server
    this.server = http.createServer(this.app);

    // ✅ Socket.IO setup
    this.io = new Server(this.server, {
      cors: {
        origin: "https://aftab-chat-app.vercel.app",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    this.activeUsers = [];
  }

  public test() {
    this.app.get("/", (req, res) => {
      res.status(200).json({
        message: "Aftab Chat API Running 🚀"
      });
    });
  }

  public useMiddleWares() {
    this.app.use(express.json({ limit: "50mb" }));

    this.app.use(
      cors({
        origin: "https://aftab-chat-app.vercel.app",
        credentials: true
      })
    );
  }

  public initializeRoutes() {
    this.app.use("/api/auth", authRoute);
    this.app.use("/api/user", userRoute);
    this.app.use("/api/friend", userFriendRoute);
    this.app.use("/api/message", messageRoute);
  }

  public initSocketConnection() {
    this.io.on("connection", (socket) => {
      console.log("🔥 User connected:", socket.id);

      // ✅ Add user
      socket.on("add-new-user", (userId) => {
        if (
          !this.activeUsers.find((user) => user.userId === userId) &&
          userId
        ) {
          this.activeUsers.push({
            userId,
            socketId: socket.id
          });

          this.io.emit("get-online-users", this.activeUsers);
        }
      });

      // ✅ Send message
      socket.on("send-message", (data) => {
        const { receiverId } = data;

        const user = this.activeUsers.find(
          (user) => user.userId === receiverId
        );

        if (user) {
          this.io.to(user.socketId).emit("receive-message", data);
        }
      });

      // ✅ Disconnect
      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);

        this.activeUsers = this.activeUsers.filter(
          (user) => user.socketId !== socket.id
        );

        this.io.emit("get-online-users", this.activeUsers);
      });
    });
  }

  private listen() {
    const PORT = process.env.PORT || 5000;

    this.server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  }

  public async connectToDB() {
    try {
      const DB_URI = process.env.DB_URI;

      if (!DB_URI) {
        throw new Error("DB_URI is missing");
      }

      await mongoose.connect(DB_URI);
      console.log("✅ MongoDB Connected");

      this.listen();
    } catch (error) {
      console.error("❌ MongoDB error:", error);
      process.exit(1);
    }
  }
}

// ✅ INIT ORDER (IMPORTANT)
const server = new Connection();

server.useMiddleWares();
server.initializeRoutes();
server.initSocketConnection();
server.test();
server.connectToDB();