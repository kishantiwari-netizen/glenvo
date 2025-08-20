import Stripe from "stripe";
import { User, Payment, Subscription } from "../../models";

export class StripeService {
  private stripe: Stripe;
  private isTestMode: boolean;

  constructor() {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error("STRIPE_SECRET_KEY is required");
    }

    this.stripe = new Stripe(apiKey, {
      apiVersion: "2023-10-16",
    });

    this.isTestMode = apiKey.startsWith("sk_test_");
  }

  /**
   * Map Stripe payment status to our enum
   */
  private mapPaymentStatus(
    stripeStatus: Stripe.PaymentIntent.Status
  ): "pending" | "succeeded" | "failed" | "canceled" | "processing" {
    switch (stripeStatus) {
      case "succeeded":
        return "succeeded";
      case "processing":
        return "processing";
      case "requires_payment_method":
      case "requires_confirmation":
      case "requires_action":
      case "requires_capture":
        return "pending";
      case "canceled":
        return "canceled";
      default:
        return "failed";
    }
  }

  /**
   * Map Stripe subscription status to our enum
   */
  private mapSubscriptionStatus(
    stripeStatus: Stripe.Subscription.Status
  ):
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "trialing"
    | "unpaid" {
    switch (stripeStatus) {
      case "active":
        return "active";
      case "canceled":
        return "canceled";
      case "incomplete":
        return "incomplete";
      case "incomplete_expired":
        return "incomplete_expired";
      case "past_due":
        return "past_due";
      case "trialing":
        return "trialing";
      case "unpaid":
        return "unpaid";
      default:
        return "incomplete";
    }
  }

  /**
   * Create a Stripe customer for a user
   */
  async createCustomer(
    user: User,
    paymentMethodId?: string
  ): Promise<Stripe.Customer> {
    try {
      const customerData: Stripe.CustomerCreateParams = {
        email: user.email,
        name: user.fullName,
        phone: user.phone_number,
        metadata: {
          user_id: user.id.toString(),
          account_type: user.account_type,
        },
      };

      if (paymentMethodId) {
        customerData.payment_method = paymentMethodId;
        customerData.invoice_settings = {
          default_payment_method: paymentMethodId,
        };
      }

      const customer = await this.stripe.customers.create(customerData);

      // Update user with Stripe customer ID
      await user.update({ stripe_customer_id: customer.id });

      return customer;
    } catch (error) {
      console.error("Error creating Stripe customer:", error);
      throw new Error("Failed to create customer");
    }
  }

  /**
   * Get or create a Stripe customer for a user
   */
  async getOrCreateCustomer(
    user: User,
    paymentMethodId?: string
  ): Promise<Stripe.Customer> {
    if (user.stripe_customer_id) {
      try {
        return (await this.stripe.customers.retrieve(
          user.stripe_customer_id
        )) as Stripe.Customer;
      } catch (error) {
        console.error("Error retrieving Stripe customer:", error);
        // Customer not found, create a new one
      }
    }

    return this.createCustomer(user, paymentMethodId);
  }

  /**
   * Create a payment intent for one-time payments
   */
  async createPaymentIntent(
    user: User,
    amount: number,
    currency: string = "USD",
    description?: string,
    metadata?: object
  ): Promise<Stripe.PaymentIntent> {
    try {
      // Validate minimum amount based on currency
      const minAmounts: { [key: string]: number } = {
        USD: 0.5,
        CAD: 0.5,
        EUR: 0.5,
        GBP: 0.5,
        AUD: 0.5,
      };

      const minAmount = minAmounts[currency.toUpperCase()] || 0.5;

      if (amount < minAmount) {
        throw new Error(
          `Amount must be at least ${minAmount} ${currency.toUpperCase()}. Current amount: ${amount}`
        );
      }

      const customer = await this.getOrCreateCustomer(user);

      const paymentIntentData: Stripe.PaymentIntentCreateParams = {
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        customer: customer.id,
        description: description,
        metadata: {
          user_id: user.id.toString(),
          ...metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      };

      const paymentIntent = await this.stripe.paymentIntents.create(
        paymentIntentData
      );

      // Save payment record
      await Payment.create({
        user_id: user.id,
        stripe_payment_intent_id: paymentIntent.id,
        stripe_customer_id: customer.id,
        amount: amount,
        currency: currency.toUpperCase(),
        status: this.mapPaymentStatus(paymentIntent.status),
        payment_method: "card",
        description: description,
        metadata: metadata,
      });

      return paymentIntent;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw new Error("Failed to create payment intent");
    }
  }

  /**
   * Confirm a payment intent
   */
  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId?: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      // First, retrieve the payment intent to check its current status
      const existingPaymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      // If the payment intent is already succeeded, return it
      if (existingPaymentIntent.status === "succeeded") {
        return existingPaymentIntent;
      }

      const confirmData: Stripe.PaymentIntentConfirmParams = {};

      // Only add payment_method if it's provided and valid
      if (
        paymentMethodId &&
        paymentMethodId !== "string" &&
        paymentMethodId.startsWith("pm_")
      ) {
        confirmData.payment_method = paymentMethodId;
      }

      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        confirmData
      );

      // Update payment record
      await Payment.update(
        {
          status: this.mapPaymentStatus(paymentIntent.status),
        },
        {
          where: { stripe_payment_intent_id: paymentIntentId },
        }
      );

      return paymentIntent;
    } catch (error: any) {
      console.error("Error confirming payment intent:", error);

      // Re-throw Stripe errors with their original message
      if (error.type && error.message) {
        throw error;
      }

      throw new Error("Failed to confirm payment");
    }
  }

  /**
   * Create a subscription
   */
  async createSubscription(
    user: User,
    priceId: string,
    paymentMethodId?: string,
    trialDays?: number
  ): Promise<Stripe.Subscription> {
    try {
      const customer = await this.getOrCreateCustomer(user, paymentMethodId);

      const subscriptionData: Stripe.SubscriptionCreateParams = {
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
      };

      if (trialDays) {
        subscriptionData.trial_period_days = trialDays;
      }

      const subscription = await this.stripe.subscriptions.create(
        subscriptionData
      );

      // Get price details
      const price = await this.stripe.prices.retrieve(priceId);
      const product = await this.stripe.products.retrieve(
        price.product as string
      );

      // Save subscription record
      await Subscription.create({
        user_id: user.id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customer.id,
        stripe_price_id: priceId,
        stripe_product_id: price.product as string,
        status: this.mapSubscriptionStatus(subscription.status),
        current_period_start: new Date(
          subscription.current_period_start * 1000
        ),
        current_period_end: new Date(subscription.current_period_end * 1000),
        cancel_at_period_end: subscription.cancel_at_period_end,
        trial_start: subscription.trial_start
          ? new Date(subscription.trial_start * 1000)
          : undefined,
        trial_end: subscription.trial_end
          ? new Date(subscription.trial_end * 1000)
          : undefined,
        amount: (price.unit_amount || 0) / 100,
        currency: price.currency.toUpperCase(),
        interval: price.recurring?.interval || "month",
        interval_count: price.recurring?.interval_count || 1,
        metadata: {
          product_name: product.name,
          product_description: product.description,
        },
      });

      return subscription;
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw new Error("Failed to create subscription");
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd: boolean = true
  ): Promise<Stripe.Subscription> {
    try {
      let subscription: Stripe.Subscription;

      if (cancelAtPeriodEnd) {
        subscription = await this.stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
      } else {
        subscription = await this.stripe.subscriptions.cancel(subscriptionId);
      }

      // Update subscription record
      await Subscription.update(
        {
          status: this.mapSubscriptionStatus(subscription.status),
          cancel_at_period_end: subscription.cancel_at_period_end,
          canceled_at: subscription.canceled_at
            ? new Date(subscription.canceled_at * 1000)
            : undefined,
        },
        {
          where: { stripe_subscription_id: subscriptionId },
        }
      );

      return subscription;
    } catch (error) {
      console.error("Error canceling subscription:", error);
      throw new Error("Failed to cancel subscription");
    }
  }

  /**
   * Process refund
   */
  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason:
      | "duplicate"
      | "fraudulent"
      | "requested_by_customer" = "requested_by_customer"
  ): Promise<Stripe.Refund> {
    try {
      const refundData: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
        reason: reason,
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to cents
      }

      const refund = await this.stripe.refunds.create(refundData);

      // Update payment record
      await Payment.update(
        {
          refunded: true,
          refunded_at: new Date(),
          refund_amount: amount || 0,
        },
        {
          where: { stripe_payment_intent_id: paymentIntentId },
        }
      );

      return refund;
    } catch (error) {
      console.error("Error creating refund:", error);
      throw new Error("Failed to create refund");
    }
  }

  /**
   * Get payment methods for a customer
   */
  async getPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      });

      return paymentMethods.data;
    } catch (error) {
      console.error("Error getting payment methods:", error);
      throw new Error("Failed to get payment methods");
    }
  }

  /**
   * Attach payment method to customer
   */
  async attachPaymentMethod(
    paymentMethodId: string,
    customerId: string
  ): Promise<Stripe.PaymentMethod> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.attach(
        paymentMethodId,
        {
          customer: customerId,
        }
      );

      return paymentMethod;
    } catch (error) {
      console.error("Error attaching payment method:", error);
      throw new Error("Failed to attach payment method");
    }
  }

  /**
   * Detach payment method from customer
   */
  async detachPaymentMethod(
    paymentMethodId: string
  ): Promise<Stripe.PaymentMethod> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.detach(
        paymentMethodId
      );

      return paymentMethod;
    } catch (error) {
      console.error("Error detaching payment method:", error);
      throw new Error("Failed to detach payment method");
    }
  }

  /**
   * Get available products and prices
   */
  async getProducts(): Promise<Stripe.Product[]> {
    try {
      const products = await this.stripe.products.list({
        active: true,
        expand: ["data.default_price"],
      });

      return products.data;
    } catch (error) {
      console.error("Error getting products:", error);
      throw new Error("Failed to get products");
    }
  }

  /**
   * Get available prices
   */
  async getPrices(): Promise<Stripe.Price[]> {
    try {
      const prices = await this.stripe.prices.list({
        active: true,
        expand: ["data.product"],
      });

      return prices.data;
    } catch (error) {
      console.error("Error getting prices:", error);
      throw new Error("Failed to get prices");
    }
  }

  /**
   * Handle webhook events
   */
  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case "payment_intent.succeeded":
          await this.handlePaymentIntentSucceeded(
            event.data.object as Stripe.PaymentIntent
          );
          break;
        case "payment_intent.payment_failed":
          await this.handlePaymentIntentFailed(
            event.data.object as Stripe.PaymentIntent
          );
          break;
        case "invoice.payment_succeeded":
          await this.handleInvoicePaymentSucceeded(
            event.data.object as Stripe.Invoice
          );
          break;
        case "invoice.payment_failed":
          await this.handleInvoicePaymentFailed(
            event.data.object as Stripe.Invoice
          );
          break;
        case "customer.subscription.updated":
          await this.handleSubscriptionUpdated(
            event.data.object as Stripe.Subscription
          );
          break;
        case "customer.subscription.deleted":
          await this.handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription
          );
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error("Error handling webhook event:", error);
      throw error;
    }
  }

  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    await Payment.update(
      {
        status: this.mapPaymentStatus(paymentIntent.status),
      },
      {
        where: { stripe_payment_intent_id: paymentIntent.id },
      }
    );
  }

  private async handlePaymentIntentFailed(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    await Payment.update(
      {
        status: this.mapPaymentStatus(paymentIntent.status),
      },
      {
        where: { stripe_payment_intent_id: paymentIntent.id },
      }
    );
  }

  private async handleInvoicePaymentSucceeded(
    invoice: Stripe.Invoice
  ): Promise<void> {
    if (invoice.subscription) {
      await Subscription.update(
        {
          status: "active",
        },
        {
          where: { stripe_subscription_id: invoice.subscription as string },
        }
      );
    }
  }

  private async handleInvoicePaymentFailed(
    invoice: Stripe.Invoice
  ): Promise<void> {
    if (invoice.subscription) {
      await Subscription.update(
        {
          status: "past_due",
        },
        {
          where: { stripe_subscription_id: invoice.subscription as string },
        }
      );
    }
  }

  private async handleSubscriptionUpdated(
    subscription: Stripe.Subscription
  ): Promise<void> {
    await Subscription.update(
      {
        status: this.mapSubscriptionStatus(subscription.status),
        current_period_start: new Date(
          subscription.current_period_start * 1000
        ),
        current_period_end: new Date(subscription.current_period_end * 1000),
        cancel_at_period_end: subscription.cancel_at_period_end,
        canceled_at: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000)
          : undefined,
        trial_start: subscription.trial_start
          ? new Date(subscription.trial_start * 1000)
          : undefined,
        trial_end: subscription.trial_end
          ? new Date(subscription.trial_end * 1000)
          : undefined,
      },
      {
        where: { stripe_subscription_id: subscription.id },
      }
    );
  }

  private async handleSubscriptionDeleted(
    subscription: Stripe.Subscription
  ): Promise<void> {
    await Subscription.update(
      {
        status: this.mapSubscriptionStatus(subscription.status),
        canceled_at: new Date(subscription.canceled_at! * 1000),
      },
      {
        where: { stripe_subscription_id: subscription.id },
      }
    );
  }

  /**
   * Get test mode status
   */
  getTestMode(): boolean {
    return this.isTestMode;
  }
}

export default StripeService;
