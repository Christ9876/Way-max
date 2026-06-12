# Index3dex - Premium Fintech Dashboard

A modern, mobile-first investment dashboard application with luxury black & gold UI design. This is a fully functional fintech platform featuring user accounts, wallet system, investment plans, admin approval flows, referral system, and real-time UI updates.

## Project Overview

- **Modern Dashboard**: Luxury fintech-style interface
- **User Authentication**: Secure register/login system
- **Wallet Management**: Real-time balance updates
- **Investment Plans**: 7-tier investment system with daily earnings
- **Admin Panel**: Approve deposits/withdrawals, manage users
- **Referral System**: Track referrals and earn rewards
- **Real-Time Updates**: Live wallet balance, countdown timers, earnings tracking
- **Mobile-First**: Responsive design with bottom navigation

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + custom components
- **State Management**: Zustand
- **Animations**: Framer Motion
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Validation**: Joi
- **Real-time**: Socket.io (optional)

## Project Structure

```
Way-max/
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── (auth)/          # Auth pages
│   │   ├── (dashboard)/     # Main app pages
│   │   ├── admin/           # Admin panel
│   │   └── layout.tsx
│   ├── components/
│   ├── lib/
│   ├── styles/
│   └── public/
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth, validation
│   │   ├── utils/           # Helpers
│   │   └── index.js
│   └── package.json
├── docs/                     # Documentation
└── .gitignore
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance
- npm or yarn

### Installation

**Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure MongoDB URI, JWT secret, etc.
npm run dev
```

**Frontend Setup**
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Configure API endpoint
npm run dev
```

Visit `http://localhost:3000` to access the application.

## Features

### Core User Features
- ✅ Secure registration and login
- ✅ Profile management
- ✅ Wallet with real-time balance
- ✅ Deposit/withdrawal requests with admin approval
- ✅ Investment plans (7 tiers from ₦3,000 to ₦120,000)
- ✅ Active investments tracking with 30-day countdown
- ✅ Daily earnings simulation
- ✅ Unique referral links and tracking
- ✅ Transaction history
- ✅ Support ticket system

### Admin Features
- ✅ Single admin account
- ✅ Approve/reject deposits
- ✅ Approve/reject withdrawals
- ✅ Manage users and plans
- ✅ View system analytics
- ✅ Respond to support tickets

### Technical Features
- ✅ Fully responsive mobile-first design
- ✅ Bottom navigation bar
- ✅ Smooth animations and transitions
- ✅ Premium black & gold theme
- ✅ Real-time wallet updates
- ✅ Production-ready code structure
- ✅ Error handling and validation

## Investment Plans

| Tier Name | Amount | Duration | Daily Return | Total Return |
|-----------|--------|----------|--------------|--------------|
| Aurora Tier | ₦3,000 | 30 days | 5% | ₦4,500 |
| Nova Tier | ₦6,000 | 30 days | 5% | ₦9,000 |
| Selene Tier | ₦12,000 | 30 days | 5% | ₦18,000 |
| Elysia Tier | ₦15,000 | 30 days | 5% | ₦22,500 |
| Celestia Tier | ₦30,000 | 30 days | 5% | ₦45,000 |
| Lumina Tier | ₦50,000 | 30 days | 5% | ₦75,000 |
| Zenith Tier | ₦120,000 | 30 days | 5% | ₦180,000 |

## API Documentation

See `/docs/API.md` for complete API endpoint documentation.

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (User/Admin)
- Input validation and sanitization
- Secure environment variables

## License

MIT

## Support

For issues or questions, contact support through the in-app support system.
