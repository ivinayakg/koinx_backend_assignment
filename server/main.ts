import Express, {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { CoinInfoModel, CoinModel, DBIndexSetup, DBSetup } from "./DB";
import dotenv from "dotenv";
import { RunEveryHour } from "./services";
import { SyncCoins } from "./scripts";

dotenv.config();

const app = Express();

app.get("/", (req: ExpressRequest, res: ExpressResponse) => {
  res.send("Hello World");
});

const MONGODB_URI = process.env.MONGODB_URL;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URL is not defined");
}

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
        keys: { symbol: 1 },
        options: { unique: true, name: "symbol_coin_info_unique" },
      },
    ]);

    RunEveryHour(SyncCoins, true);

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.log("Error while connecting to the database", error);
  }
})();
