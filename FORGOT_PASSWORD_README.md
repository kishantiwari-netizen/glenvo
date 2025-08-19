# Forgot Password Flow Implementation

This document describes the complete forgot password flow implementation in the Glenvo application.

## Overview

The forgot password flow allows users to reset their password securely through email verification. The implementation includes:

1. **Request Password Reset** - User enters their email address
2. **Email Verification** - System sends a secure reset link via email
3. **Token Verification** - Frontend verifies the reset token
4. **Password Reset** - User sets a new password

## Features

- ✅ Secure token generation using crypto.randomBytes(32)
- ✅ Token expiration (1 hour)
- ✅ Responsive and dynamic email template
- ✅ Email validation and error handling
- ✅ Password strength validation
- ✅ Security best practices (no user enumeration)
- ✅ Comprehensive API documentation with Swagger

## API Endpoints

### 1. Request Password Reset
```
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent"
}
```

### 2. Verify Reset Token
```
POST /api/auth/verify-reset-token
```

**Request Body:**
```json
{
  "reset_token": "abc123..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reset token is valid"
}
```

### 3. Reset Password
```
POST /api/auth/reset-password
```

**Request Body:**
```json
{
  "reset_token": "abc123...",
  "password": "NewPassword123",
  "confirm_password": "NewPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

## Email Template

The password reset email includes:

- **Responsive Design** - Works on desktop and mobile
- **Dynamic Content** - Personalized with user's name
- **Security Information** - Clear expiry notice and security warnings
- **Fallback Link** - Text link in case button doesn't work
- **Branding** - Consistent with application design

### Email Template Features:
- ✅ Gradient header with app branding
- ✅ Personalized greeting
- ✅ Clear call-to-action button
- ✅ Security warnings and expiry information
- ✅ Support contact information
- ✅ Mobile-responsive design
- ✅ Professional styling with hover effects

## Environment Configuration

Add the following variables to your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
APP_NAME=Glenvo
SUPPORT_EMAIL=support@glenvo.com
```

### Gmail Setup Instructions:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. **Use the generated password** in `SMTP_PASS`

## Security Features

### Token Security:
- **32-byte random token** using crypto.randomBytes()
- **1-hour expiration** for security
- **Single-use tokens** (cleared after password reset)
- **No user enumeration** (same response for existing/non-existing emails)

### Password Requirements:
- Minimum 6 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number
- Password confirmation validation

### Email Security:
- **HTTPS links** only
- **Secure SMTP** configuration
- **Rate limiting** (implemented via existing middleware)
- **No sensitive data** in email content

## Database Schema

The implementation uses existing fields in the `users` table:

```sql
-- Existing fields used for password reset
password_reset_token VARCHAR(255) NULL
password_reset_expires TIMESTAMP NULL
```

## Frontend Integration

### 1. Forgot Password Page
```javascript
// Request password reset
const response = await fetch('/api/auth/forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: userEmail })
});
```

### 2. Reset Password Page
```javascript
// Get token from URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

// Verify token first
const verifyResponse = await fetch('/api/auth/verify-reset-token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ reset_token: token })
});

// Reset password
const resetResponse = await fetch('/api/auth/reset-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    reset_token: token,
    password: newPassword,
    confirm_password: confirmPassword
  })
});
```

## Error Handling

### Common Error Responses:

**Invalid Email:**
```json
{
  "success": false,
  "message": "Please provide a valid email address"
}
```

**Invalid/Expired Token:**
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

**Password Mismatch:**
```json
{
  "success": false,
  "message": "Passwords do not match"
}
```

**Weak Password:**
```json
{
  "success": false,
  "message": "Password must contain at least one uppercase letter, one lowercase letter, and one number"
}
```

## Testing

### Manual Testing Steps:

1. **Request Reset:**
   - Navigate to forgot password page
   - Enter valid email address
   - Check email for reset link

2. **Verify Token:**
   - Click reset link in email
   - Verify token is accepted

3. **Reset Password:**
   - Enter new password
   - Confirm password
   - Verify successful reset

4. **Security Testing:**
   - Try expired token
   - Try invalid token
   - Try weak password
   - Try mismatched passwords

### Automated Testing:
```javascript
// Example test cases
describe('Forgot Password Flow', () => {
  test('should send reset email for valid user', async () => {
    // Test implementation
  });
  
  test('should reject invalid email format', async () => {
    // Test implementation
  });
  
  test('should reject expired token', async () => {
    // Test implementation
  });
});
```

## Dependencies

The implementation uses the following packages:

```json
{
  "nodemailer": "^6.9.0",
  "@types/nodemailer": "^6.4.0"
}
```

## Files Modified/Created

### New Files:
- `src/utils/emailService.ts` - Email service with nodemailer
- `src/utils/validators.ts` - Custom validation decorators
- `src/modules/auth/dto/forgot-password.dto.ts` - DTO for forgot password
- `src/modules/auth/dto/reset-password.dto.ts` - DTO for reset password
- `src/modules/auth/dto/verify-reset-token.dto.ts` - DTO for token verification

### Modified Files:
- `src/modules/auth/auth.controller.ts` - Added forgot password functions
- `src/modules/auth/auth.routes.ts` - Added new routes
- `src/modules/auth/dto/index.ts` - Exported new DTOs
- `env.example` - Added email configuration

## Troubleshooting

### Common Issues:

1. **Email Not Sending:**
   - Check SMTP configuration
   - Verify Gmail app password
   - Check firewall/network settings

2. **Token Expiration:**
   - Tokens expire after 1 hour
   - Request new reset link if expired

3. **Password Validation:**
   - Ensure password meets requirements
   - Check password confirmation matches

4. **Frontend Integration:**
   - Verify token extraction from URL
   - Check API endpoint URLs
   - Ensure proper error handling

## Support

For issues or questions regarding the forgot password implementation:

- **Email:** support@glenvo.com
- **Documentation:** Check this README and API docs
- **Logs:** Check application logs for detailed error messages

## Security Considerations

- **Never log reset tokens** in production
- **Use HTTPS** in production environment
- **Implement rate limiting** for reset requests
- **Monitor for abuse** and implement additional security if needed
- **Regular security audits** of the implementation
