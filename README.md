# 🗣️ Voice-Based Census Form

A modern web application for digitized census data collection with **voice assistance**, built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It supports **role-based access** (Admin, Officer) and enables **bilingual (Kannada & English)** voice input using the Web Speech API.

---

## ✨ Features

- 🎤 Voice-assisted form filling
- 🔐 OTP-based Aadhaar authentication
- 🧑‍💼 Role-based login for Admins and Officers
- 📄 Real-time census form viewing and editing
- 🌐 Multilingual support (Kannada & English)
- 📊 Data export, printing & basic analytics

---

## 🛠️ Tech Stack

| Frontend       | Backend        | Database    | Voice Input        |
|----------------|----------------|-------------|--------------------|
| React.js       | Express.js     | MongoDB     | Web Speech API     |
| JavaScript     | Node.js        |             |                    |

---

## 🧪 Setup Instructions

### 🔧 Backend

```bash
cd backend
npm install
npm start


Configure your .env file:

NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_app_password

🎨 Frontend
bash

cd frontend
npm install
npm start