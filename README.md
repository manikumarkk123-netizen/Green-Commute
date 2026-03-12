# Green Commute

Green Commute is a MERN stack (MongoDB substituted with Firebase Firestore) application aimed at providing eco-friendly travel solutions, including EV cabs, scooter rentals, and an EcoCoins reward system.

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- NPM or Yarn
- Firebase Project configured for Web App Authentication

### 2. Running the Backend Server
1. Navigate to `server/`
2. Run `npm install`
3. Create a `.env` file based on `.env.example` (or mock values provided)
4. Run `npm run dev` to start the Express server on port 5000.

### 3. Running the React Frontend
1. Navigate to `client/`
2. Run `npm install`
3. Open `client/src/config/firebase.js` and input your Firebase configuration (Mock values are provided for UI demonstration).
4. Run `npm run dev`
5. Open your browser and navigate to `http://localhost:5173`.

## Architecture Details
The codebase uses a robust structured approach.
- **Frontend**: Vite, React (Router, Context API), Tailwind CSS v3, Framer Motion, and React Toastify.
- **Backend**: Node.js, Express.js (ES Modules), JWT Authentication middleware, Modular route and controller handlers.
- **Database/Auth**: Integrated ready for Firebase Admin SDK and Firebase Client SDK.

Enjoy the application!
