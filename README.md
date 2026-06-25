<div align="center">
  <div style="background: linear-gradient(135deg, #6C5CE7, #FF6B35); padding: 20px; border-radius: 20px; display: inline-block; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 2.5em;">💸 Budget Track</h1>
  </div>
  <p><strong>A Premium, Full-Stack MERN Personal Finance & Wealth Management Application</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Vite-PWA-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Gemini_AI-Integrated-8E75B2?style=flat-square&logo=googlegemini&logoColor=white" alt="Gemini AI" />
  </p>
</div>

---

## ✨ Features

Budget Track isn't just an expense logger—it's a complete wealth companion built with premium UI/UX in mind.

- 📊 **Advanced Analytics:** Interactive, responsive charts powered by `react-chartjs-2` to visualize your income and expenses.
- 🤖 **Smart AI Financial Advisor:** Integrated Google Gemini AI to analyze your monthly spending and generate personalized financial insights.
- 🎯 **Wealth & Goal Tracking:** Create, fund, and track progress towards savings goals, emergency funds, and debt payoffs.
- 🔒 **Secure Financial Diary:** Keep a personal log of your financial journey. Lock sensitive entries with a SHA-256 hashed PIN.
- 🔐 **Authentication & Security:** Secure JWT-based email/password authentication alongside 1-Tap Google OAuth login.
- 📱 **Progressive Web App (PWA):** Installable on mobile and desktop devices with seamless offline-ready capabilities and a mobile-first floating action button (FAB) design.
- 🌍 **Dynamic Currency:** Automatically adapts to your preferred currency symbol.
- 📤 **Data Portability:** Export your transaction history to CSV or import existing CSV data seamlessly.
- 🎨 **Premium UI Elements:** Custom animated loading splash screens, skeleton loaders, and a centralized toast notification system.

## 🛠️ Tech Stack

### Frontend
* **Core:** React 19, Vite
* **State & Data Fetching:** React Query (`@tanstack/react-query`), Context API
* **Styling & Icons:** Vanilla CSS (CSS Variables for Theming), Lucide React
* **Charts:** Chart.js, react-chartjs-2
* **PWA:** `vite-plugin-pwa`

### Backend
* **Core:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JSON Web Tokens (JWT), Google Auth Library
* **Security & Performance:** `express-rate-limit`, `compression`, `cors`
* **AI:** `@google/genai` (Gemini API)

## 🔌 REST API Endpoints

The backend is structured as a fully functional REST API. Here are the core endpoints:

### Authentication (`/api/auth`)
- `POST /register` - Register a new user account
- `POST /login` - Authenticate and receive JWT token
- `GET /me` - Verify token and return user profile
- `POST /google` - Handle 1-Tap Google OAuth integration

### Transactions (`/api/transactions`)
- `GET /` - Retrieve all transactions for the user
- `POST /` - Create a new income/expense log
- `PUT /:id` - Update a specific transaction
- `DELETE /:id` - Remove a transaction

### Wealth Goals (`/api/goals`)
- `GET /` - Fetch all financial tracking goals
- `POST /` - Set a new savings or debt goal
- `PUT /:id` - Update goal progress (add funds)
- `DELETE /:id` - Delete a goal

### Financial Diary (`/api/notes`)
- `GET /` - Retrieve all diary entries
- `POST /` - Add a new diary note
- `PUT /:id` - Edit a note
- `DELETE /:id` - Delete a note

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and MongoDB installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/lowege-dev/Budget-Track.git
cd Budget-Track
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the Vite development server:
```bash
npm run dev
```

Your app will be running at `http://localhost:5173`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
