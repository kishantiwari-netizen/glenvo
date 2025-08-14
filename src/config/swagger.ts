import swaggerJsdoc from "swagger-jsdoc";

interface SwaggerConfigOptions {
  port: number;
  environment?: string;
  baseUrl?: string;
}

export const createSwaggerConfig = (options: SwaggerConfigOptions) => {
  const { port, environment = "development", baseUrl = `http://localhost:${port}` } = options;

  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "GlenvoShip Authentication API",
        version: "1.0.0",
        description: "A comprehensive authentication and authorization API for GlenvoShip",
        contact: {
          name: "GlenvoShip Team",
          email: "support@glenvo.com",
          url: "https://glenvo.com",
        },
        license: {
          name: "MIT",
          url: "https://opensource.org/licenses/MIT",
        },
      },
      servers: [
        {
          url: baseUrl,
          description: `${environment.charAt(0).toUpperCase() + environment.slice(1)} server`,
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Enter your JWT token in the format: Bearer <token>",
          },
        },
        schemas: {
          Error: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: false,
              },
              message: {
                type: "string",
                example: "Error message",
              },
              errors: {
                type: "array",
                items: {
                  type: "string",
                },
                example: ["Validation error 1", "Validation error 2"],
              },
            },
          },
          Success: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: true,
              },
              message: {
                type: "string",
                example: "Operation completed successfully",
              },
              data: {
                type: "object",
                description: "Response data",
              },
            },
          },
        },
      },
      tags: [
        {
          name: "Authentication",
          description: "Authentication and authorization endpoints",
        },
        {
          name: "Users",
          description: "User management endpoints",
        },
        {
          name: "Roles",
          description: "Role and permission management endpoints",
        },
      ],
    },
    apis: ["./src/modules/**/*.ts"],
  };

  return swaggerJsdoc(swaggerOptions);
};

