import { Router } from "express";
import { LocationsController } from "./locations.controller";

const router = Router();
const locationsController = new LocationsController();

/**
 * @swagger
 * /api/locations/countries:
 *   get:
 *     summary: Get all supported countries with their details
 *     description: Retrieve a list of all supported countries including currency and country codes
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: List of countries retrieved successfully
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
 *                   example: Countries retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         example: US
 *                       name:
 *                         type: string
 *                         example: United States
 *                       currency:
 *                         type: string
 *                         example: US Dollar
 *                       currencyCode:
 *                         type: string
 *                         example: USD
 */
router.get("/countries", locationsController.getCountries);

/**
 * @swagger
 * /api/locations/countries/{countryCode}/states:
 *   get:
 *     summary: Get states/provinces for a specific country
 *     description: Retrieve all states or provinces for a given country
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: countryCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Country code (US or CA)
 *         example: US
 *     responses:
 *       200:
 *         description: States retrieved successfully
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
 *                   example: States retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         example: CA
 *                       name:
 *                         type: string
 *                         example: California
 *                       countryCode:
 *                         type: string
 *                         example: US
 */
router.get(
  "/countries/:countryCode/states",
  locationsController.getStatesByCountry
);

/**
 * @swagger
 * /api/locations/countries/{countryCode}/states/{stateCode}/cities:
 *   get:
 *     summary: Get cities for a specific state/province
 *     description: Retrieve all cities for a given state or province
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: countryCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Country code (US or CA)
 *         example: US
 *       - in: path
 *         name: stateCode
 *         required: true
 *         schema:
 *           type: string
 *         description: State/province code
 *         example: CA
 *     responses:
 *       200:
 *         description: Cities retrieved successfully
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
 *                   example: Cities retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Los Angeles
 *                       stateCode:
 *                         type: string
 *                         example: CA
 *                       countryCode:
 *                         type: string
 *                         example: US
 */
router.get(
  "/countries/:countryCode/states/:stateCode/cities",
  locationsController.getCitiesByState
);

/**
 * @swagger
 * /api/locations/states:
 *   get:
 *     summary: Get all states/provinces for all supported countries
 *     description: Retrieve all states and provinces from all supported countries
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: All states retrieved successfully
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
 *                   example: All states retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         example: CA
 *                       name:
 *                         type: string
 *                         example: California
 *                       countryCode:
 *                         type: string
 *                         example: US
 */
router.get("/states", locationsController.getAllStates);

/**
 * @swagger
 * /api/locations/cities:
 *   get:
 *     summary: Get all cities for all supported countries
 *     description: Retrieve all cities from all supported countries
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: All cities retrieved successfully
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
 *                   example: All cities retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Los Angeles
 *                       stateCode:
 *                         type: string
 *                         example: CA
 *                       countryCode:
 *                         type: string
 *                         example: US
 */
router.get("/cities", locationsController.getAllCities);

export default router;
