import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http, { Server as httpServer } from "http";

import userRoute from "./routes/userRoute";
import userFriendRoute from "./routes/userFriendRoute";
import messageRoute from "./routes/messageRoute";

dotenv.config();

interface activeUsersProps {
  socketId: string;
  userId: string;
}

class Connection {
  private app: Application;
  private io: Server;
  private http: httpServer;
  private activeUsers: activeUsersProps[];

  public constructor() {
    this.app = express();
    this.http = http.createServer(this.app);

    this.io = new Server(this.http, {
      cors: {
        origin: "*", // later replace with your Vercel domain
        methods: ["GET", "POST"]
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
        origin: "*",
        credentials: true
      })
    );
  }

  public initializeRoutes() {
    this.app.use("/api/user", userRoute);
    this.app.use("/api/friend", userFriendRoute);
    this.app.use("/api/message", messageRoute);
  }

  public initSocketConnection() {
    this.io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

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

      socket.on("send-message", (data) => {
        const { receiverId } = data;

        const user = this.activeUsers.find(
          (user) => user.userId === receiverId
        );

        if (user) {
          this.io.to(user.socketId).emit("receive-message", data);
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        this.activeUsers = this.activeUsers.filter(
          (user) => user.socketId !== socket.id
        );

        this.io.emit("get-online-users", this.activeUsers);
      });
    });
  }

  private listen() {
    const PORT = process.env.PORT || 5000;

    this.http.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  }
public async connectToDB() {
  try {
    const DB_URI = process.env.DB_URI;

    if (!DB_URI) {
      throw new Error("DB_URI is missing in environment variables");
    }

    await mongoose.connect(DB_URI);

    console.log("✅ MongoDB Connected");

    this.listen();
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}
}

const server = new Connection();

server.useMiddleWares();
server.initializeRoutes();
server.initSocketConnection();
server.test();
server.connectToDB();