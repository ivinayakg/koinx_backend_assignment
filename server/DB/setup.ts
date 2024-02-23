import mongoose from "mongoose";

type MongooseIndexType = {
  collection: mongoose.Collection;
  keys: any;
  options: mongoose.IndexOptions;
};

export async function DBSetup(url: string) {
  return mongoose.connect(url, { connectTimeoutMS: 3000 });
}

export async function DBClose() {
  return mongoose.connection.close();
}
