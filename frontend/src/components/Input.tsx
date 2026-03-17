import React, { useContext, useState, useRef } from "react";
import InputEmoji from "react-input-emoji";
import { AiFillAudio } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import { Socket } from "socket.io-client";
import img from "../assets/img.png";
import AuthContext from "../contexts/AuthContext";
import ChatContext from "../contexts/ChatContext";
import MessageContext from "../contexts/MessageContext";
import { User } from "../types";

function convertTobase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = (error) => reject(error);
  });
}

// ✅ FIXED TYPE
function Input({ socket }: { socket: Socket }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  const { state } = useContext(AuthContext);
  const { chat } = useContext(ChatContext);
  const { setMessages } = useContext(MessageContext);

  const currentUser = state.user as User;

  const isMyId = chat?.friendDetails.friendId === currentUser._id;
  const receiverId = isMyId
    ? chat?.friendDetails.userId
    : chat?.friendDetails.friendId;

  const handleChange = (text: string) => setText(text);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const base64 = await convertTobase64(file);
      setImage(base64 as string);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text && !image) return;

    const body = {
      senderId: currentUser._id,
      receiverId,
      text,
      image,
    };

    try {
      const res = await fetch(
        "https://aftab-chat-app.onrender.com/api/message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const json = await res.json();

      if (res.ok) {
        setText("");
        setImage("");

        // ✅ FIXED
        socket.emit("send-message", json);

        setMessages((prev: any) => [...prev, json]);
      } else {
        console.log(json.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 🎤 AUDIO
  const timer = useRef<HTMLDivElement>(null!);
  const recorder = useRef<MediaRecorder>(null!);
  const interval = useRef<any>(null);
  const [time, setTime] = useState(0);

  const cancelRecording = () => {
    setTime(0);
    timer.current.classList.add("opacity-0");
    clearInterval(interval.current);
  };

  const stopRecording = () => {
    recorder.current.stop();
    cancelRecording();
  };

  const handleRecord = async () => {
    interval.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    timer.current.classList.remove("opacity-0");

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const items: Blob[] = [];

    recorder.current = new MediaRecorder(stream);

    recorder.current.ondataavailable = async (e) => {
      items.push(e.data);

      if (recorder.current.state === "inactive") {
        const blob = new Blob(items, { type: "audio/webm" });
        const audio = await convertTobase64(blob);

        const body = {
          senderId: currentUser._id,
          receiverId,
          audio,
          text: "",
          image: "",
        };

        const res = await fetch(
          "https://aftab-chat-app.onrender.com/api/message",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${currentUser.token}`,
            },
            body: JSON.stringify(body),
          }
        );

        const json = await res.json();

        if (res.ok) {
          setMessages((prev: any) => [...prev, json]);
        } else {
          console.log(json.error);
        }

        cancelRecording();
      }
    };

    recorder.current.start();
  };

  return (
    <form
      onSubmit={handleSend}
      className={`${chat ? "bg-white" : "bg-empty-chat"} flex items-center h-14 w-full`}
    >
      {chat && (
        <>
          <div className="w-[80%]">
            <InputEmoji value={text} onChange={handleChange} />
          </div>

          <div className="flex items-center gap-5 w-40">
            <label className="cursor-pointer" htmlFor="image">
              <img src={img} alt="upload" />
            </label>

            <input
              onChange={handleUpload}
              className="hidden"
              type="file"
              id="image"
            />

            <div onClick={handleRecord}>
              <AiFillAudio className="text-2xl cursor-pointer" color="#5b5d8d" />
            </div>

            <button className="text-2xl text-primary">
              <FiSend />
            </button>
          </div>
        </>
      )}
    </form>
  );
}

export default Input;