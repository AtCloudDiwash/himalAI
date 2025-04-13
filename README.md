📘 Memory Vault – README

Memory Vault is a secure, AI-powered journaling and mood tracking web app. It allows users to write daily journal entries and receive emotional feedback, sentiment insights, and stress relief suggestions via the Gemini API. Each memory is securely stored using blockchain for privacy and permanence.

🔧 Tech Stack

Frontend: React.js (Vite + Tailwind)

Backend: Node.js + Express

AI Integration: Python FastAPI with Gemini 1.5 Flash (via Google AI API)

Blockchain: Ethereum Sepolia Testnet (via MetaMask)

🚀 Features

📓 Text-based journaling interface (Title, Date, Description)

💡 AI-driven sentiment analysis using Gemini

📊 Mood tracking graph (weekly, monthly, yearly)

🧠 Stress & achievement feedback

🔐 Blockchain-based storage for journal authenticity

🔗 Requirements & Setup

✅ Prerequisites

Node.js v18+

Python 3.10+

MetaMask browser extension

Access to Google Gemini API

MetaMask wallet funded with Sepolia ETH from Sepolia Faucet

Switch MetaMask to the Sepolia test network


📦 Install Dependencies
# Frontend
cd frontend
npm install

# Backend (Node.js + Express)
cd backend
npm install

# Python FastAPI Server
cd ai-server
pip install -r requirements.txt


⚙️ Run the App
# Start frontend
npm install
cd frontend
npm run dev

# Start backend server
npm install
cd backend
node index.js

# Start FastAPI server
cd ai-server
uvicorn main:app --reload


Frontend (React)  <-->  Backend (Express)  <-->  AI Server (FastAPI + Gemini)
                                          |
                                     Blockchain (Sepolia)
                                     
📌 Notes

Make sure MetaMask is installed and connected to the Sepolia network.

Your transactions will be visible on Sepolia block explorers.

Journals are hashed and recorded on blockchain for verification.

Gemini API processes the journal content and returns emotion insights.


🙌 Built With Love At

🚀 Himalai Hackathon 2025
🛠️ 48 Hours of Passion and Code
👥 By phosphene.ai
















📦 Install Dependencies
