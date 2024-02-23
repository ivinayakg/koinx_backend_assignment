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

export async function DBIndexSetup(indexes: MongooseIndexType[]) {
  for (let index of indexes) {
    try {
      // Check if the index exists
      const indexExists = await doesIndexExist(
        index.collection,
        index.options.name as string
      );

      if (!indexExists) {
        // Create the index
        await index.collection.createIndex(index.keys, index.options);
        console.log(
          `Index ${index.options.name as string} created successfully.`
        );
      } else {
        console.log(`Index ${index.options.name as string} already exists.`);
      }
    } catch (error) {
      console.error("Error creating index:", error);
    }
  }
}

async function doesIndexExist(
  collection: mongoose.Collection,
  indexName: string
) {
  try {
    // List the indexes of the collection
    const indexes = await collection.listIndexes().toArray();

    // Check if the index exists
    for (let index of indexes) {
      if (index.name === indexName) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking index existence:", error);
    return false;
  }
}
