import { Router } from "express";
import {
  setupProfile,
  verifyAddress,
  getProfileSetupStatus,
} from "./profile-setup.controller";
import { authenticateToken } from "../../middleware/auth";
import { validateDTO } from "../../middleware/class-validator";
import { ProfileSetupDto, AddressVerificationDto } from "./dto";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ProfileSetupRequest:
 *       type: object
 *       required:
 *         - email
 *         - phone_number
 *         - country
 *         - currency
 *         - street_address_line_1
 *         - city
 *         - state_province
 *         - postal_code
 *         - account_type
 *       properties:
 *         company_name:
 *           type: string
 *           description: Company name (optional)
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         phone_number:
 *           type: string
 *           description: User's phone number
 *         country:
 *           type: string
 *           description: Country name
 *         currency:
 *           type: string
 *           description: Currency code (e.g., USD, EUR)
 *         street_address_line_1:
 *           type: string
 *           description: Primary street address
 *         street_address_line_2:
 *           type: string
 *           description: Secondary street address (optional)
 *         city:
 *           type: string
 *           description: City name
 *         state:
 *           type: string
 *           description: State or province
 *         postal_code:
 *           type: string
 *           description: Postal/ZIP code
 *         account_type:
 *           type: string
 *           enum: [individual, business]
 *           description: Type of account
 *     AddressVerificationRequest:
 *       type: object
 *       required:
 *         - street1
 *         - city
 *         - state
 *         - zip
 *         - country
 *       properties:
 *         street1:
 *           type: string
 *           description: Primary street address
 *         street2:
 *           type: string
 *           description: Secondary street address (optional)
 *         city:
 *           type: string
 *           description: City name
 *         state:
 *           type: string
 *           description: State name
 *         zip:
 *           type: string
 *           description: ZIP code
 *         country:
 *           type: string
 *           description: Country name
 *         company:
 *           type: string
 *           description: Company name (optional)
 *         name:
 *           type: string
 *           description: Contact name (optional)
 *         phone:
 *           type: string
 *           description: Phone number (optional)
 *     ProfileSetupResponse:
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
 *                 phone_number:
 *                   type: string
 *                 account_type:
 *                   type: string
 *             shipping_profile:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 company_name:
 *                   type: string
 *                 country:
 *                   type: string
 *                 currency:
 *                   type: string
 *                 street_address_line_1:
 *                   type: string
 *                 street_address_line_2:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state_province:
 *                   type: string
 *                 postal_code:
 *                   type: string
 *                 is_profile_setup_complete:
 *                   type: boolean
 *                 easypost_address_id:
 *                   type: string
 *                 easypost_verified_at:
 *                   type: string
 *                   format: date-time
 *             verified_address:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 verified:
 *                   type: boolean
 *     AddressVerificationResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             verified_address:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 verified:
 *                   type: boolean
 *                 street1:
 *                   type: string
 *                 street2:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 zip:
 *                   type: string
 *                 country:
 *                   type: string
 *                 verification_errors:
 *                   type: array
 *                   items:
 *                     type: string
 *     ProfileStatusResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             profile_setup:
 *               type: object
 *               properties:
 *                 is_complete:
 *                   type: boolean
 *                 user_data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone_number:
 *                       type: string
 *                     account_type:
 *                       type: string
 *                     shipping_profile:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         company_name:
 *                           type: string
 *                         country:
 *                           type: string
 *                         currency:
 *                           type: string
 *                         street_address_line_1:
 *                           type: string
 *                         street_address_line_2:
 *                           type: string
 *                         city:
 *                           type: string
 *                         state_province:
 *                           type: string
 *                         postal_code:
 *                           type: string
 *                         is_profile_setup_complete:
 *                           type: boolean
 *                         easypost_address_id:
 *                           type: string
 *                         easypost_verified_at:
 *                           type: string
 *                           format: date-time
 */

/**
 * @swagger
 * /api/profile-setup/setup:
 *   post:
 *     summary: Complete profile setup with address verification
 *     tags: [Profile Setup]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileSetupRequest'
 *     responses:
 *       200:
 *         description: Profile setup completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileSetupResponse'
 *       400:
 *         description: Bad request - validation error or address verification failed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/setup",
  authenticateToken,
  validateDTO(ProfileSetupDto),
  setupProfile
);

/**
 * @swagger
 * /api/profile-setup/verify-address:
 *   post:
 *     summary: Verify address using EasyPost service
 *     tags: [Profile Setup]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressVerificationRequest'
 *     responses:
 *       200:
 *         description: Address verification completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressVerificationResponse'
 *       400:
 *         description: Bad request - validation error
 *       500:
 *         description: Internal server error
 */
router.post(
  "/verify-address",
  validateDTO(AddressVerificationDto),
  verifyAddress
);

/**
 * @swagger
 * /api/profile-setup/status:
 *   get:
 *     summary: Get profile setup status
 *     tags: [Profile Setup]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile setup status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileStatusResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/status", authenticateToken, getProfileSetupStatus);

export default router;
