import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { CoinInfoModel, CoinModel } from "../DB";

export async function ConversionCoinHandler(
  req: ExpressRequest,
  res: ExpressResponse
) {
  const { fromCurrency, toCurrency, date } = req.body;
  if (!fromCurrency || !toCurrency || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const fromCurrencyData = await CoinModel.findOne({ coinId: fromCurrency });
  if (!fromCurrencyData) {
    return res.status(404).json({ message: "From currency not found" });
  }

  const toCurrencyData = await CoinModel.findOne({ coinId: toCurrency });
  if (!toCurrencyData) {
    return res.status(404).json({ message: "To currency not found" });
  }

  const fromCurrencyInfo = await CoinInfoModel.findOne({
    symbol: fromCurrencyData.symbol,
    date: date,
  });

  const toCurrencyInfo = await CoinInfoModel.findOne({
    symbol: toCurrencyData.symbol,
    date: date,
  });

  if (!fromCurrencyInfo || !toCurrencyInfo) {
    return res.status(404).send({ message: "Currency info not found" });
  }

  const fromCurrencyPriceInToCurrency =
    fromCurrencyInfo.current_price / toCurrencyInfo.current_price;

  return res.status(200).json({
    coin: fromCurrency,
    price: fromCurrencyPriceInToCurrency,
    date: date,
    priceIn: toCurrency,
  });
}

export async function TreasuryCoinHandler(
  req: ExpressRequest,
  res: ExpressResponse
) {
  const { currency } = req.body;
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/companies/public_treasury/${currency}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: "Error fetching data" });
  }
}
