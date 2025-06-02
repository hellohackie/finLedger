# Backend Configuration Guide

This guide shows you how to easily switch between the Node.js and Java Spring Boot backends with minimal configuration changes.

## Quick Setup

### Option 1: Environment Variable (Recommended)
Create a `.env` file in the root directory:

```bash
# Switch backend by changing this line
VITE_BACKEND_TYPE=nodejs
# or
VITE_BACKEND_TYPE=java
```

### Option 2: Code Configuration
Edit `client/src/config/api.ts` and change the `SELECTED_BACKEND` constant:

```typescript
// Change this line to switch backends
const SELECTED_BACKEND: keyof typeof BACKEND_CONFIGS = 'java';
```

## Backend Configurations

### Node.js Backend (Current)
- **Port:** 5000
- **Status:** ✅ Running
- **Features:** Express.js, Drizzle ORM, Passport.js authentication

### Java Spring Boot Backend
- **Port:** 8080
- **Status:** ⏳ Ready to deploy
- **Features:** Spring Security, JPA/Hibernate, OAuth2 integration

## Environment Variables

Create a `.env` file with these configurations:

```bash
# Backend Selection
VITE_BACKEND_TYPE=nodejs

# Custom URLs (optional)
VITE_NODEJS_BACKEND_URL=http://localhost:5000
VITE_JAVA_BACKEND_URL=http://localhost:8080

# Database (required for both backends)
DATABASE_URL=your_postgresql_connection_string

# Authentication (required for both backends)
REPL_ID=your_replit_app_id
SESSION_SECRET=your_session_secret
REPLIT_DOMAINS=your_domain

# Java-specific (optional)
ISSUER_URL=https://replit.com/oidc
CLIENT_SECRET=your_oauth_client_secret
```

## Running the Backends

### Node.js Backend
```bash
# Already running via npm run dev
npm run dev
```

### Java Spring Boot Backend
```bash
cd backend-java
chmod +x run.sh
./run.sh
```

Or manually:
```bash
cd backend-java
./mvnw spring-boot:run
```

## Switching Backends

### Step 1: Choose Your Backend
Update your `.env` file:
```bash
VITE_BACKEND_TYPE=java  # or nodejs
```

### Step 2: Start the Backend Server
- **For Node.js:** Already running on port 5000
- **For Java:** Run the Java backend on port 8080

### Step 3: Refresh Your Browser
The frontend will automatically connect to the selected backend.

## API Differences

Both backends provide identical API endpoints:

### Authentication
- `GET /api/auth/user` - Get current user
- `GET /api/login` (Node.js) or `GET /login` (Java) - Login
- `GET /api/logout` - Logout

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Analytics
- `GET /api/portfolio/metrics` - Portfolio metrics
- `GET /api/analytics/categories` - Category analysis
- `GET /api/analytics/trends` - Monthly trends

## Troubleshooting

### Frontend Not Connecting
1. Check the backend is running on the correct port
2. Verify `VITE_BACKEND_TYPE` in your `.env` file
3. Check browser console for configuration logs

### Authentication Issues
1. Ensure `REPL_ID` and other auth variables are set
2. Check that the backend authentication system is properly configured
3. Clear browser cookies and try again

### Database Connection
1. Verify `DATABASE_URL` is correctly set
2. Ensure PostgreSQL is running and accessible
3. Check database migrations are applied

## Performance Comparison

### Node.js Backend
- **Pros:** Fast development, lightweight, npm ecosystem
- **Cons:** Single-threaded, less enterprise features

### Java Spring Boot Backend
- **Pros:** Enterprise-grade, multi-threaded, robust security
- **Cons:** Longer startup time, more memory usage

## Development Workflow

1. **Development:** Use Node.js backend for rapid development
2. **Testing:** Switch to Java backend for integration testing
3. **Production:** Deploy either backend based on requirements

## Production Deployment

### Node.js
```bash
npm run build
npm start
```

### Java
```bash
cd backend-java
./mvnw clean package
java -jar target/finledger-backend-1.0.0.jar
```

## Next Steps

- Test both backends with your data
- Compare performance characteristics
- Choose the best backend for your deployment needs
- Set up CI/CD pipelines for your chosen backend