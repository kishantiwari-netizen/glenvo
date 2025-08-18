import { Request, Response } from "express";
import { ResponseHandler } from "../../utils/responseHandler";
import { User, Shipment, Package } from "../../models";

interface EasyPostWebhookEvent {
  id: string;
  object: string;
  mode: "test" | "production";
  created_at: string;
  updated_at: string;
  result: any;
  previous_attributes?: any;
  description: string;
  api_version: string;
}

export const handleEasyPostWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const webhookEvent: EasyPostWebhookEvent = req.body;

    console.log("EasyPost webhook received:", {
      id: webhookEvent.id,
      object: webhookEvent.object,
      description: webhookEvent.description,
      mode: webhookEvent.mode,
    });

    // Verify webhook signature (EasyPost sends a signature header)
    const signature = req.headers["x-hub-signature"] as string;
    if (!signature) {
      console.warn("EasyPost webhook received without signature");
      // In production, you should verify the signature
      // For now, we'll process the webhook
    }

    // Handle different webhook event types
    switch (webhookEvent.description) {
      case "shipment.created":
        await handleShipmentCreated(webhookEvent);
        break;
      case "shipment.updated":
        await handleShipmentUpdated(webhookEvent);
        break;
      case "tracker.updated":
        await handleTrackerUpdated(webhookEvent);
        break;
      case "tracker.updated.delivered":
        await handleTrackerDelivered(webhookEvent);
        break;
      case "tracker.updated.return_to_sender":
        await handleTrackerReturnToSender(webhookEvent);
        break;
      case "tracker.updated.failure":
        await handleTrackerFailure(webhookEvent);
        break;
      case "tracker.updated.in_transit":
        await handleTrackerInTransit(webhookEvent);
        break;
      case "tracker.updated.out_for_delivery":
        await handleTrackerOutForDelivery(webhookEvent);
        break;
      default:
        console.log(`Unhandled webhook event: ${webhookEvent.description}`);
    }

    // Always respond with 200 to acknowledge receipt
    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Still respond with 200 to prevent EasyPost from retrying
    res
      .status(200)
      .json({ status: "error", message: "Webhook processed with errors" });
  }
};

async function handleShipmentCreated(
  webhookEvent: EasyPostWebhookEvent
): Promise<void> {
  try {
    const shipment = webhookEvent.result;
    console.log("Shipment created:", shipment.id);

    // Find the user by EasyPost user ID
    const user = await User.findOne({
      where: { easypost_user_id: shipment.user_id },
    });

    if (!user) {
      console.warn(`User not found for EasyPost user ID: ${shipment.user_id}`);
      return;
    }

    // Create or update shipment record
    await Shipment.findOrCreate({
      where: { easypost_shipment_id: shipment.id },
      defaults: {
        user_id: user.id,
        easypost_shipment_id: shipment.id,
        sender_address_id: 1, // Default value, should be updated with actual address
        receiver_address_id: 1, // Default value, should be updated with actual address
        service_type: shipment.selected_rate?.service || "",
        tracking_code: shipment.tracking_code || "",
        status: "created",
        total_amount: 0,
        shipping_fee: 0,
        insurance_fee: 0,
        pickup_fee: 0,
        tax_amount: 0,
        currency: "USD",
        signature_required: false,
        saturday_delivery: false,
        is_gift: false,
        adult_signature_required: false,
        postage_label: shipment.postage_label
          ? JSON.stringify(shipment.postage_label)
          : undefined,
        tracker: shipment.tracker
          ? JSON.stringify(shipment.tracker)
          : undefined,
      },
    });

    console.log(`Shipment ${shipment.id} created for user ${user.id}`);
  } catch (error) {
    console.error("Error handling shipment.created:", error);
  }
}

async function handleShipmentUpdated(
  webhookEvent: EasyPostWebhookEvent
): Promise<void> {
  try {
    const shipment = webhookEvent.result;
    console.log("Shipment updated:", shipment.id);

    // Update shipment record
    const existingShipment = await Shipment.findOne({
      where: { easypost_shipment_id: shipment.id },
    });

    if (existingShipment) {
      await existingShipment.update({
        status: "updated",
        tracking_code: shipment.tracking_code || existingShipment.tracking_code,
        postage_label: shipment.postage_label
          ? JSON.stringify(shipment.postage_label)
          : existingShipment.postage_label,
        tracker: shipment.tracker
          ? JSON.stringify(shipment.tracker)
          : existingShipment.tracker,
      });
    }

    console.log(`Shipment ${shipment.id} updated`);
  } catch (error) {
    console.error("Error handling shipment.updated:", error);
  }
}

async function handleTrackerUpdated(
  webhookEvent: EasyPostWebhookEvent
): Promise<void> {
  try {
    const tracker = webhookEvent.result;
    console.log("Tracker updated:", tracker.id);

    // Update shipment with tracker information
    const shipment = await Shipment.findOne({
      where: { easypost_shipment_id: tracker.shipment_id },
    });

    if (shipment) {
      await shipment.update({
        tracker: JSON.stringify(tracker),
        status: tracker.status || shipment.status,
        updated_at: new Date(),
      });
    }

    console.log(
      `Tracker ${tracker.id} updated for shipment ${tracker.shipment_id}`
    );
  } catch (error) {
    console.error("Error handling tracker.updated:", error);
  }
}

async function handleTrackerDelivered(
  webhookEvent: EasyPostWebhookEvent
): Promise<void> {
  try {
    const tracker = webhookEvent.result;
    console.log("Package delivered:", tracker.id);

    const shipment = await Shipment.findOne({
      where: { easypost_shipment_id: tracker.shipment_id },
    });

    if (shipment) {
      await shipment.update({
        status: "delivered",
        tracker: JSON.stringify(tracker),
        updated_at: new Date(),
      });
    }

    console.log(`Package delivered for shipment ${tracker.shipment_id}`);
  } catch (error) {
    console.error("Error handling tracker.updated.delivered:", error);
  }
}

async function handleTrackerReturnToSender(
  webhookEvent: EasyPostWebhookEvent
): Promise<void> {
  try {
    const tracker = webhookEvent.result;
    console.log("Package returned to sender:", tracker.id);

    const shipment = await Shipment.findOne({
      where: { easypost_shipment_id: tracker.shipment_id },
    });

    if (shipment) {
      await shipment.update({
        status: "returned",
        tracker: JSON.stringify(tracker),
        updated_at: new Date(),
      });
    }

    console.log(
      `Package returned to sender for shipment ${tracker.shipment_id}`
    );
  } catch (error) {
    console.error("Error handling tracker.updated.return_to_sender:", error);
  }
}

async function handleTrackerFailure(
  webhookEvent: EasyPostWebhookEvent
): Promise<void> {
  try {
    const tracker = webhookEvent.result;
    console.log("Package delivery failed:", tracker.id);

    const shipment = await Shipment.findOne({
      where: { easypost_shipment_id: tracker.shipment_id },
    });

    if (shipment) {
      await shipment.update({
        status: "failed",
        tracker: JSON.stringify(tracker),
        updated_at: new Date(),
      });
    }

    console.log(`Package delivery failed for shipment ${tracker.shipment_id}`);
  } catch (error) {
    console.error("Error handling tracker.updated.failure:", error);
  }
}

async function handleTrackerInTransit(
  webhookEvent: EasyPostWebhookEvent
): Promise<void> {
  try {
    const tracker = webhookEvent.result;
    console.log("Package in transit:", tracker.id);

    const shipment = await Shipment.findOne({
      where: { easypost_shipment_id: tracker.shipment_id },
    });

    if (shipment) {
      await shipment.update({
        status: "in_transit",
        tracker: JSON.stringify(tracker),
        updated_at: new Date(),
      });
    }

    console.log(`Package in transit for shipment ${tracker.shipment_id}`);
  } catch (error) {
    console.error("Error handling tracker.updated.in_transit:", error);
  }
}

async function handleTrackerOutForDelivery(
  webhookEvent: EasyPostWebhookEvent
): Promise<void> {
  try {
    const tracker = webhookEvent.result;
    console.log("Package out for delivery:", tracker.id);

    const shipment = await Shipment.findOne({
      where: { easypost_shipment_id: tracker.shipment_id },
    });

    if (shipment) {
      await shipment.update({
        status: "out_for_delivery",
        tracker: JSON.stringify(tracker),
        updated_at: new Date(),
      });
    }

    console.log(`Package out for delivery for shipment ${tracker.shipment_id}`);
  } catch (error) {
    console.error("Error handling tracker.updated.out_for_delivery:", error);
  }
}
