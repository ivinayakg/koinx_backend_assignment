import Express from "express";
import { CoinInfoModel, CoinModel, DBIndexSetup, DBSetup } from "./DB";
import dotenv from "dotenv";
import { RunEveryHour } from "./services";
import { SyncCoins } from "./scripts";
import router from "./routes";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import rateLimit from "express-rate-limit";
import cors from "cors";

dotenv.config();

const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(router);

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(","),
  methods: ["GET", "POST", "OPTIONS"],
};
app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "LogRocket Express API with Swagger",
      version: "0.1.0",
      description: "This is a simple koinx backend assignment",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Vinayak Goyal",
        email: "vinayak20029@gmail.com",
      },
    },
    servers: [
      {
        url: "/",
      },
    ],
  },
  apis: ["./routes/*.ts"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);
app.use(limiter);

const MONGODB_URI = process.env.MONGODB_URL;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URL is not defined");
}

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await DBSetup(MONGODB_URI);
    console.log("Connected to the database");

    // Setup indexes
    await DBIndexSetup([
      {
        collection: CoinModel.collection,
        keys: { symbol: 1 },
        options: { unique: true, name: "symbol_coin_unique" },
      },
      {
        collection: CoinInfoModel.collection,
        keys: { symbol: 1, date: 1 },
        options: { unique: true, name: "symbol_date_coin_info_unique" },
      },
    ]);

    RunEveryHour(SyncCoins, true);

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Error while connecting to the database", error);
  }
})();
