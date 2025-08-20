import { Request, Response } from 'express';
import { ResponseHandler } from '../../utils/responseHandler';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';

export class WebhooksController {
  private stripeService: StripeService;

  constructor() {
    this.stripeService = new StripeService();
  }

  /**
   * Handle Stripe webhook events
   */
  handleStripeWebhook = async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured');
      ResponseHandler.error(res, 'Webhook secret not configured', 500);
      return;
    }

    let event: Stripe.Event;

    try {
      // Verify the webhook signature
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2023-10-16',
      });

      event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      ResponseHandler.error(res, 'Webhook signature verification failed', 400);
      return;
    }

    try {
      // Handle the event
      await this.stripeService.handleWebhookEvent(event);

      // Log the event for debugging
      console.log(`Webhook event processed: ${event.type}`);

      ResponseHandler.success(res, { event_type: event.type }, 'Webhook processed successfully');
    } catch (error: any) {
      console.error('Error processing webhook:', error);
      ResponseHandler.error(res, 'Error processing webhook', 500);
    }
  };

  /**
   * Test webhook endpoint (for development)
   */
  testWebhook = async (req: Request, res: Response): Promise<void> => {
    try {
      const testEvent: Stripe.Event = {
        id: 'evt_test_webhook',
        object: 'event',
        api_version: '2023-10-16',
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            id: 'pi_test_payment_intent',
            object: 'payment_intent',
            amount: 2000,
            currency: 'usd',
            status: 'succeeded',
          } as Stripe.PaymentIntent,
        },
        livemode: false,
        pending_webhooks: 0,
        request: {
          id: 'req_test',
          idempotency_key: null,
        },
        type: 'payment_intent.succeeded',
      };

      await this.stripeService.handleWebhookEvent(testEvent);

      ResponseHandler.success(res, {
        event_type: testEvent.type,
        test_mode: true,
      }, 'Test webhook processed successfully');
    } catch (error: any) {
      console.error('Error processing test webhook:', error);
      ResponseHandler.error(res, 'Error processing test webhook', 500);
    }
  };
}
