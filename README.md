# GlenvoShip Authentication API

A comprehensive authentication system for the GlenvoShip platform built with Node.js, TypeScript, Express, Sequelize, and JWT.

## 🚀 Features

- **User Authentication**: Register, login, logout with JWT tokens
- **Role-Based Access Control**: 8 different user roles (Admin, Merchant, Personal Shipper, etc.)
- **Token Management**: Access tokens and refresh tokens with automatic expiration
- **Profile Management**: Update user profiles and change passwords
- **Security**: Password hashing, rate limiting, CORS, Helmet security headers
- **API Documentation**: Complete Swagger/OpenAPI documentation
- **Database Migrations**: Proper Sequelize migrations for database schema
- **TypeScript**: Full TypeScript support with proper type definitions

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd glenvo-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=glenvo_auth
   DB_USER=root
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   JWT_REFRESH_EXPIRES_IN=7d

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # CORS
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Create MySQL database**

   ```sql
   CREATE DATABASE glenvo_auth;
   ```

5. **Run database migrations**

   ```bash
   npm run migrate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

Once the server is running, you can access the interactive API documentation at:

- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 🔐 Authentication Endpoints

### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "companyName": "PFX International Inc."
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Get Profile

```http
GET /api/auth/profile
Authorization: Bearer your-access-token
```

### Update Profile

```http
PUT /api/auth/profile
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "fullName": "John Updated",
  "companyName": "Updated Company"
}
```

### Change Password

```http
POST /api/auth/change-password
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123",
  "confirmNewPassword": "newpassword123"
}
```

### Logout

```http
POST /api/auth/logout
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

## 👥 User Roles

The system supports 8 different user roles:

1. **Admin**: Full system access, managing all configurations and users
2. **Merchant**: Access to shipping operations, order management, and analytics
3. **Personal Shipper**: Manage personal shipments, track packages
4. **Operations Manager**: Oversees logistics, inventory, and supply chain
5. **Customer Support**: Handles customer inquiries and support tickets
6. **Financial Analyst**: Manages financial reporting and invoicing
7. **Marketing Specialist**: Manages promotional campaigns and content
8. **Guest Viewer**: Limited read-only access for monitoring

## 🗄️ Database Schema

### Users Table

- `id` (Primary Key)
- `full_name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `company_name` (VARCHAR, Optional)
- `role` (ENUM)
- `is_active` (BOOLEAN)
- `email_verified` (BOOLEAN)
- `last_login_at` (DATETIME)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### Refresh Tokens Table

- `id` (Primary Key)
- `token` (VARCHAR, Unique)
- `user_id` (Foreign Key)
- `expires_at` (DATETIME)
- `is_revoked` (BOOLEAN)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Production
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server

# Database
npm run migrate     # Run database migrations
npm run migrate:undo # Undo last migration
npm run seed        # Run database seeders
npm run seed:undo   # Undo database seeders
```

## 🔧 Configuration

### Environment Variables

| Variable                  | Description              | Default               |
| ------------------------- | ------------------------ | --------------------- |
| `PORT`                    | Server port              | 3000                  |
| `NODE_ENV`                | Environment              | development           |
| `DB_HOST`                 | Database host            | localhost             |
| `DB_PORT`                 | Database port            | 3306                  |
| `DB_NAME`                 | Database name            | glenvo_auth           |
| `DB_USER`                 | Database user            | root                  |
| `DB_PASSWORD`             | Database password        | -                     |
| `JWT_SECRET`              | JWT secret key           | -                     |
| `JWT_EXPIRES_IN`          | JWT expiration           | 24h                   |
| `JWT_REFRESH_EXPIRES_IN`  | Refresh token expiration | 7d                    |
| `RATE_LIMIT_WINDOW_MS`    | Rate limit window        | 900000                |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window  | 100                   |
| `CORS_ORIGIN`             | CORS origin              | http://localhost:3000 |

## 🛡️ Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: Prevents brute force attacks
- **CORS**: Cross-origin resource sharing protection
- **Helmet**: Security headers
- **Input Validation**: class-validator decorator-based validation
- **SQL Injection Protection**: Sequelize ORM

## 📝 Development

### Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Sequelize models
├── routes/          # API routes
├── utils/           # Utility functions
├── migrations/      # Database migrations
└── server.ts        # Main server file
```

### Adding New Features

1. **Create Model**: Add new model in `src/models/`
2. **Create Migration**: Generate migration with `npx sequelize-cli migration:generate`
3. **Create Controller**: Add controller logic in `src/controllers/`
4. **Create Routes**: Define routes in `src/routes/`
5. **Add Validation**: Create validation schemas in `src/utils/validation.ts`
6. **Update Documentation**: Add Swagger comments to routes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@glenvo.com or create an issue in the repository.

---

**GlenvoShip Team** - Building the future of shipping logistics 🚢
