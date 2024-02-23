import mongoose, { Schema, model } from "mongoose";

interface Coin {
  _id: mongoose.Types.ObjectId;
  symbol: string;
  name: string;
  image: string;
  total_supply: number;
  max_supply: number;
  last_updated: Date;
}

const CoinSchema = new Schema<Coin>(
  {
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    total_supply: { type: Number, required: true },
    max_supply: { type: Number, required: true },
  },
  { timestamps: { updatedAt: "last_updated" } }
);

const CoinModel = model<Coin>("Coin", CoinSchema);

export { CoinModel, Coin };
