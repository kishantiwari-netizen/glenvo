import { Router } from "express";
import { PaymentsController } from "./payments.controller";
import { authenticateToken } from "../../middleware/auth";
import { validateDTO } from "../../middleware/class-validator";
import {
  CreatePaymentDto,
  ConfirmPaymentDto,
  CreateSubscriptionDto,
  CancelSubscriptionDto,
  CreateRefundDto,
} from "./dto";

const router = Router();
const paymentsController = new PaymentsController();

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePaymentDto:
 *       type: object
 *       required:
 *         - amount
 *       properties:
 *         amount:
 *           type: number
 *           minimum: 0.01
 *           description: Payment amount
 *         currency:
 *           type: string
 *           enum: [USD, EUR, GBP, CAD, AUD]
 *           default: USD
 *           description: Payment currency
 *         description:
 *           type: string
 *           description: Payment description
 *         metadata:
 *           type: object
 *           description: Additional metadata
 *         payment_method_id:
 *           type: string
 *           description: Stripe payment method ID
 *
 *     ConfirmPaymentDto:
 *       type: object
 *       required:
 *         - payment_intent_id
 *       properties:
 *         payment_intent_id:
 *           type: string
 *           description: Stripe payment intent ID
 *         payment_method_id:
 *           type: string
 *           description: Stripe payment method ID
 *
 *     CreateSubscriptionDto:
 *       type: object
 *       required:
 *         - price_id
 *       properties:
 *         price_id:
 *           type: string
 *           description: Stripe price ID
 *         payment_method_id:
 *           type: string
 *           description: Stripe payment method ID
 *         trial_days:
 *           type: number
 *           description: Number of trial days
 *
 *     CancelSubscriptionDto:
 *       type: object
 *       required:
 *         - subscription_id
 *       properties:
 *         subscription_id:
 *           type: string
 *           description: Stripe subscription ID
 *         cancel_at_period_end:
 *           type: boolean
 *           default: true
 *           description: Whether to cancel at period end
 *
 *     CreateRefundDto:
 *       type: object
 *       required:
 *         - payment_intent_id
 *       properties:
 *         payment_intent_id:
 *           type: string
 *           description: Stripe payment intent ID
 *         amount:
 *           type: number
 *           minimum: 0.01
 *           description: Refund amount (optional, defaults to full amount)
 *         reason:
 *           type: string
 *           enum: [duplicate, fraudulent, requested_by_customer]
 *           default: requested_by_customer
 *           description: Refund reason
 */

/**
 * @swagger
 * /api/payments/create:
 *   post:
 *     summary: Create a payment intent
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePaymentDto'
 *     responses:
 *       200:
 *         description: Payment intent created successfully
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
 *                     payment_intent_id:
 *                       type: string
 *                     client_secret:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     currency:
 *                       type: string
 *                     status:
 *                       type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/create",
  authenticateToken,
  validateDTO(CreatePaymentDto),
  paymentsController.createPayment
);

/**
 * @swagger
 * /api/payments/confirm:
 *   post:
 *     summary: Confirm a payment intent
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfirmPaymentDto'
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/confirm",
  authenticateToken,
  validateDTO(ConfirmPaymentDto),
  paymentsController.confirmPayment
);

/**
 * @swagger
 * /api/payments/subscriptions/create:
 *   post:
 *     summary: Create a subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSubscriptionDto'
 *     responses:
 *       200:
 *         description: Subscription created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/subscriptions/create",
  authenticateToken,
  validateDTO(CreateSubscriptionDto),
  paymentsController.createSubscription
);

/**
 * @swagger
 * /api/payments/subscriptions/cancel:
 *   post:
 *     summary: Cancel a subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelSubscriptionDto'
 *     responses:
 *       200:
 *         description: Subscription canceled successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/subscriptions/cancel",
  authenticateToken,
  validateDTO(CancelSubscriptionDto),
  paymentsController.cancelSubscription
);

/**
 * @swagger
 * /api/payments/refund:
 *   post:
 *     summary: Create a refund
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRefundDto'
 *     responses:
 *       200:
 *         description: Refund created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/refund",
  authenticateToken,
  validateDTO(CreateRefundDto),
  paymentsController.createRefund
);

/**
 * @swagger
 * /api/payments/history:
 *   get:
 *     summary: Get user's payment history
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/history", authenticateToken, paymentsController.getPaymentHistory);

/**
 * @swagger
 * /api/payments/subscriptions:
 *   get:
 *     summary: Get user's subscriptions
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscriptions retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/subscriptions",
  authenticateToken,
  paymentsController.getUserSubscriptions
);

/**
 * @swagger
 * /api/payments/products:
 *   get:
 *     summary: Get available products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/products", authenticateToken, paymentsController.getProducts);

/**
 * @swagger
 * /api/payments/prices:
 *   get:
 *     summary: Get available prices
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Prices retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/prices", authenticateToken, paymentsController.getPrices);

/**
 * @swagger
 * /api/payments/payment-methods:
 *   get:
 *     summary: Get user's payment methods
 *     tags: [Payment Methods]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment methods retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/payment-methods",
  authenticateToken,
  paymentsController.getPaymentMethods
);

/**
 * @swagger
 * /api/payments/payment-methods/attach:
 *   post:
 *     summary: Attach a payment method
 *     tags: [Payment Methods]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment_method_id
 *             properties:
 *               payment_method_id:
 *                 type: string
 *                 description: Stripe payment method ID
 *     responses:
 *       200:
 *         description: Payment method attached successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/payment-methods/attach",
  authenticateToken,
  paymentsController.attachPaymentMethod
);

/**
 * @swagger
 * /api/payments/payment-methods/{payment_method_id}/detach:
 *   delete:
 *     summary: Detach a payment method
 *     tags: [Payment Methods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: payment_method_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stripe payment method ID
 *     responses:
 *       200:
 *         description: Payment method detached successfully
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/payment-methods/:payment_method_id/detach",
  authenticateToken,
  paymentsController.detachPaymentMethod
);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment details by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
 *       404:
 *         description: Payment not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", authenticateToken, paymentsController.getPaymentById);

/**
 * @swagger
 * /api/payments/subscriptions/{id}:
 *   get:
 *     summary: Get subscription details by ID
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription retrieved successfully
 *       404:
 *         description: Subscription not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/subscriptions/:id",
  authenticateToken,
  paymentsController.getSubscriptionById
);

export default router;
