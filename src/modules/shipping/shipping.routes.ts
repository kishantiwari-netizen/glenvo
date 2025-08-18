import { Router } from "express";
import {
  createShipment,
  getCarrierRates,
  selectCarrier,
  getShipmentDetails,
  getUserShipments,
  cancelShipment,
  getCarriersByCountry,
  getAllCarriers,
  validateAddress,
  getDefaultSenderAddress,
  getPickupRates,
  schedulePickup,
} from "./shipping.controller";
import { authenticateToken } from "../../middleware/auth";
import { validateDTO } from "../../middleware/class-validator";
import {
  CreateShipmentDto,
  CarrierSelectionDto,
  AddressValidationDto,
  PickupSchedulingDto,
} from "./dto";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - address_line_1
 *         - city
 *         - state_province
 *         - postal_code
 *         - country
 *       properties:
 *         first_name:
 *           type: string
 *           example: "John"
 *           description: First name of the person
 *         last_name:
 *           type: string
 *           example: "Doe"
 *           description: Last name of the person
 *         company_name:
 *           type: string
 *           example: "Acme Corp"
 *           description: Company name (optional)
 *         address_line_1:
 *           type: string
 *           example: "123 Main Street"
 *           description: Primary address line
 *         address_line_2:
 *           type: string
 *           example: "Suite 100"
 *           description: Secondary address line (optional)
 *         city:
 *           type: string
 *           example: "New York"
 *           description: City name
 *         state_province:
 *           type: string
 *           example: "NY"
 *           description: State or province
 *         postal_code:
 *           type: string
 *           example: "10001"
 *           description: Postal/ZIP code
 *         country:
 *           type: string
 *           example: "US"
 *           description: 2-letter country code
 *         phone_number:
 *           type: string
 *           example: "+1-555-123-4567"
 *           description: Phone number (optional)
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *           description: Email address (optional)
 *     Package:
 *       type: object
 *       required:
 *         - length
 *         - width
 *         - height
 *         - weight
 *         - declared_value
 *       properties:
 *         length:
 *           type: number
 *           format: float
 *           example: 12.5
 *           description: Length in inches
 *         width:
 *           type: number
 *           format: float
 *           example: 8.0
 *           description: Width in inches
 *         height:
 *           type: number
 *           format: float
 *           example: 6.0
 *           description: Height in inches
 *         weight:
 *           type: number
 *           format: float
 *           example: 2.5
 *           description: Weight in pounds
 *         declared_value:
 *           type: number
 *           format: float
 *           example: 150.00
 *           description: Declared value in USD
 *         description:
 *           type: string
 *           example: "Electronics - Laptop"
 *           description: Package description (optional)
 *     CreateShipmentRequest:
 *       type: object
 *       required:
 *         - sender_address
 *         - receiver_address
 *         - packages
 *       properties:
 *         sender_address:
 *           $ref: '#/components/schemas/Address'
 *         receiver_address:
 *           $ref: '#/components/schemas/Address'
 *         packages:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/Package'
 *         signature_required:
 *           type: boolean
 *           example: true
 *           description: Whether signature is required for delivery
 *         saturday_delivery:
 *           type: boolean
 *           example: false
 *           description: Whether Saturday delivery is requested
 *         is_gift:
 *           type: boolean
 *           example: false
 *           description: Whether this is a gift shipment
 *         adult_signature_required:
 *           type: boolean
 *           example: false
 *           description: Whether adult signature is required
 *         pickup_instructions:
 *           type: string
 *           example: "Please call before pickup"
 *           description: Special pickup instructions
 *     ShipmentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Shipment created successfully"
 *         data:
 *           type: object
 *           properties:
 *             shipment:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 123
 *                 status:
 *                   type: string
 *                   example: "draft"
 *                   enum: [draft, pending, confirmed, in_transit, delivered, cancelled]
 *                 sender_address:
 *                   $ref: '#/components/schemas/Address'
 *                 receiver_address:
 *                   $ref: '#/components/schemas/Address'
 *                 packages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Package'
 *                 total_declared_value:
 *                   type: number
 *                   format: float
 *                   example: 150.00
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00Z"
 *
 * /api/shipping/shipments:
 *   post:
 *     summary: Create a new shipment
 *     description: Create a new shipment with sender and receiver addresses, and package details
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateShipmentRequest'
 *           example:
 *             sender_address:
 *               first_name: "John"
 *               last_name: "Doe"
 *               company_name: "Acme Corp"
 *               address_line_1: "123 Main Street"
 *               address_line_2: "Suite 100"
 *               city: "New York"
 *               state_province: "NY"
 *               postal_code: "10001"
 *               country: "US"
 *               phone_number: "+1-555-123-4567"
 *               email: "john.doe@example.com"
 *             receiver_address:
 *               first_name: "Jane"
 *               last_name: "Smith"
 *               company_name: "Tech Solutions"
 *               address_line_1: "456 Oak Avenue"
 *               city: "Los Angeles"
 *               state_province: "CA"
 *               postal_code: "90210"
 *               country: "US"
 *               phone_number: "+1-555-987-6543"
 *               email: "jane.smith@example.com"
 *             packages:
 *               - length: 12.5
 *                 width: 8.0
 *                 height: 6.0
 *                 weight: 2.5
 *                 declared_value: 150.00
 *                 description: "Electronics - Laptop"
 *             signature_required: true
 *             saturday_delivery: false
 *             is_gift: false
 *             adult_signature_required: false
 *             pickup_instructions: "Please call before pickup"
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShipmentResponse'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "sender_address.first_name"
 *                       message:
 *                         type: string
 *                         example: "First name is required"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.post(
  "/shipments",
  authenticateToken,
  validateDTO(CreateShipmentDto),
  createShipment
);

/**
 * @swagger
 * /api/shipping/shipments/{shipment_id}/rates:
 *   get:
 *     summary: Get carrier rates for a shipment
 *     description: Retrieve available shipping rates from different carriers for a specific shipment
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shipment_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID of the shipment to get rates for
 *     responses:
 *       200:
 *         description: Carrier rates retrieved successfully
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
 *                   example: "Carrier rates retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     shipment_id:
 *                       type: integer
 *                       example: 123
 *                     rates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           carrier:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: "fedex_ground"
 *                               name:
 *                                 type: string
 *                                 example: "FedEx Ground"
 *                               code:
 *                                 type: string
 *                                 example: "FEDEX_GROUND"
 *                               logo_url:
 *                                 type: string
 *                                 example: "https://example.com/fedex-logo.png"
 *                               service_description:
 *                                 type: string
 *                                 example: "Ground shipping with 3-5 business days delivery"
 *                           rates:
 *                             type: object
 *                             properties:
 *                               base_shipping_fee:
 *                                 type: number
 *                                 format: float
 *                                 example: 15.99
 *                               pickup_fee:
 *                                 type: number
 *                                 format: float
 *                                 example: 5.00
 *                               insurance_fee:
 *                                 type: number
 *                                 format: float
 *                                 example: 2.50
 *                               fuel_surcharge:
 *                                 type: number
 *                                 format: float
 *                                 example: 1.25
 *                               weekend_delivery_fee:
 *                                 type: number
 *                                 format: float
 *                                 example: 0.00
 *                               packaging_fee:
 *                                 type: number
 *                                 format: float
 *                                 example: 0.00
 *                               tax_amount:
 *                                 type: number
 *                                 format: float
 *                                 example: 1.60
 *                               total_amount:
 *                                 type: number
 *                                 format: float
 *                                 example: 26.34
 *                           delivery_info:
 *                             type: object
 *                             properties:
 *                               estimated_delivery_date:
 *                                 type: string
 *                                 format: date-time
 *                                 example: "2024-01-18T17:00:00Z"
 *                               estimated_delivery_days:
 *                                 type: integer
 *                                 example: 3
 *                               delivery_date_guaranteed:
 *                                 type: boolean
 *                                 example: false
 *                           package_info:
 *                             type: object
 *                             properties:
 *                               total_weight:
 *                                 type: number
 *                                 format: float
 *                                 example: 2.5
 *                               total_declared_value:
 *                                 type: number
 *                                 format: float
 *                                 example: 150.00
 *                               package_count:
 *                                 type: integer
 *                                 example: 1
 *                     easypost_shipment_id:
 *                       type: string
 *                       nullable: true
 *                       example: "shp_123456789"
 *                     fallback_mode:
 *                       type: boolean
 *                       example: false
 *                       description: Indicates if using local carrier rates instead of EasyPost
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Internal server error
 */
router.get("/shipments/:shipment_id/rates", authenticateToken, getCarrierRates);

/**
 * @swagger
 * /api/shipping/shipments/{shipment_id}/select-carrier:
 *   post:
 *     summary: Select carrier for a shipment
 *     description: Select a specific carrier and service type for a shipment to proceed with shipping
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shipment_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID of the shipment to select carrier for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [carrier_id, service_type]
 *             properties:
 *               carrier_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID of the selected carrier from the carriers table
 *               carrier_code:
 *                 type: string
 *                 example: "FX"
 *                 description: Code of the selected carrier (alternative to carrier_id)
 *               service_type:
 *                 type: string
 *                 example: "FEDEX_GROUND"
 *                 description: Type of shipping service
 *               pickup_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-16"
 *                 description: Preferred pickup date (optional)
 *               pickup_time_start:
 *                 type: string
 *                 example: "09:00"
 *                 description: Pickup time start (optional)
 *               pickup_time_end:
 *                 type: string
 *                 example: "17:00"
 *                 description: Pickup time end (optional)
 *               pickup_instructions:
 *                 type: string
 *                 example: "Please call before pickup"
 *                 description: Special pickup instructions (optional)
 *           example:
 *             carrier_id: 1
 *             carrier_code: "FX"
 *             service_type: "FEDEX_GROUND"
 *             pickup_date: "2024-01-16"
 *             pickup_time_start: "09:00"
 *             pickup_time_end: "17:00"
 *             pickup_instructions: "Please call before pickup"
 *     responses:
 *       200:
 *         description: Carrier selected successfully
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
 *                   example: "Carrier selected successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     shipment:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 123
 *                         status:
 *                           type: string
 *                           example: "confirmed"
 *                           enum: [draft, pending, confirmed, in_transit, delivered, cancelled]
 *                         carrier:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             name:
 *                               type: string
 *                               example: "FedEx Ground"
 *                             code:
 *                               type: string
 *                               example: "FEDEX_GROUND"
 *                             service_type:
 *                               type: string
 *                               example: "FEDEX_GROUND"
 *                         fees:
 *                           type: object
 *                           properties:
 *                             base_shipping_fee:
 *                               type: number
 *                               format: float
 *                               example: 15.99
 *                             pickup_fee:
 *                               type: number
 *                               format: float
 *                               example: 5.00
 *                             insurance_fee:
 *                               type: number
 *                               format: float
 *                               example: 2.50
 *                             fuel_surcharge:
 *                               type: number
 *                               format: float
 *                               example: 1.25
 *                             weekend_delivery_fee:
 *                               type: number
 *                               format: float
 *                               example: 0.00
 *                             packaging_fee:
 *                               type: number
 *                               format: float
 *                               example: 0.00
 *                             tax_amount:
 *                               type: number
 *                               format: float
 *                               example: 1.60
 *                             total_amount:
 *                               type: number
 *                               format: float
 *                               example: 26.34
 *                         delivery_info:
 *                           type: object
 *                           properties:
 *                             estimated_delivery_date:
 *                               type: string
 *                               format: date-time
 *                               example: "2024-01-18T17:00:00Z"
 *                             pickup_date:
 *                               type: string
 *                               format: date
 *                               example: "2024-01-16"
 *                             pickup_time_start:
 *                               type: string
 *                               example: "09:00"
 *                             pickup_time_end:
 *                               type: string
 *                               example: "17:00"
 *       400:
 *         description: Bad request - validation error or invalid carrier
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid carrier selection"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/shipments/:shipment_id/select-carrier",
  authenticateToken,
  validateDTO(CarrierSelectionDto),
  selectCarrier
);

/**
 * @swagger
 * /api/shipping/shipments/{shipment_id}:
 *   get:
 *     summary: Get shipment details
 *     description: Retrieve detailed information about a specific shipment including addresses, packages, and carrier information
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shipment_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID of the shipment to retrieve details for
 *     responses:
 *       200:
 *         description: Shipment details retrieved successfully
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
 *                   example: "Shipment details retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     shipment:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 123
 *                         status:
 *                           type: string
 *                           example: "confirmed"
 *                           enum: [draft, pending, confirmed, in_transit, delivered, cancelled]
 *                         sender_address:
 *                           $ref: '#/components/schemas/Address'
 *                         receiver_address:
 *                           $ref: '#/components/schemas/Address'
 *                         packages:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 1
 *                               length:
 *                                 type: number
 *                                 format: float
 *                                 example: 12.5
 *                               width:
 *                                 type: number
 *                                 format: float
 *                                 example: 8.0
 *                               height:
 *                                 type: number
 *                                 format: float
 *                                 example: 6.0
 *                               weight:
 *                                 type: number
 *                                 format: float
 *                                 example: 2.5
 *                               declared_value:
 *                                 type: number
 *                                 format: float
 *                                 example: 150.00
 *                               package_number:
 *                                 type: integer
 *                                 example: 1
 *                               description:
 *                                 type: string
 *                                 example: "Electronics - Laptop"
 *                         carrier:
 *                           type: object
 *                           nullable: true
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "fedex_ground"
 *                             name:
 *                               type: string
 *                               example: "FedEx Ground"
 *                             code:
 *                               type: string
 *                               example: "FEDEX_GROUND"
 *                             service_type:
 *                               type: string
 *                               example: "FEDEX_GROUND"
 *                         total_amount:
 *                           type: number
 *                           format: float
 *                           example: 26.34
 *                         shipping_fee:
 *                           type: number
 *                           format: float
 *                           example: 15.99
 *                         insurance_fee:
 *                           type: number
 *                           format: float
 *                           example: 2.50
 *                         pickup_fee:
 *                           type: number
 *                           format: float
 *                           example: 5.00
 *                         tax_amount:
 *                           type: number
 *                           format: float
 *                           example: 1.60
 *                         estimated_delivery_date:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-01-18T17:00:00Z"
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-01-15T10:30:00Z"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-01-15T10:35:00Z"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Internal server error
 */
router.get("/shipments/:shipment_id", authenticateToken, getShipmentDetails);

/**
 * @swagger
 * /api/shipping/shipments:
 *   get:
 *     summary: Get user's shipments
 *     description: Retrieve a paginated list of shipments for the authenticated user with optional filtering by status
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 100
 *           example: 10
 *         description: Number of items per page (max 100)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, pending, confirmed, in_transit, delivered, cancelled]
 *           example: "confirmed"
 *         description: Filter by shipment status
 *     responses:
 *       200:
 *         description: Shipments retrieved successfully
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
 *                   example: "Shipments retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     shipments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 123
 *                           status:
 *                             type: string
 *                             example: "confirmed"
 *                             enum: [draft, pending, confirmed, in_transit, delivered, cancelled]
 *                           sender_address:
 *                             type: object
 *                             properties:
 *                               first_name:
 *                                 type: string
 *                                 example: "John"
 *                               last_name:
 *                                 type: string
 *                                 example: "Doe"
 *                               city:
 *                                 type: string
 *                                 example: "New York"
 *                               state_province:
 *                                 type: string
 *                                 example: "NY"
 *                           receiver_address:
 *                             type: object
 *                             properties:
 *                               first_name:
 *                                 type: string
 *                                 example: "Jane"
 *                               last_name:
 *                                 type: string
 *                                 example: "Smith"
 *                               city:
 *                                 type: string
 *                                 example: "Los Angeles"
 *                               state_province:
 *                                 type: string
 *                                 example: "CA"
 *                           carrier:
 *                             type: object
 *                             nullable: true
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: "FedEx Ground"
 *                               code:
 *                                 type: string
 *                                 example: "FEDEX_GROUND"
 *                           total_amount:
 *                             type: number
 *                             format: float
 *                             example: 26.34
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             example: "2024-01-15T10:30:00Z"
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 25
 *                           description: Total number of shipments
 *                         page:
 *                           type: integer
 *                           example: 1
 *                           description: Current page number
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                           description: Number of items per page
 *                         total_pages:
 *                           type: integer
 *                           example: 3
 *                           description: Total number of pages
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get("/shipments", authenticateToken, getUserShipments);

/**
 * @swagger
 * /api/shipping/shipments/{shipment_id}/cancel:
 *   post:
 *     summary: Cancel a shipment
 *     description: Cancel a shipment if it hasn't been picked up or shipped yet
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shipment_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID of the shipment to cancel
 *     responses:
 *       200:
 *         description: Shipment cancelled successfully
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
 *                   example: "Shipment cancelled successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     shipment:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 123
 *                         status:
 *                           type: string
 *                           example: "cancelled"
 *                           enum: [draft, pending, confirmed, in_transit, delivered, cancelled]
 *                         cancelled_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-01-15T11:00:00Z"
 *       400:
 *         description: Bad request - cannot cancel shipment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Cannot cancel shipment that is already in transit"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/shipments/:shipment_id/cancel",
  authenticateToken,
  cancelShipment
);

/**
 * @swagger
 * /api/shipping/carriers/country/{country_code}:
 *   get:
 *     summary: Get carriers by country code
 *     description: Retrieve available shipping carriers for a specific country
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: country_code
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 2
 *           example: "US"
 *           pattern: "^[A-Z]{2}$"
 *         description: 2-letter ISO country code (e.g., US, CA, MX)
 *     responses:
 *       200:
 *         description: Carriers retrieved successfully
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
 *                   example: "Carriers retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     country_code:
 *                       type: string
 *                       example: "US"
 *                     carriers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "fedex_ground"
 *                           name:
 *                             type: string
 *                             example: "FedEx Ground"
 *                           type:
 *                             type: string
 *                             example: "ground"
 *                             enum: [ground, express, priority, economy]
 *                           description:
 *                             type: string
 *                             example: "Ground shipping with 3-5 business days delivery"
 *                           country_code:
 *                             type: string
 *                             example: "US"
 *                           is_active:
 *                             type: boolean
 *                             example: true
 *                           logo_url:
 *                             type: string
 *                             nullable: true
 *                             example: "https://example.com/fedex-logo.png"
 *                           supported_services:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["FEDEX_GROUND", "FEDEX_2_DAY", "FEDEX_EXPRESS"]
 *                           base_shipping_fee:
 *                             type: number
 *                             format: float
 *                             example: 15.99
 *                           estimated_delivery_days:
 *                             type: integer
 *                             example: 3
 *                     total_carriers:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Bad request - invalid country code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid country code format"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/carriers/country/:country_code",
  authenticateToken,
  getCarriersByCountry
);

/**
 * @swagger
 * /api/shipping/carriers:
 *   get:
 *     summary: Get all available carriers
 *     description: Retrieve all available shipping carriers across all supported countries
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All carriers retrieved successfully
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
 *                   example: "All carriers retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     carriers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "fedex_ground"
 *                           name:
 *                             type: string
 *                             example: "FedEx Ground"
 *                           type:
 *                             type: string
 *                             example: "ground"
 *                             enum: [ground, express, priority, economy]
 *                           description:
 *                             type: string
 *                             example: "Ground shipping with 3-5 business days delivery"
 *                           country_code:
 *                             type: string
 *                             example: "US"
 *                           is_active:
 *                             type: boolean
 *                             example: true
 *                           logo_url:
 *                             type: string
 *                             nullable: true
 *                             example: "https://example.com/fedex-logo.png"
 *                           supported_services:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["FEDEX_GROUND", "FEDEX_2_DAY", "FEDEX_EXPRESS"]
 *                           base_shipping_fee:
 *                             type: number
 *                             format: float
 *                             example: 15.99
 *                           estimated_delivery_days:
 *                             type: integer
 *                             example: 3
 *                           currency:
 *                             type: string
 *                             example: "USD"
 *                     total_carriers:
 *                       type: integer
 *                       example: 15
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/carriers", authenticateToken, getAllCarriers);

/**
 * @swagger
 * /api/shipping/validate-address:
 *   post:
 *     summary: Validate an address
 *     description: Validate the sender's address to ensure it's correct and can be used for shipping
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *           example:
 *             first_name: "John"
 *             last_name: "Doe"
 *             company_name: "Acme Corp"
 *             address_line_1: "123 Main Street"
 *             address_line_2: "Suite 100"
 *             city: "New York"
 *             state_province: "NY"
 *             postal_code: "10001"
 *             country: "US"
 *             phone_number: "+1-555-123-4567"
 *             email: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Address validated successfully
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
 *                   example: "Address validated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     is_valid:
 *                       type: boolean
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: "Address is valid"
 *       400:
 *         description: Bad request - invalid address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid address"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.post(
  "/validate-address",
  authenticateToken,
  validateDTO(AddressValidationDto),
  validateAddress
);

/**
 * @swagger
 * /api/shipping/default-sender-address:
 *   get:
 *     summary: Get default sender address
 *     description: Retrieve the default sender address configured for the authenticated user
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Default sender address retrieved successfully
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
 *                   example: "Default sender address retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     address:
 *                       $ref: '#/components/schemas/Address'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get(
  "/default-sender-address",
  authenticateToken,
  getDefaultSenderAddress
);

/**
 * @swagger
 * /api/shipping/shipments/{shipment_id}/pickup-rates:
 *   get:
 *     summary: Get pickup rates for a shipment
 *     description: Retrieve available pickup rates for a specific shipment after carrier selection
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shipment_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID of the shipment to get pickup rates for
 *     responses:
 *       200:
 *         description: Pickup rates retrieved successfully
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
 *                   example: "Pickup rates retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     shipment_id:
 *                       type: integer
 *                       example: 123
 *                     pickup_rates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "pickup_1"
 *                           date:
 *                             type: string
 *                             format: date
 *                             example: "2024-01-16"
 *                           time_slots:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 start:
 *                                   type: string
 *                                   example: "09:00"
 *                                 end:
 *                                   type: string
 *                                   example: "12:00"
 *                                 fee:
 *                                   type: number
 *                                   format: float
 *                                   example: 5.00
 *                           fee:
 *                             type: number
 *                             format: float
 *                             example: 5.00
 *       400:
 *         description: Bad request - no carrier selected
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/shipments/:shipment_id/pickup-rates",
  authenticateToken,
  getPickupRates
);

/**
 * @swagger
 * /api/shipping/shipments/{shipment_id}/schedule-pickup:
 *   post:
 *     summary: Schedule a pickup for a shipment
 *     description: Schedule a pickup date and time for a specific shipment
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shipment_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: ID of the shipment to schedule pickup for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PickupSchedulingDto'
 *           example:
 *             pickup_date: "2024-01-16"
 *             pickup_time_start: "09:00"
 *             pickup_time_end: "17:00"
 *             pickup_instructions: "Please call before pickup"
 *     responses:
 *       200:
 *         description: Pickup scheduled successfully
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
 *                   example: "Pickup scheduled successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     shipment:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 123
 *                         status:
 *                           type: string
 *                           example: "confirmed"
 *                           enum: [draft, pending, confirmed, in_transit, delivered, cancelled]
 *                         pickup_date:
 *                           type: string
 *                           format: date
 *                           example: "2024-01-16"
 *                         pickup_time_start:
 *                           type: string
 *                           example: "09:00"
 *                         pickup_time_end:
 *                           type: string
 *                           example: "17:00"
 *                         pickup_instructions:
 *                           type: string
 *                           example: "Please call before pickup"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2024-01-15T10:35:00Z"
 *       400:
 *         description: Bad request - validation error or invalid pickup date/time
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid pickup date/time"
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: Shipment not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/shipments/:shipment_id/schedule-pickup",
  authenticateToken,
  validateDTO(PickupSchedulingDto),
  schedulePickup
);

export default router;
