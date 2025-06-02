# FinLedger Spring Boot Backend

This is the Java Spring Boot backend for the FinLedger financial transaction tracking application.

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** with OAuth2/OIDC
- **Spring Data JPA** with PostgreSQL
- **Maven** for dependency management

## Project Structure

```
src/main/java/com/finledger/backend/
├── FinLedgerApplication.java          # Main application class
├── config/
│   └── SecurityConfig.java           # Security and OAuth2 configuration
├── controller/
│   ├── AuthController.java           # Authentication endpoints
│   ├── TransactionController.java    # Transaction CRUD operations
│   └── AnalyticsController.java      # Analytics and metrics
├── dto/
│   └── TransactionDto.java          # Data Transfer Objects
├── entity/
│   ├── User.java                    # User entity
│   └── Transaction.java            # Transaction entity
├── repository/
│   ├── UserRepository.java         # User data access
│   └── TransactionRepository.java  # Transaction data access
└── service/
    ├── UserService.java            # User business logic
    └── TransactionService.java    # Transaction business logic
```

## API Endpoints

### Authentication
- `GET /api/auth/user` - Get current authenticated user
- `GET /login` - OAuth2 login redirect
- `POST /api/logout` - User logout

### Transactions
- `GET /api/transactions` - List transactions with filtering and pagination
- `GET /api/transactions/{id}` - Get specific transaction
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction

### Analytics
- `GET /api/portfolio/metrics` - Portfolio overview metrics
- `GET /api/analytics/categories` - Category-wise spending analysis
- `GET /api/analytics/trends` - Monthly spending and investment trends

## Environment Variables

Set these environment variables for the application to work:

```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/finledger
REPL_ID=your_replit_app_id
CLIENT_SECRET=your_oauth_client_secret (optional)
ISSUER_URL=https://replit.com/oidc (optional, defaults to Replit OIDC)
```

## Running the Application

### Using Maven

1. **Install dependencies:**
   ```bash
   ./mvnw clean install
   ```

2. **Run the application:**
   ```bash
   ./mvnw spring-boot:run
   ```

The application will start on `http://localhost:8080`

### Using Docker

1. **Build Docker image:**
   ```bash
   docker build -t finledger-backend .
   ```

2. **Run container:**
   ```bash
   docker run -p 8080:8080 \
     -e DATABASE_URL=your_db_url \
     -e REPL_ID=your_repl_id \
     finledger-backend
   ```

## Database Schema

The application uses JPA/Hibernate for automatic schema generation. The main entities are:

### Users Table
- `id` (String, Primary Key) - User ID from OAuth provider
- `email` (String, Unique) - User email
- `first_name` (String) - First name
- `last_name` (String) - Last name
- `profile_image_url` (String) - Profile picture URL
- `created_at` (Timestamp) - Account creation time
- `updated_at` (Timestamp) - Last update time

### Transactions Table
- `id` (Long, Primary Key, Auto-increment)
- `user_id` (String, Foreign Key) - Reference to Users
- `platform` (String) - Trading/payment platform
- `category` (String) - Asset category
- `type` (Enum) - BUY, SELL, TRANSFER
- `asset_name` (String) - Name of asset/investment
- `amount` (Decimal) - Transaction amount
- `quantity` (Decimal) - Asset quantity
- `date` (Date) - Transaction date
- `notes` (String) - Optional notes
- `created_at` (Timestamp) - Record creation time
- `updated_at` (Timestamp) - Last update time

## Security Features

- **OAuth2/OIDC Authentication** with Replit as provider
- **CORS Configuration** for cross-origin requests
- **Method-level Security** for API endpoints
- **Automatic User Provisioning** from OAuth claims
- **Session Management** with Spring Security

## Development

### Adding New Features

1. **Create Entity** in `entity/` package
2. **Create Repository** in `repository/` package
3. **Create Service** in `service/` package
4. **Create Controller** in `controller/` package
5. **Add DTOs** in `dto/` package if needed

### Testing

Run tests with Maven:
```bash
./mvnw test
```

### Building for Production

Create production JAR:
```bash
./mvnw clean package -Pprod
```

The JAR file will be in `target/finledger-backend-1.0.0.jar`

## Configuration

### Database Configuration
The application supports PostgreSQL. Update `application.yml` for different database configurations.

### OAuth2 Configuration
Configure OAuth2 providers in `application.yml`. Currently configured for Replit OIDC.

### Logging
Adjust logging levels in `application.yml` for different environments.

## Deployment

### Replit Deployment
1. Set environment variables in Replit Secrets
2. The application will automatically deploy on Replit

### Cloud Deployment
1. Package the application: `./mvnw clean package`
2. Deploy the JAR file to your cloud provider
3. Configure environment variables
4. Ensure PostgreSQL database is accessible

## Performance Considerations

- **Connection Pooling** - Configured via Spring Boot defaults
- **Query Optimization** - Custom queries for analytics
- **Pagination** - All list endpoints support pagination
- **Caching** - Can be added using Spring Cache annotations

## Monitoring

The application includes Spring Boot Actuator endpoints for monitoring:
- `/actuator/health` - Health check
- `/actuator/metrics` - Application metrics
- `/actuator/info` - Application information

Enable these in production by adding:
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,info
```