# 💬 Aftab Real-Time Chat Application

A full-stack **real-time chat application** built using the **MERN Stack** and **Socket.io**.
This application allows users to register, add friends, and exchange instant messages with real-time updates.

---

## 🚀 Features

* 🔐 User Authentication (Register & Login)
* 💬 Real-time messaging using **Socket.io**
* 👥 Add and manage friends
* 🟢 Online user status tracking
* 📱 Responsive chat interface
* ⚡ Instant message delivery

---

## 🛠 Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* Socket.io Client

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Socket.io

---

## 📂 Project Structure

```
aftab-chat-app
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middlewares
│   └── server.ts
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── contexts
│   │   ├── pages
│   │   └── assets
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/aftabshekh/aftab-chat-app.git
cd aftab-chat-app
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```
DB_URI=your_mongodb_connection_string
PORT=5000
```

Run backend server:

```
npm run dev
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

Application will run on:

```
http://localhost:5173
```

---

## 🌐 API Endpoints

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| POST   | /api/user/register | Register user    |
| POST   | /api/user/login    | Login user       |
| GET    | /api/friend        | Get friends list |
| POST   | /api/message       | Send message     |

---

## 🔮 Future Improvements

* 📞 Voice calling
* 🎥 Video calling
* 📎 File sharing
* 😀 Emoji reactions
* 🌙 Dark mode

---

## 👨‍💻 Author

**Aftab Shekh**

GitHub:
https://github.com/aftabshekh

---

## ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.
