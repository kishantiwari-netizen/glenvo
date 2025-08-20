import { Router } from 'express';
import { AccountSettingsController } from './account-settings.controller';
import { authenticateToken } from '../../middleware/auth';
import { validateDTO } from '../../middleware/class-validator';
import { UpdatePersonalInfoDto } from './dto/personal-info.dto';
import { UpdateBusinessInfoDto } from './dto/business-info.dto';

const router = Router();
const accountSettingsController = new AccountSettingsController();

/**
 * @swagger
 * /api/account-settings:
 *   get:
 *     summary: Get account settings
 *     description: Retrieve current user's account settings including personal and business information
 *     tags: [Account Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Account settings retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     personal_info:
 *                       type: object
 *                       properties:
 *                         first_name:
 *                           type: string
 *                           example: "Jane"
 *                         last_name:
 *                           type: string
 *                           example: "Doe"
 *                         email:
 *                           type: string
 *                           example: "jane.doe@example.com"
 *                         phone_number:
 *                           type: string
 *                           example: "+1 (555) 123-4567"
 *                         full_name:
 *                           type: string
 *                           example: "Jane Doe"
 *                     business_info:
 *                       type: object
 *                       properties:
 *                         company_name:
 *                           type: string
 *                           example: "Global Logistics Solutions Inc."
 *                         business_type:
 *                           type: string
 *                           example: "eCommerce Retailer"
 *                         address_line_1:
 *                           type: string
 *                           example: "123 Commerce St, Suite 100"
 *                         address_line_2:
 *                           type: string
 *                           example: "Building A"
 *                         city:
 *                           type: string
 *                           example: "Metropolis"
 *                         state_province:
 *                           type: string
 *                           example: "CA"
 *                         postal_code:
 *                           type: string
 *                           example: "90210"
 *                         country:
 *                           type: string
 *                           example: "US"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, accountSettingsController.getAccountSettings);

/**
 * @swagger
 * /api/account-settings/personal-info:
 *   put:
 *     summary: Update personal information
 *     description: Update user's personal information (name, email, phone)
 *     tags: [Account Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, last_name, email]
 *             properties:
 *               first_name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 example: "Jane"
 *               last_name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jane.doe@example.com"
 *               phone_number:
 *                 type: string
 *                 example: "+1 (555) 123-4567"
 *     responses:
 *       200:
 *         description: Personal information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Personal information updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     personal_info:
 *                       type: object
 *                     business_info:
 *                       type: object
 *       400:
 *         description: Bad request - validation error or email already in use
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/personal-info',
  authenticateToken,
  validateDTO(UpdatePersonalInfoDto),
  accountSettingsController.updatePersonalInfo
);

/**
 * @swagger
 * /api/account-settings/business-info:
 *   put:
 *     summary: Update business information
 *     description: Update user's business information (company details, address)
 *     tags: [Account Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [company_name, business_type, address_line_1, city, state_province, postal_code, country]
 *             properties:
 *               company_name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: "Global Logistics Solutions Inc."
 *               business_type:
 *                 type: string
 *                 enum: [eCommerce Retailer, Wholesale Distributor, Manufacturer, Dropshipper, Marketplace Seller, Other]
 *                 example: "eCommerce Retailer"
 *               address_line_1:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 example: "123 Commerce St, Suite 100"
 *               address_line_2:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Building A"
 *               city:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: "Metropolis"
 *               state_province:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: "CA"
 *               postal_code:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 20
 *                 example: "90210"
 *               country:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 2
 *                 example: "US"
 *     responses:
 *       200:
 *         description: Business information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Business information updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     personal_info:
 *                       type: object
 *                     business_info:
 *                       type: object
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/business-info',
  authenticateToken,
  validateDTO(UpdateBusinessInfoDto),
  accountSettingsController.updateBusinessInfo
);

/**
 * @swagger
 * /api/account-settings:
 *   put:
 *     summary: Update account settings
 *     description: Update both personal and business information in a single request
 *     tags: [Account Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personal_info:
 *                 type: object
 *                 required: [first_name, last_name, email]
 *                 properties:
 *                   first_name:
 *                     type: string
 *                     minLength: 1
 *                     maxLength: 50
 *                     example: "Jane"
 *                   last_name:
 *                     type: string
 *                     minLength: 1
 *                     maxLength: 50
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "jane.doe@example.com"
 *                   phone_number:
 *                     type: string
 *                     example: "+1 (555) 123-4567"
 *               business_info:
 *                 type: object
 *                 required: [company_name, business_type, address_line_1, city, state_province, postal_code, country]
 *                 properties:
 *                   company_name:
 *                     type: string
 *                     minLength: 1
 *                     maxLength: 100
 *                     example: "Global Logistics Solutions Inc."
 *                   business_type:
 *                     type: string
 *                     enum: [eCommerce Retailer, Wholesale Distributor, Manufacturer, Dropshipper, Marketplace Seller, Other]
 *                     example: "eCommerce Retailer"
 *                   address_line_1:
 *                     type: string
 *                     minLength: 1
 *                     maxLength: 255
 *                     example: "123 Commerce St, Suite 100"
 *                   address_line_2:
 *                     type: string
 *                     maxLength: 255
 *                     example: "Building A"
 *                   city:
 *                     type: string
 *                     minLength: 1
 *                     maxLength: 100
 *                     example: "Metropolis"
 *                   state_province:
 *                     type: string
 *                     minLength: 1
 *                     maxLength: 100
 *                     example: "CA"
 *                   postal_code:
 *                     type: string
 *                     minLength: 1
 *                     maxLength: 20
 *                     example: "90210"
 *                   country:
 *                     type: string
 *                     minLength: 2
 *                     maxLength: 2
 *                     example: "US"
 *     responses:
 *       200:
 *         description: Account settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Account settings updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     personal_info:
 *                       type: object
 *                     business_info:
 *                       type: object
 *       400:
 *         description: Bad request - validation error or email already in use
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/',
  authenticateToken,
  accountSettingsController.updateAccountSettings
);

export default router;
