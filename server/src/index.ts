import express, { Request, Response } from "express";
import appRouter from "./routes/index";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import cors from "cors";

require("dotenv").config();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "School management System",
      version: "1.0.0",
      description: "Manage your school efficiently.",
    },
    persistAuthorization: true,
    defaultModelsExpandDepth: -1,
    docExpansion: 'none',
    initOAuth: {
      useBasicAuthenticationWithAccessCodeGrant: false
    }
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api", appRouter);

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
