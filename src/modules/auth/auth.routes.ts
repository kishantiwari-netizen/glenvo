import { Router } from "express";
import * as authController from "./auth.controller";
import { authenticateToken } from "../../middleware/auth";
import { validateDTO } from "../../middleware/class-validator";
import {
  RegisterDTO,
  LoginDTO,
  UpdateProfileDTO,
  ChangePasswordDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  VerifyResetTokenDTO,
} from "./dto";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           minLength: 6
 *           description: User's password
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *       properties:
 *         first_name:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: User's first name
 *         last_name:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *           description: User's last name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           minLength: 6
 *           description: User's password
 *         phone_number:
 *           type: string
 *           description: User's phone number
 *         date_of_birth:
 *           type: string
 *           format: date
 *           description: User's date of birth
 *         account_type:
 *           type: string
 *           enum: [individual, business]
 *           description: Type of account (individual or business)
 *         agreement_acceptance:
 *           type: boolean
 *           description: Whether user accepted terms of service
 *         marketing_opt_in:
 *           type: boolean
 *           description: Whether user opted in for marketing communications
 *         social_media_acceptance:
 *           type: boolean
 *           description: Whether user accepted social media terms
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: string
 *             token:
 *               type: string
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request - validation error or user already exists
 *       500:
 *         description: Internal server error
 */
router.post("/register", validateDTO(RegisterDTO), authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", validateDTO(LoginDTO), authController.login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/profile", authenticateToken, authController.getProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               profile_picture:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.put(
  "/profile",
  authenticateToken,
  validateDTO(UpdateProfileDTO),
  authController.updateProfile
);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - current_password
 *               - new_password
 *             properties:
 *               current_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password is incorrect
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/change-password",
  authenticateToken,
  validateDTO(ChangePasswordDTO),
  authController.changePassword
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Internal server error
 */
router.post(
  "/forgot-password",
  validateDTO(ForgotPasswordDTO),
  authController.forgotPassword
);

/**
 * @swagger
 * /api/auth/verify-reset-token:
 *   post:
 *     summary: Verify password reset token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reset_token
 *             properties:
 *               reset_token:
 *                 type: string
 *                 description: Password reset token from email
 *     responses:
 *       200:
 *         description: Reset token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - invalid or expired token
 *       500:
 *         description: Internal server error
 */
router.post(
  "/verify-reset-token",
  validateDTO(VerifyResetTokenDTO),
  authController.verifyResetToken
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using reset token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reset_token
 *               - password
 *               - confirm_password
 *             properties:
 *               reset_token:
 *                 type: string
 *                 description: Password reset token from email
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: New password
 *               confirm_password:
 *                 type: string
 *                 description: Confirm new password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - validation error or invalid token
 *       500:
 *         description: Internal server error
 */
router.post(
  "/reset-password",
  validateDTO(ResetPasswordDTO),
  authController.resetPassword
);

export default router;
