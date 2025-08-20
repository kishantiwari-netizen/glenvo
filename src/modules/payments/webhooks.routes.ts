import { Router } from 'express';
import { WebhooksController } from './webhooks.controller';

const router = Router();
const webhooksController = new WebhooksController();

/**
 * @swagger
 * /api/payments/webhooks/stripe:
 *   post:
 *     summary: Handle Stripe webhook events
 *     tags: [Webhooks]
 *     description: This endpoint receives webhook events from Stripe and processes them
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Stripe webhook event payload
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Webhook signature verification failed
 *       500:
 *         description: Error processing webhook
 */
router.post('/stripe', webhooksController.handleStripeWebhook);

/**
 * @swagger
 * /api/payments/webhooks/test:
 *   post:
 *     summary: Test webhook endpoint (development only)
 *     tags: [Webhooks]
 *     description: Test endpoint for simulating webhook events during development
 *     responses:
 *       200:
 *         description: Test webhook processed successfully
 *       500:
 *         description: Error processing test webhook
 */
router.post('/test', webhooksController.testWebhook);

export default router;
