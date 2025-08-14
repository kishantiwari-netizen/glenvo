import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authenticateToken } from "../../middleware/auth";
import { validateRequest } from "../../middleware/validation";
import {
  LoginDto,
  RegisterDto,
  RefreshTokenDto,
  LogoutDto,
  ChangePasswordDto,
  UpdateProfileDto,
} from "./dto/auth.dto";

const router = Router();

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
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               companyName:
 *                 type: string
 *                 maxLength: 255
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 */
router.post("/register", validateRequest(RegisterDto), AuthController.register);

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
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validateRequest(LoginDto), AuthController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
router.post(
  "/refresh",
  validateRequest(RefreshTokenDto),
  AuthController.refreshToken
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
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
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Authentication required
 */
router.post(
  "/logout",
  authenticateToken,
  validateRequest(LogoutDto),
  AuthController.logout
);

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
 *         description: User profile retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get("/profile", authenticateToken, AuthController.getProfile);

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
 *               fullName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               companyName:
 *                 type: string
 *                 maxLength: 255
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Authentication required
 */
router.put(
  "/profile",
  authenticateToken,
  validateRequest(UpdateProfileDto),
  AuthController.updateProfile
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
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password is incorrect
 *       401:
 *         description: Authentication required
 */
router.post(
  "/change-password",
  authenticateToken,
  validateRequest(ChangePasswordDto),
  AuthController.changePassword
);

/**
 * @swagger
 * /api/auth/account-settings:
 *   get:
 *     summary: Get comprehensive account settings
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account settings retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/account-settings",
  authenticateToken,
  AuthController.getAccountSettings
);

/**
 * @swagger
 * /api/auth/account-settings:
 *   put:
 *     summary: Update account settings
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
 *               personalInfo:
 *                 type: object
 *                 properties:
 *                   fullName:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *               businessInfo:
 *                 type: object
 *                 properties:
 *                   companyName:
 *                     type: string
 *                   businessType:
 *                     type: string
 *                   addressLine1:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       200:
 *         description: Account settings updated successfully
 *       401:
 *         description: Authentication required
 */
router.put(
  "/account-settings",
  authenticateToken,
  AuthController.updateAccountSettings
);

/**
 * @swagger
 * /api/auth/post-login-redirect:
 *   get:
 *     summary: Handle post-login redirection to welcome page
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome page data retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/post-login-redirect",
  authenticateToken,
  AuthController.postLoginRedirect
);

export default router;
