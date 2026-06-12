# Contributing to Index3dex

## Code Structure

### Backend Architecture
```
src/
├── models/          # MongoDB data schemas
├── routes/          # Express route handlers
├── middleware/      # Authentication, validation
├── utils/           # Helper functions
└── index.js         # Server entry point
```

### Frontend Architecture
```
app/
├── (auth)/          # Auth pages (register, login)
├── (dashboard)/     # Protected dashboard pages
├── admin/           # Admin pages
└── layout.tsx       # Root layout
components/         # Reusable components
styles/             # Global CSS
```

## Coding Standards

### Backend (Node.js/Express)
- Use ES6 modules
- Follow RESTful API conventions
- Use async/await for promises
- Validate all inputs with Joi
- Add error handling to all routes
- Document complex logic

### Frontend (Next.js/React)
- Use functional components and hooks
- Use TypeScript for type safety
- Use Tailwind CSS for styling
- Keep components small and reusable
- Use Framer Motion for animations
- Add loading and error states

## Development Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Test your changes

4. Commit with meaningful messages:
   ```bash
   git commit -m "feat: add feature description"
   ```

5. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request

## Adding New Features

### Adding a New Investment Plan
1. Use the admin panel to create the plan
2. Plans automatically appear in the Products page
3. Users can purchase immediately

### Adding a New API Endpoint
1. Create route file in `backend/src/routes/`
2. Import route in `backend/src/index.js`
3. Add to `app.use()` with appropriate path
4. Document in `docs/API.md`

### Adding a New Page
1. Create page in `frontend/app/(dashboard)/` or `frontend/app/admin/`
2. Add navigation link in `BottomNav.tsx` or admin menu
3. Import components and use API endpoints
4. Add TypeScript interfaces for data types

## Testing

### Backend Testing
1. Use Postman or Thunder Client to test API endpoints
2. Test with valid and invalid inputs
3. Verify authentication tokens
4. Check error responses

### Frontend Testing
1. Test all pages load correctly
2. Test authentication flow
3. Test form submissions
4. Test responsive design
5. Check browser console for errors

## Common Modifications

### Changing Investment Plan Returns
Edit daily return % in the plan creation:
```javascript
// In admin panel or directly in database
dailyReturn: 5 // Change this value
```

### Modifying Referral Commission
Update in `Referral` model:
```javascript
commissionRate: 5 // Change from 5% to desired %
```

### Changing Color Scheme
Edit color values in:
- `frontend/styles/globals.css` - CSS custom properties
- `frontend/tailwind.config.ts` - Tailwind colors
- Default: Black (#000000) and Gold (#D4AF37)

### Adding New User Fields
1. Add to `User` model in `backend/src/models/User.js`
2. Update registration endpoint
3. Update profile edit form in frontend
4. Update profile page display

## Performance Optimization

### Backend
- Use database indexes on frequently queried fields
- Implement pagination for large datasets
- Cache frequently accessed data
- Optimize database queries

### Frontend
- Code splitting with Next.js dynamic imports
- Image optimization with Next.js Image
- Lazy load components
- Minimize re-renders with React.memo

## Security Best Practices

1. **Never commit `.env` files** - Use `.env.example`
2. **Validate all inputs** - Use Joi on backend
3. **Sanitize outputs** - Prevent XSS attacks
4. **Use HTTPS** - Always in production
5. **Rotate secrets** - Change JWT secret regularly
6. **Rate limiting** - Implement for public endpoints
7. **CORS configuration** - Restrict to known origins

## Debugging Tips

### Backend
- Use `console.log()` or debugger
- Check MongoDB connection
- Verify environment variables
- Check request/response in Postman

### Frontend
- Use browser DevTools
- Check browser console for errors
- Use React DevTools extension
- Check network tab for API calls
- Use `console.log()` for debugging

## Deployment Checklist

- [ ] Update environment variables
- [ ] Run production build
- [ ] Test all features
- [ ] Check mobile responsiveness
- [ ] Verify API endpoints
- [ ] Update database URL
- [ ] Enable HTTPS
- [ ] Set up error logging
- [ ] Configure CORS properly
- [ ] Set NODE_ENV=production

## Getting Help

- Check existing issues on GitHub
- Review API documentation in `docs/API.md`
- Check setup guide in `docs/SETUP.md`
- Review code comments and documentation
- Test with Postman before implementing
