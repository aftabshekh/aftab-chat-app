import React, { useState, useEffect, useRef, useContext } from "react";
import { io, Socket } from "socket.io-client";
import ChatBox from "../components/ChatBox";
import SideBar from "../components/SideBar";
import AuthContext from "../contexts/AuthContext";
import ChatContext from "../contexts/ChatContext";
import MessageContext from "../contexts/MessageContext";
import { User } from "../types";

function Home() {
  const [display, setDisplay] = useState(true);
  const [onlineUser, setOnlineUser] = useState<any[]>([]);

  const socket = useRef<Socket | null>(null);

  const { setMessages } = useContext(MessageContext);
  const { render } = useContext(ChatContext);
  const { state } = useContext(AuthContext);

  const currentUser = state.user as User;

  // ✅ SOCKET CONNECT
  useEffect(() => {
    socket.current = io("https://aftab-chat-app.onrender.com");

    if (currentUser?._id) {
      socket.current.emit("add-new-user", currentUser._id);
    }

    socket.current.on("get-online-users", (users) => {
      setOnlineUser(users);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [currentUser]);

  // ✅ RECEIVE MESSAGE
  useEffect(() => {
    if (!socket.current) return;

    socket.current.on("receive-message", (data) => {
      setMessages((prev: any) => [...prev, data]);
    });

    return () => {
      socket.current?.off("receive-message");
    };
  }, []);

  // ✅ RESPONSIVE
  useEffect(() => {
    const handleResize = () => {
      setDisplay(window.innerWidth > 1200);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ❗ IMPORTANT: socket ready check
  if (!socket.current) {
    return <div className="text-white">Connecting...</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      {display ? (
        <div className="flex justify-center w-[90%] h-[500px]">
          <SideBar />
          <ChatBox socket={socket.current} />
        </div>
      ) : render ? (
        <SideBar />
      ) : (
        <div className="flex justify-center w-full h-[500px]">
          <ChatBox socket={socket.current} />
        </div>
      )}
    </div>
  );
}

export default Home;