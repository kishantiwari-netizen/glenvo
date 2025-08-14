# Database Setup for GlenvoShip Authentication

This directory contains all database-related files for the GlenvoShip Authentication module.

## Directory Structure

```
db/
├── config/
│   ├── database.js     # Sequelize CLI configuration
│   └── database.ts     # TypeScript database configuration
├── models/
│   ├── User.ts         # User model
│   ├── RefreshToken.ts # Refresh token model
│   ├── Role.ts         # Role model
│   ├── Permission.ts   # Permission model (New)
│   ├── RolePermission.ts # Role-Permission junction (New)
│   └── index.ts        # Model associations
├── migrations/
│   ├── 20231201000000-create-permissions.js # New
│   ├── 20231201000001-create-role-permissions.js # New
│   ├── 20231201000002-create-roles.js
│   ├── 20231201000003-create-users.js
│   └── 20231201000004-create-refresh-tokens.js
├── seeders/
│   ├── 20231201000000-demo-permissions.js # New
│   ├── 20231201000001-demo-roles.js
│   ├── 20231201000002-demo-role-permissions.js # New
│   └── 20231201000003-demo-users.js
└── README.md           # This file
```

## Database Models

### User Model

- **id**: Primary key (auto-increment)
- **fullName**: User's full name (2-100 characters)
- **email**: Unique email address
- **password**: Hashed password (6-255 characters)
- **companyName**: Optional company name
- **roleId**: Foreign key to roles table
- **isActive**: Account status
- **emailVerified**: Email verification status
- **lastLoginAt**: Last login timestamp
- **createdAt/updatedAt**: Timestamps

### Role Model

- **id**: Primary key (auto-increment)
- **name**: Unique role name (2-50 characters)
- **description**: Role description (5-255 characters)
- **isActive**: Role status
- **createdAt/updatedAt**: Timestamps

### Permission Model (New)

- **id**: Primary key (auto-increment)
- **name**: Unique permission name (2-100 characters)
- **description**: Permission description (5-255 characters)
- **resource**: Resource being accessed (2-50 characters)
- **action**: Action being performed (2-50 characters)
- **scope**: Optional scope (1-50 characters)
- **isActive**: Permission status
- **createdAt/updatedAt**: Timestamps

### RolePermission Model (New)

- **id**: Primary key (auto-increment)
- **roleId**: Foreign key to roles table
- **permissionId**: Foreign key to permissions table
- **createdAt/updatedAt**: Timestamps

### RefreshToken Model

- **id**: Primary key (auto-increment)
- **token**: Unique refresh token string
- **userId**: Foreign key to users table
- **expiresAt**: Token expiration date
- **isRevoked**: Token revocation status
- **createdAt/updatedAt**: Timestamps

## Database Setup Commands

### Initial Setup

```bash
# Run migrations to create tables
npm run migrate

# Seed the database with demo data (including permissions)
npm run seed:permissions

# Or run both in sequence
npm run db:setup:permissions
```

### Development Commands

```bash
# Test database connection and models
npm run db:test

# Reset migrations (undo all and re-run)
npm run migrate:reset

# Undo last migration
npm run migrate:undo

# Undo all seeders
npm run seed:undo
```

### Production Commands

```bash
# Run migrations only (no seeding in production)
npm run migrate
```

## Environment Variables

Make sure to set these environment variables in your `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=glenvo_auth_dev
DB_NAME_TEST=glenvo_auth_test

# For production
NODE_ENV=production
```

## Demo Users

The seeder creates three demo users:

1. **Admin User**

   - Email: admin@glenvo.com
   - Password: admin123
   - Role: admin

2. **Regular User**

   - Email: john.doe@example.com
   - Password: password123
   - Role: user

3. **Manager User**
   - Email: jane.smith@example.com
   - Password: password123
   - Role: manager

## Database Indexes

The following indexes are created for optimal performance:

### Users Table

- `users_email_unique`: Unique index on email
- `users_role_id_index`: Index on role_id
- `users_is_active_index`: Index on is_active

### Roles Table

- `roles_name_unique`: Unique index on name
- `roles_is_active_index`: Index on is_active

### Permissions Table (New)

- `permissions_name_unique`: Unique index on name
- `permissions_resource_action_index`: Composite index on resource and action
- `permissions_is_active_index`: Index on is_active

### RolePermissions Table (New)

- `role_permissions_unique`: Unique composite index on role_id and permission_id
- `role_permissions_role_id_index`: Index on role_id
- `role_permissions_permission_id_index`: Index on permission_id

### Refresh Tokens Table

- `refresh_tokens_token_unique`: Unique index on token
- `refresh_tokens_user_id_index`: Index on user_id
- `refresh_tokens_expires_at_index`: Index on expires_at
- `refresh_tokens_is_revoked_index`: Index on is_revoked

## Associations

- **User** has many **RefreshToken** (one-to-many)
- **RefreshToken** belongs to **User** (many-to-one)
- **Role** has many **User** (one-to-many)
- **User** belongs to **Role** (many-to-one)
- **Role** has many **Permission** (many-to-many through RolePermission)
- **Permission** has many **Role** (many-to-many through RolePermission)

## Security Features

- Passwords are hashed using bcrypt with 12 salt rounds
- Refresh tokens have expiration dates
- Tokens can be revoked
- Email addresses are validated
- Role-based access control with granular permissions
- Relational permission system for flexible access control
- Resource-action-scope permission model
- Many-to-many role-permission relationships

## Troubleshooting

### Common Issues

1. **Connection Refused**

   - Ensure MySQL server is running
   - Check database credentials in `.env`
   - Verify database exists

2. **Migration Errors**

   - Check if tables already exist
   - Run `npm run migrate:reset` to start fresh

3. **Model Import Errors**
   - Ensure TypeScript configuration includes `db/**/*`
   - Check import paths in your code

### Testing Database

Run the database test to verify everything is working:

```bash
npm run db:test
```

This will test:

- Database connection
- Model synchronization
- User creation and retrieval
- Password hashing and comparison
- Refresh token creation
- Data cleanup
