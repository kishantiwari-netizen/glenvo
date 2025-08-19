import { Request, Response } from "express";
import { LocationsService } from "./locations.service";
import { ResponseHandler } from "../../utils/responseHandler";

export class LocationsController {
  private locationsService: LocationsService;

  constructor() {
    this.locationsService = new LocationsService();
  }

  getCountries = async (req: Request, res: Response) => {
    try {
      const countries = await this.locationsService.getCountries();
      return ResponseHandler.success(
        res,
        countries,
        "Countries retrieved successfully"
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve countries",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  getStatesByCountry = async (req: Request, res: Response) => {
    try {
      const { countryCode } = req.params;
      const states = await this.locationsService.getStatesByCountry(
        countryCode.toUpperCase()
      );
      return ResponseHandler.success(
        res,
        states,
        "States retrieved successfully"
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve states",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  getCitiesByState = async (req: Request, res: Response) => {
    try {
      const { countryCode, stateCode } = req.params;
      const cities = await this.locationsService.getCitiesByState(
        countryCode.toUpperCase(),
        stateCode.toUpperCase()
      );
      return ResponseHandler.success(
        res,
        cities,
        "Cities retrieved successfully"
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve cities",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  getAllStates = async (req: Request, res: Response) => {
    try {
      const states = await this.locationsService.getAllStates();
      return ResponseHandler.success(
        res,
        states,
        "All states retrieved successfully"
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve states",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  getAllCities = async (req: Request, res: Response) => {
    try {
      const cities = await this.locationsService.getAllCities();
      return ResponseHandler.success(
        res,
        cities,
        "All cities retrieved successfully"
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve cities",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
