import { CoinModel } from "../DB/coin";
import { CoinInfoModel } from "../DB/coinInfo";
import { TimeSleep } from "../utils";

export async function SyncCoins() {
  const totalIterations = 12;
  for (let i = 0; i < totalIterations; i++) {
    if (!(await getAndSaveCoins(i))) break;
    await TimeSleep(3000);
  }

  console.log("Finished syncing coins");
}

async function getAndSaveCoins(iteration: number): Promise<boolean> {
  let page = iteration + 1;
  console.log(`Iteration ${iteration}`);
  const coinData = await getCoins(page);
  if (!coinData || (coinData as any).length === 0) {
    return false;
  }
  await saveCoins(coinData, iteration);
  await saveCoinsInfo(coinData, iteration);

  return true;
}

async function saveCoinsInfo(coinsInfo: any, iteration: number) {
  try {
    let bulkOps: any[] = [];

    for (let data of coinsInfo) {
      let filter = { symbol: data.symbol };
      let update = {
        $set: {
          current_price: data.current_price,
          market_cap: data.market_cap,
          market_cap_rank: data.market_cap_rank,
          fully_diluted_valuation: data.fully_diluted_valuation,
          total_volume: data.total_volume,
          high_24h: data.high_24h,
          low_24h: data.low_24h,
          price_change_24h: data.price_change_24h,
          price_change_percentage_24h: data.price_change_percentage_24h,
          circulating_supply: data.circulating_supply,
          symbol: data.symbol,
        },
      };

      let upsert = {
        updateOne: {
          filter: filter,
          update: update,
          upsert: true,
        },
      };

      bulkOps.push(upsert);
    }

    const result = await CoinInfoModel.bulkWrite(bulkOps, { ordered: false });

    console.log(
      `Inserted ${result.upsertedCount} CoinInfo documents in iteration ${iteration}`
    );
  } catch (error) {
    console.error(
      `Error performing bulk write CoinInfo with ${iteration} iteration:`,
      error
    );
  }
}

async function saveCoins(coins: any, iteration: number) {
  try {
    let bulkOps: any[] = [];

    for (let data of coins) {
      let filter = { symbol: data.symbol };
      let update = {
        $set: {
          symbol: data.symbol,
          name: data.name,
          image: data.image,
          total_supply: data.total_supply,
          max_supply: data.max_supply,
        },
      };

      let upsert = {
        updateOne: {
          filter: filter,
          update: update,
          upsert: true,
        },
      };

      bulkOps.push(upsert);
    }

    const result = await CoinModel.bulkWrite(bulkOps, { ordered: false });

    console.log(
      `Inserted ${result.upsertedCount} Coin documents in iteration ${iteration}`
    );
  } catch (error) {
    console.error(
      `Error performing bulk write Coin with ${iteration} iteration:`,
      error
    );
  }
}

async function getCoins(page: number) {
  let market = "usd";
  let marketOrder = "market_cap_desc";
  let perPage = 150;
  let sparkline = false;
  let locale = "en";
  const COIN_GECKO_API_KEY = process.env.COIN_GECKO_API_KEY || "";
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${market}&order=${marketOrder}&per_page=${perPage}&page=${page}&sparkline=${sparkline}&locale=${locale}&x_cg_demo_api_key=${COIN_GECKO_API_KEY}`,
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
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
