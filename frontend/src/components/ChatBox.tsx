import React, { useContext, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import ChatContext from "../contexts/ChatContext";
import MessageContext from "../contexts/MessageContext";
import AuthContext from "../contexts/AuthContext"; // ✅ ADD
import { User } from "../types"; // ✅ ADD
import emptychat from "../assets/emptychat.png";
import Header from "./Header";
import Input from "./Input";
import Messages from "./Messages";

type Props = {
  socket: Socket;
};

function ChatBox({ socket }: Props) {
  const { messages, setMessages } = useContext(MessageContext);
  const { chat, setChat } = useContext(ChatContext);
  const { state } = useContext(AuthContext); // ✅ ADD

  const currentUser = state.user as User; // ✅ ADD

  const Div = useRef<HTMLDivElement>(null!);

  // ✅ CLOSE CHAT ON OUTSIDE CLICK
  useEffect(() => {
    const handleClick = (e: Event) => {
      if (
        !(e.target as HTMLElement).classList.contains("l") &&
        !Div.current.contains(e.target as Node) &&
        window.innerWidth > 1200
      ) {
        setChat(null!);
        setMessages([]);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [setChat, setMessages]);

  // 🔥 STEP 4: LOAD MESSAGES FROM BACKEND
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chat || !currentUser?._id) return;

      const friendId =
        chat.friendDetails.friendId === currentUser._id
          ? chat.friendDetails.userId
          : chat.friendDetails.friendId;

      try {
        const res = await fetch(
          `https://aftab-chat-app.onrender.com/api/message/${currentUser._id}/${friendId}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`, // ✅ IMPORTANT
            },
          }
        );

        const data = await res.json();

        console.log("Fetched Messages:", data);

        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [chat]); // 🔥 runs when chat changes

  return (
    <div
      ref={Div}
      className={`${
        window.innerWidth <= 1200 ? "w-[90%]" : "w-[50%]"
      } relative`}
    >
      <Header />

      <div className="custom-height bg-empty-chat overflow-auto">
        {chat ? (
          messages.map((message) => (
            <Messages key={message._id} message={message} />
          ))
        ) : (
          <div className="h-full flex justify-center items-center text-2xl">
            Tap on a conversation to start chatting
            <img className="w-28" src={emptychat} alt="image" />
          </div>
        )}
      </div>

      <Input socket={socket} />
    </div>
  );
}

export default ChatBox;