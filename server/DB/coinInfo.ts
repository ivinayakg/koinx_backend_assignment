import mongoose, { Schema, model } from "mongoose";

interface CoinInfo {
  _id: mongoose.Types.ObjectId;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  symbol: string;
  last_updated: Date;
  date: string;
}

const CoinInfoSchema = new Schema<CoinInfo>(
  {
    current_price: { type: Number, required: true },
    market_cap: { type: Number, required: true },
    market_cap_rank: { type: Number, required: true },
    fully_diluted_valuation: { type: Number, required: true },
    total_volume: { type: Number, required: true },
    high_24h: { type: Number, required: true },
    low_24h: { type: Number, required: true },
    price_change_24h: { type: Number, required: true },
    price_change_percentage_24h: { type: Number, required: true },
    circulating_supply: { type: Number, required: true },
    symbol: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: { updatedAt: "last_updated" } }
);

const CoinInfoModel = model<CoinInfo>("CoinInfo", CoinInfoSchema);

export { CoinInfoModel, CoinInfo };
