# 🛡HealthHalo

**Your Personal Health Insurance Guide for Africa**

HealthHalo is an AI-driven web application designed to simplify health insurance for underserved communities in Africa. It leverages conversational AI, mobile payments, and a user-friendly interface to help users **find**, **pay for**, and **manage** affordable micro-health insurance plans.

---

![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![Django](https://img.shields.io/badge/Django-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=nodedotjs\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=white)

**🔗 Live Demo:** [https://healthhalo.vercel.app](https://healthhalo.vercel.app)

---

## 📸 Screenshots

> *Replace these placeholders with real screenshots from your app.*

| Dashboard | AI Assistant | Profile Page |
| --------- | ------------ | ------------ |
| *(image)* | *(image)*    | *(image)*    |

---

## 🎯 The Problem

Access to health insurance in many parts of Africa is hindered by:

* **Low Awareness & Trust:** Many people don't understand or trust insurance.
* **Affordability:** Standard plans are too expensive for low-income families.
* **Payment Barriers:** Many are unbanked, making premium payments difficult.
* **Complex Claims:** Submitting claims is tedious and paper-based.

---

## ✨ Our Solution

HealthHalo tackles these challenges with a sleek, AI-powered platform offering:

* 🗣️ **Conversational AI** – Chatbot (in local languages) educates users and recommends plans.
* 🌟 **Personalized Recommendations** – AI suggests affordable micro-insurance tailored to each user.
* 💳 **Integrated Health Wallet** – Easy payments & savings powered by Paystack.
* 📄 **Automated Claims** – Upload medical bills using OCR for quick processing.

---

## 🚀 Key Features

* 🤖 **AI Chat Assistant** – Text/audio/document-based support & suggestions.
* 💡 **Personalized Plans** – AI engine recommends the best-fit insurance.
* 💳 **Health Wallet** – Top-up and pay with ease via Paystack.
* 📄 **Claims Submission** – Upload photo; AI parses & submits automatically.
* 📊 **Dynamic Dashboard** – Real-time wallet, plan, and health tips.
* 👤 **Comprehensive Profile** – AI-powered insights based on your profile.
* 📱 **Responsive UI** – Fully mobile-friendly with collapsible navigation.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Tailwind CSS
* Lucide React (Icons)

### Backend

* Node.js + Express.js
* Django
* Paystack (Payment)
* Axios
* CORS

### AI & ML (Conceptual)

* Natural Language Processing (NLP) – Conversational chatbot
* Predictive Modeling – Insurance matching
* Optical Character Recognition (OCR) – Medical bill parsing

---

## 🏁 Getting Started

### ✅ Prerequisites

* Node.js (v16+)
* npm or yarn

---

### 1. Frontend Setup

```bash
# Clone the repository
git clone https://github.com/Team-BitNomads/healthhalo.git

# Navigate into the project
cd healthhalo

# Install dependencies
npm install

# Start the frontend dev server
npm run dev
```

Your app will be available at: [http://localhost:3000](http://localhost:3000)

---

### 2. Backend Setup (Optional)

If you want to run the payment backend locally:

```bash
# Open a new terminal and navigate to backend
cd healthhalo-payment # adjust if necessary

# Install backend dependencies
npm install

# Add your Paystack secret to .env
echo "PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx" > .env

# Start backend server
node server.js
```

The backend will run at: [http://localhost:3001](http://localhost:3001)

**Note:** If testing locally, make sure to update API URLs in your frontend to point to this server.

---

## 📂 Project Structure

```bash
curacel/
├──healthhalo/
└── app/
    ├── components/
    │   └── dashboard/
    │       ├── ChatbotLayout.tsx
    │       ├── DashboardLayout.tsx
    │       ├── ProfileLayout.tsx
    │       ├── Sidebar.tsx
    │       ├── WalletLayout.tsx
    │       └── WelcomeModal.tsx
    ├── data/
    │   ├── healthTips.ts
    │   └── languages.js
    ├── pages/
    │   ├── ChatbotPage.tsx
    │   ├── DashboardHomePage.tsx
    │   ├── ProfilePage.tsx
    │   ├── SuccessPage.tsx
    │   └── WalletPage.tsx
    ├── Home.tsx
    └── ...
```

---

## 🔮 Future Work (Roadmap)

* ↺ **Real-Time Chat** – Use WebSockets for live support
* 🎤 **Voice Input for almost every function** – Use AssemblyAI or Whisper for speech-to-text
* 📄 **OCR Integration** – Use Google Vision/Tesseract.js for bills
* 🛠️ **Admin Dashboard** – Insurers can approve/reject claims

---

## ✍️ Author

**Team BitNomads**
GitHub: [https://github.com/Team-BitNomads](https://github.com/Team-BitNomads)

---

## 📜 License

This project is licensed under the **MIT License** – see [`LICENSE.md`](./LICENSE.md) for details.
