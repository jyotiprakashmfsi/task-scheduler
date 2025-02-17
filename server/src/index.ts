import express, { Request, Response } from "express";
import appRouter from "./routes/index";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import cors from "cors";
import dotenv from "dotenv"

dotenv.config()

require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Task Scheduler",
      version: "1.0.0",
      description: "Manage your tasks efficiently.",
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


app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));
app.use("/api", appRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
