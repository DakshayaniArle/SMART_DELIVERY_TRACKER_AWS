# 🚚 Smart Delivery Tracker 📦

A modern, cloud-powered delivery tracking system that lets users **place**, **track**, and **monitor** their orders in real-time — using **React.js** on the frontend and **AWS services** like Lambda, DynamoDB, and SES/SNS on the backend.

---

## ✨ Features

- 📦 **Order Placement** – Users can easily place orders by entering pickup and destination details.
- 📍 **Live Delivery Status** – Track delivery progress dynamically based on estimated speed and time.
- 📊 **Visual Progress** – Intuitive progress bar with ETA, distance covered, and time remaining.
- 📬 **Email Notifications** – Instant confirmation emails when orders are placed.
- ☁️ **Powered by AWS** – Scalable backend using AWS Lambda, DynamoDB, OpenRouteService, and SNS/SES.

---

## 🛠️ Tech Stack

| Frontend       | Backend (AWS Lambda)    | Database        | Other Services      |
|----------------|-------------------------|------------------|---------------------|
| React.js       | Node.js (Lambda)        | DynamoDB         | SNS / SES           |
| Tailwind CSS   | Express-style logic     |                  | OpenRouteService API|

---

## 🚀 How It Works

1. **User places an order** → Data is sent to AWS Lambda.
2. **Lambda stores order** in DynamoDB and sends a confirmation via email.
3. **Status updates** use OpenRouteService API to simulate delivery distance and progress.


---

## 📸 Screenshots

| Place Order Page | Orders Page |
|------------------|-------------|
| ![Place Order](./screenshots/place-order.png) | ![Track Orders](./screenshots/orders.png) |

---

## 🔧 Setup & Deployment

### Prerequisites

- AWS account (Lambda, DynamoDB, SNS/SES)
- OpenRouteService API key
- Git + Node.js + Vercel (or Netlify)

### Local Setup

```bash
git clone https://github.com/your-username/smart-delivery-tracker
cd smart-delivery-tracker
npm install
npm start
