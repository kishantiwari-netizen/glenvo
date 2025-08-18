import { Router } from "express";
import { handleEasyPostWebhook } from "./webhooks.controller";

const router = Router();

/**
 * @swagger
 * /api/webhooks/easypost:
 *   post:
 *     summary: Handle EasyPost webhook events
 *     description: Receives and processes webhook events from EasyPost
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Webhook event ID
 *               object:
 *                 type: string
 *                 description: Object type
 *               description:
 *                 type: string
 *                 description: Event description
 *               mode:
 *                 type: string
 *                 enum: [test, production]
 *                 description: Webhook mode
 *               result:
 *                 type: object
 *                 description: Event result data
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
router.post("/easypost", handleEasyPostWebhook);

export default router;
