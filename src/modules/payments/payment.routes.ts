import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { authenticateToken } from "../../middleware/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment methods and addresses management
 */

/**
 * @swagger
 * /api/payment-methods:
 *   get:
 *     summary: Get all payment methods for user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment methods retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/payment-methods",
  authenticateToken,
  PaymentController.getPaymentMethods
);

/**
 * @swagger
 * /api/payment-methods:
 *   post:
 *     summary: Add new payment method
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardNumber
 *               - cardholderName
 *               - expiryMonth
 *               - expiryYear
 *               - cvv
 *             properties:
 *               cardNumber:
 *                 type: string
 *                 pattern: '^[0-9]{13,19}$'
 *               cardholderName:
 *                 type: string
 *               expiryMonth:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *               expiryYear:
 *                 type: integer
 *                 minimum: 2024
 *               cvv:
 *                 type: string
 *                 pattern: '^[0-9]{3,4}$'
 *     responses:
 *       201:
 *         description: Payment method added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.post(
  "/payment-methods",
  authenticateToken,
  PaymentController.addPaymentMethod
);

/**
 * @swagger
 * /api/payment-methods/{id}/default:
 *   patch:
 *     summary: Set default payment method
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment method ID
 *     responses:
 *       200:
 *         description: Default payment method updated successfully
 *       404:
 *         description: Payment method not found
 *       401:
 *         description: Authentication required
 */
router.patch(
  "/payment-methods/:id/default",
  authenticateToken,
  PaymentController.setDefaultPaymentMethod
);

/**
 * @swagger
 * /api/payment-methods/{id}:
 *   delete:
 *     summary: Delete payment method
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment method ID
 *     responses:
 *       200:
 *         description: Payment method deleted successfully
 *       404:
 *         description: Payment method not found
 *       401:
 *         description: Authentication required
 */
router.delete(
  "/payment-methods/:id",
  authenticateToken,
  PaymentController.deletePaymentMethod
);

/**
 * @swagger
 * /api/addresses/saved:
 *   get:
 *     summary: Get saved addresses for user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saved addresses retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/addresses/saved",
  authenticateToken,
  PaymentController.getSavedAddresses
);

/**
 * @swagger
 * /api/addresses/saved:
 *   post:
 *     summary: Add new saved address
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - streetAddress
 *               - city
 *               - state
 *               - zipCode
 *               - country
 *             properties:
 *               name:
 *                 type: string
 *                 description: Address nickname (e.g., Home, Work)
 *               streetAddress:
 *                 type: string
 *               streetAddress2:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipCode:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       201:
 *         description: Address saved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.post(
  "/addresses/saved",
  authenticateToken,
  PaymentController.addSavedAddress
);

/**
 * @swagger
 * /api/addresses/saved/{id}:
 *   put:
 *     summary: Update saved address
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               streetAddress:
 *                 type: string
 *               streetAddress2:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipCode:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       404:
 *         description: Address not found
 *       401:
 *         description: Authentication required
 */
router.put(
  "/addresses/saved/:id",
  authenticateToken,
  PaymentController.updateSavedAddress
);

/**
 * @swagger
 * /api/addresses/saved/{id}:
 *   delete:
 *     summary: Delete saved address
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       404:
 *         description: Address not found
 *       401:
 *         description: Authentication required
 */
router.delete(
  "/addresses/saved/:id",
  authenticateToken,
  PaymentController.deleteSavedAddress
);

/**
 * @swagger
 * /api/payments/billing-info:
 *   get:
 *     summary: Get billing information for user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Billing information retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get(
  "/billing-info",
  authenticateToken,
  PaymentController.getBillingInformation
);

/**
 * @swagger
 * /api/payments/billing-info:
 *   put:
 *     summary: Update billing information
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               taxId:
 *                 type: string
 *               address:
 *                 type: object
 *     responses:
 *       200:
 *         description: Billing information updated successfully
 *       401:
 *         description: Authentication required
 */
router.put(
  "/billing-info",
  authenticateToken,
  PaymentController.updateBillingInformation
);

/**
 * @swagger
 * /api/payments/payment-methods/{id}/primary:
 *   put:
 *     summary: Set payment method as primary
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment method ID
 *     responses:
 *       200:
 *         description: Payment method set as primary successfully
 *       401:
 *         description: Authentication required
 */
router.put(
  "/payment-methods/:id/primary",
  authenticateToken,
  PaymentController.setPrimaryPaymentMethod
);

export default router;
