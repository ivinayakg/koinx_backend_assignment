import Express, {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import dotenv from "dotenv";

dotenv.config();

const app = Express();

app.get("/", (req: ExpressRequest, res: ExpressResponse) => {
  res.send("Hello World");
});

(async () => {
  try {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.log("Error while connecting to the database", error);
  }
})();
