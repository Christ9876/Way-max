# Index3dex API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
**POST** `/auth/register`

Request:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

Response:
```json
{
  "message": "Registration successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Login User
**POST** `/auth/login`

Request:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## Wallet Endpoints

### Get Wallet
**GET** `/wallets` (Protected)

Response:
```json
{
  "_id": "wallet_id",
  "userId": "user_id",
  "balance": 50000,
  "availableBalance": 30000,
  "investedAmount": 20000,
  "totalEarnings": 5000,
  "referralEarnings": 2000
}
```

### Update Wallet Balance
**PUT** `/wallets/update-balance` (Protected)

Request:
```json
{
  "amount": 10000,
  "type": "add" // or "subtract"
}
```

---

## Plans Endpoints

### Get All Plans
**GET** `/plans`

Response:
```json
[
  {
    "_id": "plan_id",
    "name": "Aurora Tier",
    "amount": 3000,
    "duration": 30,
    "dailyReturn": 5,
    "totalReturn": 4500,
    "description": "Entry level investment plan",
    "isActive": true
  }
]
```

### Create Plan (Admin Only)
**POST** `/plans` (Protected, Admin)

Request:
```json
{
  "name": "Aurora Tier",
  "amount": 3000,
  "duration": 30,
  "dailyReturn": 5,
  "totalReturn": 4500,
  "description": "Entry level investment plan"
}
```

---

## Investment Endpoints

### Get User Investments
**GET** `/investments` (Protected)

Response:
```json
[
  {
    "_id": "investment_id",
    "userId": "user_id",
    "planId": {
      "_id": "plan_id",
      "name": "Aurora Tier",
      "amount": 3000
    },
    "amount": 3000,
    "startDate": "2026-06-12T00:00:00Z",
    "endDate": "2026-07-12T00:00:00Z",
    "dailyReturn": 150,
    "totalProjectedReturn": 4500,
    "earnedAmount": 750,
    "status": "active"
  }
]
```

### Purchase Plan
**POST** `/investments/purchase` (Protected)

Request:
```json
{
  "planId": "plan_id"
}
```

Response:
```json
{
  "message": "Investment created successfully",
  "investment": { /* investment object */ },
  "wallet": { /* updated wallet */ }
}
```

---

## Transaction Endpoints

### Get Transactions
**GET** `/transactions` (Protected)

Response:
```json
[
  {
    "_id": "transaction_id",
    "userId": "user_id",
    "type": "deposit",
    "amount": 10000,
    "status": "pending",
    "description": "Deposit request",
    "createdAt": "2026-06-12T00:00:00Z"
  }
]
```

### Request Deposit
**POST** `/transactions/deposit` (Protected)

Request:
```json
{
  "amount": 10000
}
```

### Request Withdrawal
**POST** `/transactions/withdrawal` (Protected)

Request:
```json
{
  "amount": 5000
}
```

---

## Referral Endpoints

### Get Referral Info
**GET** `/referrals` (Protected)

Response:
```json
{
  "_id": "referral_id",
  "referrerId": "user_id",
  "referralCode": "ABC12345",
  "totalReferrals": 5,
  "totalEarnings": 2500,
  "commissionRate": 5,
  "referredUsers": [
    {
      "userId": "referred_user_id",
      "joinDate": "2026-06-10T00:00:00Z"
    }
  ]
}
```

### Join via Referral
**POST** `/referrals/join` (Protected)

Request:
```json
{
  "referralCode": "ABC12345"
}
```

---

## Admin Endpoints

### Get Pending Transactions
**GET** `/admin/transactions/pending` (Protected, Admin Only)

### Approve Transaction
**POST** `/admin/transactions/:id/approve` (Protected, Admin Only)

### Reject Transaction
**POST** `/admin/transactions/:id/reject` (Protected, Admin Only)

### Get Analytics
**GET** `/admin/analytics` (Protected, Admin Only)

Response:
```json
{
  "totalUsers": 150,
  "totalTransactions": 450,
  "pendingTransactions": 12,
  "completedTransactions": 438,
  "totalDeposits": 750000,
  "totalWithdrawals": 350000
}
```

---

## Support Endpoints

### Create Support Ticket
**POST** `/support` (Protected)

Request:
```json
{
  "subject": "Cannot withdraw funds",
  "message": "I've been trying to withdraw but keep getting errors",
  "category": "technical"
}
```

### Get Support Tickets
**GET** `/support` (Protected)

### Add Reply to Ticket
**POST** `/support/:id/reply` (Protected)

Request:
```json
{
  "message": "I've resolved the issue"
}
```

---

## Error Responses

All errors return a status code with message:

```json
{
  "message": "Error description"
}
```

Common status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (Admin required)
- `404` - Not Found
- `500` - Server Error
