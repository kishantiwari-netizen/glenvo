import { Request, Response } from "express";
import { ResponseHandler } from "../../utils/responseHandler";
import { StripeService } from "./stripe.service";
import { User, Payment, Subscription } from "../../models";
import {
  CreatePaymentDto,
  ConfirmPaymentDto,
  CreateSubscriptionDto,
  CancelSubscriptionDto,
  CreateRefundDto,
} from "./dto";

export class PaymentsController {
  private stripeService: StripeService;

  constructor() {
    this.stripeService = new StripeService();
  }

  /**
   * Create a payment intent for one-time payments
   */
  createPayment = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.id;
    const paymentData: CreatePaymentDto = req.body;

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        ResponseHandler.notFound(res, "User not found");
        return;
      }

      const paymentIntent = await this.stripeService.createPaymentIntent(
        user,
        paymentData.amount,
        paymentData.currency,
        paymentData.description,
        paymentData.metadata
      );

      ResponseHandler.success(
        res,
        {
          payment_intent_id: paymentIntent.id,
          client_secret: paymentIntent.client_secret,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: paymentIntent.status,
        },
        "Payment intent created successfully"
      );
    } catch (error: any) {
      console.error("Error creating payment:", error);

      // Handle specific Stripe errors
      if (error.code === "amount_too_small") {
        ResponseHandler.error(
          res,
          `Payment amount is too small. Minimum amount is 50 cents (0.50) in ${paymentData.currency}.`,
          400
        );
        return;
      }

      if (error.type === "StripeInvalidRequestError") {
        ResponseHandler.error(
          res,
          `Stripe validation error: ${error.message}`,
          400
        );
        return;
      }

      ResponseHandler.error(
        res,
        error.message || "Failed to create payment",
        400
      );
    }
  };

  /**
   * Confirm a payment intent
   */
  confirmPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const confirmData: ConfirmPaymentDto = req.body;

      // Validate payment method ID if provided
      if (
        confirmData.payment_method_id &&
        confirmData.payment_method_id === "string"
      ) {
        ResponseHandler.error(
          res,
          "Invalid payment method ID. Please provide a valid Stripe payment method ID.",
          400
        );
        return;
      }

      const paymentIntent = await this.stripeService.confirmPaymentIntent(
        confirmData.payment_intent_id,
        confirmData.payment_method_id
      );

      ResponseHandler.success(
        res,
        {
          payment_intent_id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          receipt_url:
            typeof paymentIntent.latest_charge === "object"
              ? paymentIntent.latest_charge?.receipt_url
              : undefined,
        },
        "Payment confirmed successfully"
      );
    } catch (error: any) {
      console.error("Error confirming payment:", error);

      // Handle specific Stripe errors
      if (
        error.code === "resource_missing" &&
        error.param === "payment_method"
      ) {
        ResponseHandler.error(
          res,
          "Invalid payment method ID. Please provide a valid Stripe payment method ID.",
          400
        );
        return;
      }

      if (error.type === "StripeInvalidRequestError") {
        ResponseHandler.error(
          res,
          `Stripe validation error: ${error.message}`,
          400
        );
        return;
      }

      ResponseHandler.error(
        res,
        error.message || "Failed to confirm payment",
        400
      );
    }
  };

  /**
   * Create a subscription
   */
  createSubscription = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const subscriptionData: CreateSubscriptionDto = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        ResponseHandler.notFound(res, "User not found");
        return;
      }

      const subscription = await this.stripeService.createSubscription(
        user,
        subscriptionData.price_id,
        subscriptionData.payment_method_id,
        subscriptionData.trial_days
      );

      ResponseHandler.success(
        res,
        {
          subscription_id: subscription.id,
          status: subscription.status,
          current_period_start: new Date(
            subscription.current_period_start * 1000
          ),
          current_period_end: new Date(subscription.current_period_end * 1000),
          trial_start: subscription.trial_start
            ? new Date(subscription.trial_start * 1000)
            : null,
          trial_end: subscription.trial_end
            ? new Date(subscription.trial_end * 1000)
            : null,
        },
        "Subscription created successfully"
      );
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      ResponseHandler.error(
        res,
        error.message || "Failed to create subscription",
        400
      );
    }
  };

  /**
   * Cancel a subscription
   */
  cancelSubscription = async (req: Request, res: Response): Promise<void> => {
    try {
      const cancelData: CancelSubscriptionDto = req.body;

      const subscription = await this.stripeService.cancelSubscription(
        cancelData.subscription_id,
        cancelData.cancel_at_period_end
      );

      ResponseHandler.success(
        res,
        {
          subscription_id: subscription.id,
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end,
          canceled_at: subscription.canceled_at
            ? new Date(subscription.canceled_at * 1000)
            : null,
        },
        "Subscription canceled successfully"
      );
    } catch (error: any) {
      console.error("Error canceling subscription:", error);
      ResponseHandler.error(
        res,
        error.message || "Failed to cancel subscription",
        400
      );
    }
  };

  /**
   * Create a refund
   */
  createRefund = async (req: Request, res: Response): Promise<void> => {
    try {
      const refundData: CreateRefundDto = req.body;

      const refund = await this.stripeService.createRefund(
        refundData.payment_intent_id,
        refundData.amount,
        refundData.reason
      );

      ResponseHandler.success(
        res,
        {
          refund_id: refund.id,
          amount: refund.amount / 100,
          currency: refund.currency,
          status: refund.status,
          reason: refund.reason,
        },
        "Refund created successfully"
      );
    } catch (error: any) {
      console.error("Error creating refund:", error);
      ResponseHandler.error(
        res,
        error.message || "Failed to create refund",
        400
      );
    }
  };

  /**
   * Get user's payment history
   */
  getPaymentHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: payments } = await Payment.findAndCountAll({
        where: { user_id: userId },
        order: [["created_at", "DESC"]],
        limit,
        offset,
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "first_name", "last_name", "email"],
          },
        ],
      });

      ResponseHandler.success(
        res,
        {
          payments,
          pagination: {
            page,
            limit,
            total: count,
            total_pages: Math.ceil(count / limit),
          },
        },
        "Payment history retrieved successfully"
      );
    } catch (error: any) {
      console.error("Error getting payment history:", error);
      ResponseHandler.error(
        res,
        error.message || "Failed to get payment history",
        400
      );
    }
  };

  /**
   * Get user's subscriptions
   */
  getUserSubscriptions = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;

      const subscriptions = await Subscription.findAll({
        where: { user_id: userId },
        order: [["created_at", "DESC"]],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "first_name", "last_name", "email"],
          },
        ],
      });

      ResponseHandler.success(
        res,
        {
          subscriptions,
        },
        "Subscriptions retrieved successfully"
      );
    } catch (error: any) {
      console.error("Error getting subscriptions:", error);
      ResponseHandler.error(
        res,
        error.message || "Failed to get subscriptions",
        400
      );
    }
  };

  /**
   * Get available products and prices
   */
  getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.stripeService.getProducts();

      ResponseHandler.success(
        res,
        {
          products,
        },
        "Products retrieved successfully"
      );
    } catch (error: any) {
      console.error("Error getting products:", error);
      ResponseHandler.error(
        res,
        error.message || "Failed to get products",
        400
      );
    }
  };

  /**
   * Get available prices
   */
  getPrices = async (req: Request, res: Response): Promise<void> => {
    try {
      const prices = await this.stripeService.getPrices();

      ResponseHandler.success(
        res,
        {
          prices,
        },
        "Prices retrieved successfully"
      );
    } catch (error: any) {
      console.error("Error getting prices:", error);
      ResponseHandler.error(res, error.message || "Failed to get prices", 400);
    }
  };

  /**
   * Get payment methods for the current user
   */
  getPaymentMethods = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId);
      if (!user || !user.stripe_customer_id) {
        ResponseHandler.success(
          res,
          { payment_methods: [] },
          "No payment methods found"
        );
        return;
      }

      const paymentMethods = await this.stripeService.getPaymentMethods(
        user.stripe_customer_id
      );

      ResponseHandler.success(
        res,
        {
          payment_methods: paymentMethods,
        },
        "Payment methods retrieved successfully"
      );
    } catch (error: any) {
      console.error("Error getting payment methods:", error);
      ResponseHandler.error(
        res,
        error.message || "Failed to get payment methods",
        400
      );
    }
  };

  /**
   * Attach a payment method to the user's customer
   */
  attachPaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const { payment_method_id } = req.body;

      if (!payment_method_id) {
        ResponseHandler.error(res, "Payment method ID is required", 400);
        return;
      }

      const user = await User.findByPk(userId);
      if (!user) {
        ResponseHandler.notFound(res, "User not found");
        return;
      }

      const customer = await this.stripeService.getOrCreateCustomer(user);
      const paymentMethod = await this.stripeService.attachPaymentMethod(
        payment_method_id,
        customer.id
      );

      ResponseHandler.success(
        res,
        {
          payment_method: paymentMethod,
        },
        "Payment method attached successfully"
      );
    } catch (error: any) {
      console.error("Error attaching payment method:", error);
      ResponseHandler.error(
        res,
        error.message || "Failed to attach payment method",
        400
      );
    }
  };

  /**
   * Detach a payment method from the user's customer
   */
  detachPaymentMethod = async (req: Request, res: Response): Promise<void> => {
    try {
      const { payment_method_id } = req.params;

      const paymentMethod = await this.stripeService.detachPaymentMethod(
        payment_method_id
      );

      ResponseHandler.success(
        res,
        {
          payment_method: paymentMethod,
        },
        "Payment method detached successfully"
      );
    } catch (error: any) {
      console.error("Error detaching payment method:", error);
      ResponseHandler.error(
        res,
        error.message || "Failed to detach payment method",
        400
      );
    }
  };

  /**
   * Get payment details by ID
   */
  getPaymentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const paymentId = parseInt(req.params.id);

      const payment = await Payment.findOne({
        where: { id: paymentId, user_id: userId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "first_name", "last_name", "email"],
          },
        ],
      });

      if (!payment) {
        ResponseHandler.notFound(res, "Payment not found");
        return;
      }

      ResponseHandler.success(
        res,
        {
          payment,
        },
        "Payment retrieved successfully"
      );
    } catch (error: any) {
      console.error("Error getting payment:", error);
      ResponseHandler.error(res, error.message || "Failed to get payment", 400);
    }
  };

  /**
   * Get subscription details by ID
   */
  getSubscriptionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const subscriptionId = parseInt(req.params.id);

      const subscription = await Subscription.findOne({
        where: { id: subscriptionId, user_id: userId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "first_name", "last_name", "email"],
          },
        ],
      });

      if (!subscription) {
        ResponseHandler.notFound(res, "Subscription not found");
        return;
      }

      ResponseHandler.success(
        res,
        {
          subscription,
        },
        "Subscription retrieved successfully"
      );
    } catch (error: any) {
      console.error("Error getting subscription:", error);
      ResponseHandler.error(
        res,
        error.message || "Failed to get subscription",
        400
      );
    }
  };
}
