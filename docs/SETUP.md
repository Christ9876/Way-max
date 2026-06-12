# Index3dex - Setup & Installation Guide

## Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- MongoDB (local or MongoDB Atlas)
- Git

## Database Setup

### Option 1: Local MongoDB
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   mongod
   ```

### Option 2: MongoDB Atlas (Cloud)
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string

## Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your settings:
   ```
   MONGODB_URI=mongodb://localhost:27017/index3dex
   JWT_SECRET=your_super_secret_key_change_this
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

5. Start backend server:
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

## Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file from example:
   ```bash
   cp .env.local.example .env.local
   ```

4. Update `.env.local` if needed:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_APP_NAME=Index3dex
   ```

5. Start frontend development server:
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## Running Both Servers

### Option 1: Separate Terminals
- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm run dev`

### Option 2: From Root Directory
```bash
npm install-all
npm run dev
```

## First Admin Setup

1. Register a user account
2. Connect to MongoDB and update role:
   ```javascript
   db.users.updateOne(
     { email: "your-admin-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

3. Login with admin account

## Troubleshooting

### MongoDB won't connect
- Ensure MongoDB service is running
- Verify connection string in `.env`
- Check MongoDB Atlas IP whitelist

### Frontend can't reach backend
- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Review browser console for errors

### Port already in use
- Change PORT in `.env` or use: `PORT=5001 npm run dev`
