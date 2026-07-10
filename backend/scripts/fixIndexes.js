import mongoose from "mongoose";
import dotenv from "dotenv";
import Interview from "../models/Interview.js";

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  const indexes = await Interview.collection.getIndexes({ full: true });
  console.log("Current indexes:", JSON.stringify(indexes, null, 2));

  for (const idx of indexes) {
    if (idx.key && idx.key._fts === "text") {
      console.log("Dropping stale text index:", idx.name);
      await Interview.collection.dropIndex(idx.name);
    }
  }

  await Interview.syncIndexes();
  console.log("Indexes synced with schema.");

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});