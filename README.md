# FinLedger - Cross-Platform Financial Transaction Tracker

A comprehensive web application for tracking and managing financial transactions across multiple investment and payment platforms including Groww, Zerodha Kite, PhonePe, Google Pay, and various banking applications.

## 🚀 Features

### Core Functionality
- **Multi-Platform Support** - Track transactions from popular platforms:
  - Investment platforms: Groww, Kite (Zerodha), Paytm Money
  - UPI payments: PhonePe, Google Pay
  - Banking: HDFC, ICICI, SBI, Axis Bank
  
- **Transaction Categories**
  - Stocks
  - Mutual Funds
  - Gold investments
  - UPI payments
  - Bank transfers
  - Cryptocurrency

- **Transaction Types**
  - Buy orders
  - Sell orders
  - Transfer operations

### Dashboard & Analytics
- **Portfolio Overview** - Real-time portfolio metrics and performance
- **Spending Analysis** - Monthly spending trends and patterns
- **Visual Charts** - Interactive pie charts and line graphs
- **Category Breakdown** - Detailed analysis by investment category

### User Experience
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Secure Authentication** - User accounts with session management
- **Data Export** - Export transaction data to CSV format
- **Real-time Updates** - Live data synchronization across devices

## 🛠️ Technology Stack

### Frontend
- **React** with TypeScript for type safety
- **Tailwind CSS** for responsive styling
- **Wouter** for client-side routing
- **TanStack Query** for efficient data fetching
- **React Hook Form** with Zod validation
- **Recharts** for data visualization
- **shadcn/ui** component library

### Backend
- **Node.js** with Express server
- **TypeScript** for full-stack type safety
- **PostgreSQL** database with Drizzle ORM
- **Passport.js** for authentication
- **Zod** for runtime data validation

### Infrastructure
- **Replit** hosting and deployment
- **Vite** for fast development and building
- **Hot Module Replacement** for instant updates

## 📦 Installation & Setup

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL database
- Replit account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finledger
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```env
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret
   REPL_ID=your_replit_id
   REPLIT_DOMAINS=your_domain
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 🔧 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── charts.tsx  # Data visualization components
│   │   │   ├── dashboard-cards.tsx
│   │   │   ├── navigation.tsx
│   │   │   ├── transaction-form.tsx
│   │   │   └── transaction-table.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   └── use-toast.ts
│   │   ├── lib/            # Utility functions
│   │   │   ├── queryClient.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   ├── pages/          # Page components
│   │   │   ├── analytics.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── landing.tsx
│   │   │   ├── portfolio.tsx
│   │   │   └── transactions.tsx
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   └── index.html
├── server/                 # Backend Express server
│   ├── db.ts              # Database connection
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data access layer
│   ├── replitAuth.ts      # Authentication setup
│   └── vite.ts            # Vite integration
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema and validation
├── package.json
├── drizzle.config.ts      # Database configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── vite.config.ts         # Vite configuration
```

## 🗄️ Database Schema

### Users Table
- User authentication and profile information
- Integration with Replit Auth

### Transactions Table
- Complete transaction records with:
  - Platform (source of transaction)
  - Category (type of asset/payment)
  - Transaction type (buy/sell/transfer)
  - Asset name and details
  - Amount and quantity
  - Date and notes

### Portfolio Summary Table
- Computed portfolio values by category
- Real-time portfolio metrics

### Sessions Table
- Secure session management
- User authentication state

## 🔌 API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user
- `GET /api/login` - Initiate login flow
- `GET /api/logout` - User logout
- `GET /api/callback` - OAuth callback

### Transactions
- `GET /api/transactions` - List transactions with filtering
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Portfolio & Analytics
- `GET /api/portfolio/summary` - Portfolio breakdown
- `GET /api/portfolio/metrics` - Portfolio metrics
- `GET /api/analytics/categories` - Category-wise analysis
- `GET /api/analytics/trends` - Monthly spending trends

### Data Management
- `GET /api/export` - Export data to CSV

## 🚀 Deployment

### Replit Deployment
1. Fork this repository to Replit
2. Set up environment variables in Replit secrets
3. Run `npm run db:push` to initialize database
4. The application will automatically deploy

### Manual Deployment
1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Deploy to your preferred hosting platform

## 🔐 Security Features

- **Session Management** - Secure session handling with database storage
- **Authentication** - OAuth integration with Replit Auth
- **Data Validation** - Runtime validation with Zod schemas
- **CSRF Protection** - Built-in security measures
- **Secure Headers** - HTTP security headers configured

## 📱 Usage Guide

### Getting Started
1. **Sign In** - Use the "Sign In" button on the landing page
2. **Add Transactions** - Use the quick add form on the dashboard
3. **View Analytics** - Navigate to Analytics page for insights
4. **Manage Portfolio** - Check Portfolio page for holdings overview

### Adding Transactions
1. Select the platform (Groww, Kite, PhonePe, etc.)
2. Choose category (Stocks, Mutual Funds, UPI, etc.)
3. Select transaction type (Buy, Sell, Transfer)
4. Enter asset name and amount
5. Add optional quantity and notes
6. Submit to save

### Viewing Data
- **Dashboard** - Overview of all metrics and recent transactions
- **Transactions** - Detailed transaction history with search and filters
- **Analytics** - Visual charts and spending analysis
- **Portfolio** - Current holdings and portfolio breakdown

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔮 Future Enhancements

- **Bank Integration** - Direct API connections to banks
- **Automated Import** - CSV/Excel file import functionality
- **Advanced Analytics** - More detailed financial insights
- **Mobile App** - Native mobile applications
- **Multi-currency** - Support for multiple currencies
- **Tax Reporting** - Automated tax calculation and reporting

---

Built with ❤️ for better financial management and investment tracking.