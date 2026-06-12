# Index3dex - Features & User Guide

## User Features

### 1. Authentication
- **Register**: Create a new account with first name, last name, email, and password
- **Login**: Secure login with JWT token authentication
- **Session Management**: Auto-logout on token expiration

### 2. Dashboard
- View total wallet balance
- See available balance for investments
- Track invested amount
- Monitor total earnings
- Quick action buttons for deposit, withdraw, and invite

### 3. Investment Plans
- Browse 7 different investment tiers
- View daily return percentages
- See total projected returns
- Purchase plans instantly
- Track active investments with countdown timers
- Monitor daily earnings progress

### 4. Wallet Management
- **View Balance**: Real-time balance updates
- **Deposit**: Request deposits (requires admin approval)
- **Withdraw**: Request withdrawals with available balance check
- **Transaction History**: View all deposit/withdrawal transactions

### 5. Referral System
- Unique referral code per user
- Shareable referral link
- Track number of referrals
- Monitor referral earnings
- View list of referred users
- Copy link functionality and social share

### 6. Profile Management
- Edit personal information
- Add phone number
- Update address details
- View account settings
- Update bank details (for withdrawals)
- Logout

### 7. Support System
- Create support tickets
- Submit issues or questions
- Track ticket status (open, in-progress, resolved)
- View admin responses
- Add replies to tickets

---

## Admin Features

### 1. Transaction Management
- View all pending transactions
- Filter by type (deposits, withdrawals)
- Approve deposits to credit user wallets
- Reject transactions with reasons
- View transaction history

### 2. Analytics Dashboard
- Total user count
- Total transactions count
- Pending transaction count
- Completed transaction count
- Total deposits amount
- Total withdrawals amount

### 3. User Management
- View all registered users
- View user details
- Track user activity

### 4. Plan Management
- Create new investment plans
- Edit existing plans
- View plan details
- Deactivate plans if needed

### 5. Support Management
- View all support tickets
- Respond to user tickets
- Update ticket status
- Track support activity

---

## Workflow Examples

### User Investment Workflow
1. Register and login
2. Request a deposit (minimum ₦1,000)
3. Wait for admin approval
4. Once approved, balance updates automatically
5. Go to Products page
6. Select an investment plan
7. Purchase the plan
8. Plan appears in "Active Investments"
9. Track daily earnings over 30 days
10. On day 31, plan completes and earnings are added

### Admin Approval Workflow
1. Login with admin account
2. Go to Admin Dashboard
3. Click "Manage Transactions"
4. View pending deposits/withdrawals
5. Click "Approve" to credit user wallet
6. Or click "Reject" to deny request
7. Check analytics for overview

### Referral Workflow
1. Login to your account
2. Go to "Team & Referrals" page
3. Copy your unique referral link
4. Share with friends
5. When friends join using your link, they appear in "Referred Users"
6. Earn 5% commission on their investments (if enabled)

---

## Key Features Explained

### Real-Time Updates
- Wallet balance updates instantly when transactions are approved
- Investment progress bars update in real-time
- Referral count updates immediately

### Countdown Timers
- 30-day investment countdown
- Daily earnings calculation
- Automatic completion notification

### Mobile-First Design
- Fully responsive on all devices
- Bottom navigation for easy access
- Touch-friendly buttons and inputs
- Optimized for mobile banking experience

### Security
- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API endpoints
- User-specific data isolation
- Admin-only endpoint protection

### User Experience
- Smooth animations and transitions
- Clear status indicators
- Form validation and error messages
- Loading states
- Empty state messaging

---

## Investment Plan Details

| Tier | Amount | Daily Return | Total Return | Days |
|------|--------|--------------|--------------|------|
| Aurora | ₦3,000 | 5% | ₦4,500 | 30 |
| Nova | ₦6,000 | 5% | ₦9,000 | 30 |
| Selene | ₦12,000 | 5% | ₦18,000 | 30 |
| Elysia | ₦15,000 | 5% | ₦22,500 | 30 |
| Celestia | ₦30,000 | 5% | ₦45,000 | 30 |
| Lumina | ₦50,000 | 5% | ₦75,000 | 30 |
| Zenith | ₦120,000 | 5% | ₦180,000 | 30 |

All returns are calculated daily over the 30-day period.

---

## Tips for Users

1. **Keep Your Password Safe**: Never share your login credentials
2. **Monitor Transactions**: Check your transaction history regularly
3. **Start Small**: Begin with smaller investment plans
4. **Use Referrals**: Share your code to earn extra income
5. **Update Profile**: Complete your profile for better security
6. **Contact Support**: Use the support system for any issues

---

## Tips for Admins

1. **Regular Approvals**: Check and approve pending transactions daily
2. **Monitor Analytics**: Keep an eye on system metrics
3. **User Management**: Maintain user account integrity
4. **Plan Updates**: Adjust investment plans as needed
5. **Support Response**: Respond to user tickets promptly
6. **System Health**: Monitor for any issues or errors
