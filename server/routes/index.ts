import { Router } from "express";
import {
  ConversionCoinHandler,
  TreasuryCoinHandler,
} from "../controllers/coins";

const router = Router();

/**
 * @swagger
 * tags:
 *  name: Coins
 *  description: The coins managing API
 * /conversion:
 *  post:
 *     summary: Convert one cryptocurrency to another
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromCurrency:
 *                 type: string
 *                 description: The cryptocurrency to convert from
 *               toCurrency:
 *                 type: string
 *                 description: The cryptocurrency to convert to
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date of the conversion
 *             required:
 *               - fromCurrency
 *               - toCurrency
 *               - date
 *     responses:
 *       '200':
 *         description: Successful conversion
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coin:
 *                   type: string
 *                   description: The cryptocurrency being converted
 *                 price:
 *                   type: number
 *                   description: The conversion price
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: The date of the conversion
 *                 priceIn:
 *                   type: string
 *                   description: The cryptocurrency being converted to
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Server error
 * /treasury:
 *  post:
 *     summary: Get the treasury of a cryptocurrency
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currency:
 *                 type: string
 *                 description: The cryptocurrency
 *             required:
 *               - currency
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 * /healthCheck:
 *  get:
 *     summary: check the server status
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post("/conversion", ConversionCoinHandler);
router.post("/treasury", TreasuryCoinHandler);
router.get("/healthCheck", (req, res) => {
  return res.status(200).send({ message: "Server is running" });
});

export default router;
