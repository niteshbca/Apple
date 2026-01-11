const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* 🔹 MongoDB Atlas URL */
const MONGO_URL =
"mongodb+srv://niteshkumarsingh1500_db_user:bmGJLSXNqghFKT9W@cluster0.i5fv4ad.mongodb.net/appledb?retryWrites=true&w=majority";

mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err.message));

/* 🔹 Product Schema */
const ProductSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  count: { type: Number, default: 0 }
});

const Product = mongoose.model("Product", ProductSchema);

/* =========================
   🔹 CREATE PRODUCT
========================= */
app.post("/create-product", async (req, res) => {
  const { product } = req.body;
  if (!product) return res.status(400).send("Product required");

  let exist = await Product.findOne({ name: product });
  if (!exist) {
    await Product.create({ name: product, count: 0 });
  }

  res.json({ status: "created" });
});

/* =========================
   🔹 UPDATE COUNT (+ / -)
========================= */
app.post("/update", async (req, res) => {
  const { product, delta } = req.body;

  if (!product || !delta) {
    return res.status(400).json({ error: "Invalid data" });
  }

  let item = await Product.findOne({ name: product });
  if (!item) item = await Product.create({ name: product, count: 0 });

  item.count = Math.max(0, item.count + delta);
  await item.save();

  res.json({ count: item.count });
});

/* =========================
   🔹 DELETE PRODUCT
========================= */
app.delete("/delete-product/:name", async (req, res) => {
  await Product.deleteOne({ name: req.params.name });
  res.json({ status: "deleted" });
});

/* =========================
   🔹 GET ALL PRODUCTS
========================= */
app.get("/all", async (req, res) => {
  const items = await Product.find();
  const result = {};

  items.forEach(i => {
    result[i.name] = i.count;
  });

  res.json(result);
});

/* ========================= */
app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);
