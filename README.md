# 🚀 LeetRevision — DSA & SQL Spaced Repetition Tracker

A full-stack, LeetCode-themed Spaced Repetition Flashcard & Analytics Tracker designed to help developers master Data Structures, Algorithms, and SQL queries through daily practice and intelligent revision tracking.

---

## ✨ Key Features

- **🔥 Daily Streak & Progress Metrics**: Tracks your current streak, all-time record max streak, total cards mastered, and daily DSA/SQL targets.
- **🟩 365-Day Revision Heatmap**: LeetCode-inspired contribution grid with real-time hover tooltips (`X submissions on MMM DD, YYYY`) tracking daily revision intensity.
- **🃏 3D Spaced Repetition Flashcards**: Interactive 3D flip card viewer with self-testing question front and key insight/code solution back.
- **⚡ 4-Level Confidence Rating System**: Grade your recall interval with `Again`, `Hard`, `Good`, and `Easy` ratings to update mastery levels.
- **💻 Tailored DSA & SQL Workflows**:
  - **DSA Problems**: Includes Key Insights, LeetCode problem links, complexity notes, tags, and multi-language solution code snippets (C++, Python, Java, JavaScript).
  - **SQL Queries & Topics**: Streamlined interface focusing on SQL syntax, topic categories (Window Functions, CTEs, Joins), and query patterns.
- **📱 100% Fully Responsive UI**: Sleek dark mode design built with Tailwind CSS, custom glassmorphism components, and adaptive mobile header controls.

---

## 🏗️ Architecture & Technology Stack

```
                                  +-----------------------+
                                  |   React + Vite UI     |
                                  |  (Tailwind CSS,       |
                                  |   Lucide React)       |
                                  +-----------+-----------+
                                              |
                                              | HTTP / REST API (Proxy: Port 5002)
                                              v
                                  +-----------------------+
                                  |   Express.js API      |
                                  | (Node.js Controller)  |
                                  +-----------+-----------+
                                              |
                                              | Mongoose ODM
                                              v
                                  +-----------------------+
                                  |  MongoDB Atlas DB     |
                                  | (Cloud Cluster DB)    |
                                  +-----------------------+
```

### Tech Stack Table

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 + Vite | Fast UI rendering & HMR developer server |
| **Styling** | Tailwind CSS + Vanilla CSS | Dark mode design system with LeetCode aesthetics |
| **Icons & Visuals** | Lucide React | Modern vector icon library |
| **Backend Runtime** | Node.js + Express.js | RESTful API server running on port 5002 |
| **Database** | MongoDB Atlas + Mongoose | Cloud MongoDB database with ODM schema validation |
| **Environment Config** | Dotenv | Secure environment variable management |

---

## 📁 Repository Structure

```
My_tracker/
├── .gitignore               # Root git ignore rules (node_modules, .env, build outputs)
├── README.md                # Comprehensive documentation & architecture guide
│
├── backend/                 # Node.js + Express REST API
│   ├── config/              # MongoDB connection configuration (db.js)
│   ├── controllers/         # API business logic (flashcardController, analyticsController)
│   ├── data/                # Fallback memory store configuration (seedData.js)
│   ├── middleware/          # Express error handling middleware (errorHandler.js)
│   ├── models/              # Mongoose data schemas (Flashcard.js, User.js)
│   ├── routes/              # API route definitions (flashcardRoutes, analyticsRoutes)
│   ├── .env                 # Environment variables (PORT, MONGO_URI)
│   ├── package.json         # Backend dependencies & npm scripts
│   ├── seed.js              # Database cleanup & initialization script
│   └── server.js            # Express server entry point
│
└── frontend/                # React + Vite Client
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard/   # Stat badges & metrics header (MetricsHeader.jsx)
    │   │   ├── Flashcards/  # Card deck grid, filters & modal form (FlashcardCard, FlashcardModal, FilterBar)
    │   │   ├── Heatmap/     # 365-day revision heatmap with LeetCode tooltip (ContributionHeatmap.jsx)
    │   │   ├── Layout/      # Top responsive navbar (Navbar.jsx)
    │   │   └── Revision/    # 3D Spaced Repetition flashcard flipper (RevisionViewer.jsx)
    │   ├── services/        # Axios API client endpoints (api.js)
    │   ├── App.jsx          # Root application layout & state coordinator
    │   ├── index.css        # Global CSS & Tailwind imports
    │   └── main.jsx         # React application entry point
    ├── vite.config.js       # Vite configuration with proxy target (http://localhost:5002)
    └── package.json         # Frontend dependencies & scripts
```

---

## 🔌 API Endpoints Summary

### Flashcards API (`/api/flashcards`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/flashcards` | Fetch flashcards with optional type, category, difficulty, or search filters |
| `GET` | `/api/flashcards/:id` | Get details for a single flashcard by ID |
| `POST` | `/api/flashcards` | Create a new DSA problem or SQL query flashcard |
| `PUT` | `/api/flashcards/:id` | Update an existing flashcard |
| `DELETE` | `/api/flashcards/:id` | Delete a flashcard from the database |
| `PATCH` | `/api/flashcards/:id/revise` | Log a revision attempt & rating (`Again`, `Hard`, `Good`, `Easy`) |
| `GET` | `/api/flashcards/meta/categories` | Retrieve distinct categories and tags for filtering |

### Analytics API (`/api/analytics`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/analytics/heatmap` | Retrieve 365-day activity grid data for contribution heatmap |
| `GET` | `/api/analytics/stats` | Retrieve streak metrics, total cards count, and daily target progress |

---

## ⚡ Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) or local MongoDB instance

### 1. Clone & Configure Environment
Create a `.env` file inside the `backend/` directory:

```env
PORT=5002
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.wxfsade.mongodb.net/dsa_sql_tracker?retryWrites=true&w=majority
NODE_ENV=development
```

### 2. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
*The backend API server will start on `http://localhost:5002`.*

### 3. Start Frontend Development Server
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The frontend client will start on `http://localhost:3000` with API proxy configured to port 5002.*

---

## 📝 License
This project is open-source and available under the **MIT License**.
