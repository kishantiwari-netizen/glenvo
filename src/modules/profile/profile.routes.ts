import { Router } from "express";
import { ProfileController } from "./profile.controller";
import { authenticateToken } from "../../middleware/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile and shipping setup management
 */

/**
 * @swagger
 * /api/profile/shipping:
 *   get:
 *     summary: Get shipping profile for user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shipping profile retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/shipping",
  authenticateToken,
  ProfileController.getShippingProfile
);

/**
 * @swagger
 * /api/profile/shipping:
 *   put:
 *     summary: Update shipping profile
 *     tags: [Profile]
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
 *                   email:
 *                     type: string
 *                     format: email
 *                   companyName:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   country:
 *                     type: string
 *                   currency:
 *                     type: string
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   streetAddress1:
 *                     type: string
 *                   streetAddress2:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *               accountType:
 *                 type: string
 *                 enum: [merchant, personal]
 *               businessType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Shipping profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.put(
  "/shipping",
  authenticateToken,
  ProfileController.updateShippingProfile
);

/**
 * @swagger
 * /api/profile/easypost-subaccount:
 *   post:
 *     summary: Create EasyPost sub-account for user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - country
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               companyName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       201:
 *         description: EasyPost sub-account created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.post(
  "/easypost-subaccount",
  authenticateToken,
  ProfileController.createEasyPostSubAccount
);

/**
 * @swagger
 * /api/profile/carriers:
 *   get:
 *     summary: Get available carriers by country
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Country to get carriers for
 *     responses:
 *       200:
 *         description: Available carriers retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/carriers",
  authenticateToken,
  ProfileController.getAvailableCarriers
);

/**
 * @swagger
 * /api/profile/business-types:
 *   get:
 *     summary: Get available business types
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Business types retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/business-types",
  authenticateToken,
  ProfileController.getBusinessTypes
);

/**
 * @swagger
 * /api/profile/validate-address:
 *   post:
 *     summary: Validate address via EasyPost API
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *             properties:
 *               address:
 *                 type: object
 *                 properties:
 *                   streetAddress1:
 *                     type: string
 *                   streetAddress2:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   postalCode:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       200:
 *         description: Address validated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.post(
  "/validate-address",
  authenticateToken,
  ProfileController.validateAddress
);

/**
 * @swagger
 * /api/profile/currency:
 *   get:
 *     summary: Get currency by country
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Country to get currency for
 *     responses:
 *       200:
 *         description: Currency retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/currency",
  authenticateToken,
  ProfileController.getCurrencyByCountry
);

export default router;
