import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import { join } from "path";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `"${process.env.APP_NAME || "Glenvo"}" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      console.error("Email sending failed:", error);
      throw new Error("Failed to send email");
    }
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    userName: string
  ): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
    
    const html = this.generatePasswordResetTemplate({
      userName,
      resetUrl,
      appName: process.env.APP_NAME || "Glenvo",
      supportEmail: process.env.SUPPORT_EMAIL || "support@glenvo.com",
    });

    await this.sendEmail({
      to: email,
      subject: "Reset Your Password - Glenvo",
      html,
    });
  }

  private generatePasswordResetTemplate(data: {
    userName: string;
    resetUrl: string;
    appName: string;
    supportEmail: string;
  }): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #2c3e50;
        }
        
        .message {
            font-size: 16px;
            margin-bottom: 30px;
            color: #555;
            line-height: 1.8;
        }
        
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            margin: 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
        
        .warning strong {
            color: #d63031;
        }
        
        .footer {
            background-color: #f8f9fa;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        
        .footer p {
            font-size: 14px;
            color: #6c757d;
            margin-bottom: 10px;
        }
        
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        
        .footer a:hover {
            text-decoration: underline;
        }
        
        .expiry-info {
            background-color: #e8f5e8;
            border: 1px solid #c3e6c3;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            color: #155724;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .header {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .reset-button {
                display: block;
                text-align: center;
                margin: 20px auto;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Password Reset</h1>
            <p>${data.appName} - Secure Account Management</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello ${data.userName},
            </div>
            
            <div class="message">
                We received a request to reset your password for your ${data.appName} account. 
                If you didn't make this request, you can safely ignore this email.
            </div>
            
            <div style="text-align: center;">
                <a href="${data.resetUrl}" class="reset-button">
                    Reset My Password
                </a>
            </div>
            
            <div class="expiry-info">
                <strong>⏰ Important:</strong> This password reset link will expire in 1 hour for security reasons.
            </div>
            
            <div class="warning">
                <strong>🔒 Security Notice:</strong> If you didn't request this password reset, 
                please contact our support team immediately at 
                <a href="mailto:${data.supportEmail}">${data.supportEmail}</a>
            </div>
            
            <div class="message">
                If the button above doesn't work, you can copy and paste the following link into your browser:
                <br><br>
                <a href="${data.resetUrl}" style="color: #667eea; word-break: break-all;">
                    ${data.resetUrl}
                </a>
            </div>
        </div>
        
        <div class="footer">
            <p>This email was sent to you because someone requested a password reset for your account.</p>
            <p>If you have any questions, please contact us at 
                <a href="mailto:${data.supportEmail}">${data.supportEmail}</a>
            </p>
            <p>&copy; ${new Date().getFullYear()} ${data.appName}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
  }
}

export default EmailService;
