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
npm install-all  # Install all dependencies
npm run dev      # Run both backend and frontend
```

## First Admin Setup

1. Register a user account through the app
2. Connect to MongoDB directly and update the user role:
   ```javascript
   db.users.updateOne(
     { email: "your-admin-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

3. Login with the admin account - you'll see the admin dashboard

## Default Investment Plans

The system comes with predefined plans:
- Aurora Tier: ₦3,000
- Nova Tier: ₦6,000
- Selene Tier: ₦12,000
- Elysia Tier: ₦15,000
- Celestia Tier: ₦30,000
- Lumina Tier: ₦50,000
- Zenith Tier: ₦120,000

You can create, update, or delete plans from the admin panel.

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify PORT 5000 is not in use
- Check `.env` file configuration

### Frontend can't connect to API
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

### MongoDB connection error
- Verify MongoDB is running: `mongosh` should connect
- Check connection string in `.env`
- For MongoDB Atlas, whitelist your IP address

## Project Structure

```
Way-max/
├── backend/
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth, validation
│   │   └── index.js       # Server entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── (auth)/        # Login/Register
│   │   ├── (dashboard)/   # Main app
│   │   └── admin/         # Admin panel
│   ├── components/
│   ├── styles/
│   └── package.json
├── docs/
│   └── API.md
└── README.md
```

## Next Steps

1. Test authentication: Register and login
2. Test wallet system: Request a deposit
3. Test admin approval: Approve deposit as admin
4. Test investments: Purchase an investment plan
5. Test referrals: Copy and share referral link

## Production Deployment

For production:
1. Update `.env` with production values
2. Set `NODE_ENV=production`
3. Use a production database (MongoDB Atlas)
4. Deploy backend to a service like Heroku, Railway, or AWS
5. Deploy frontend to Vercel or Netlify
6. Update `FRONTEND_URL` and `NEXT_PUBLIC_API_URL` to production URLs
