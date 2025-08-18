# Node.js TypeScript API with Authentication

A complete Node.js TypeScript API with Sequelize, PostgreSQL, Swagger documentation, and Role-based Authentication system.

## Features

- 🔐 **JWT Authentication** with role-based access control
- 👥 **User Management** with CRUD operations
- 🎭 **Role & Permission System** with granular permissions
- 📚 **Swagger API Documentation** with interactive UI
- 🗄️ **PostgreSQL Database** with Sequelize ORM
- 🔒 **Security Features** (Helmet, CORS, Rate Limiting)
- ✅ **Input Validation** with express-validator
- 🏗️ **TypeScript** for type safety
- 📝 **Database Migrations & Seeders**

## Database Schema

### Tables

- `users` - User accounts with profile information
- `roles` - User roles (super_admin, admin, user, moderator)
- `permissions` - Granular permissions (user_create, user_read, etc.)
- `user_roles` - Many-to-many relationship between users and roles
- `role_permissions` - Many-to-many relationship between roles and permissions

### Default Roles & Permissions

- **Super Admin**: All permissions
- **Admin**: User and role management permissions
- **Moderator**: User read and update permissions
- **User**: Basic read permissions

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd api-with-auth
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Edit `.env` file with your database credentials:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=api_auth_db
   DB_USER=postgres
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Create PostgreSQL database**

   ```sql
   CREATE DATABASE api_auth_db;
   ```

5. **Run database migrations and seeders**

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

6. **Build and start the application**

   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

## API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:3000/api-docs
```

## Default Admin Account

After running the seeders, you'll have a default super admin account:

- **Email**: admin@example.com
- **Password**: admin123

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### User Management

- `GET /api/users` - Get all users (with pagination and filters)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (soft delete)
- `POST /api/users/:id/roles` - Assign roles to user

## Usage Examples

### 1. Register a new user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### 3. Get users (with authentication)

```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Create a new user (admin only)

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com",
    "password": "password123",
    "role_ids": [2]
  }'
```

## Database Commands

```bash
# Run migrations
npm run db:migrate

# Run seeders
npm run db:seed

# Reset database (drop, create, migrate, seed)
npm run db:reset
```

## Project Structure

```
├── src/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── index.ts         # Main application file
├── db/
│   ├── config/          # Database configuration
│   ├── migrations/      # Database migrations
│   └── seeders/         # Database seeders
├── package.json
├── tsconfig.json
├── .sequelizerc
└── README.md
```

## Security Features

- **JWT Authentication** with configurable expiration
- **Role-based Access Control** with granular permissions
- **Password Hashing** using bcrypt
- **Input Validation** with express-validator
- **Rate Limiting** to prevent abuse
- **CORS Protection** with configurable origins
- **Helmet** for security headers
- **SQL Injection Protection** via Sequelize

## Environment Variables

| Variable                  | Description             | Default     |
| ------------------------- | ----------------------- | ----------- |
| `DB_HOST`                 | PostgreSQL host         | localhost   |
| `DB_PORT`                 | PostgreSQL port         | 5432        |
| `DB_NAME`                 | Database name           | api_auth_db |
| `DB_USER`                 | Database user           | postgres    |
| `DB_PASSWORD`             | Database password       | -           |
| `JWT_SECRET`              | JWT secret key          | -           |
| `JWT_EXPIRES_IN`          | JWT expiration time     | 24h         |
| `PORT`                    | Server port             | 3000        |
| `NODE_ENV`                | Environment             | development |
| `RATE_LIMIT_WINDOW_MS`    | Rate limit window       | 900000      |
| `RATE_LIMIT_MAX_REQUESTS` | Rate limit max requests | 100         |

## Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Testing

The API includes comprehensive error handling and validation. You can test all endpoints using the Swagger UI or tools like Postman.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
