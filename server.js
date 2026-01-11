const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URL =
"mongodb+srv://niteshkumarsingh1500_db_user:bmGJLSXNqghFKT9W@cluster0.i5fv4ad.mongodb.net/appledb?retryWrites=true&w=majority";

mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err.message));

const AppleSchema = new mongoose.Schema({
  count: { type: Number, default: 0 }
});

const Apple = mongoose.model("Apple", AppleSchema);

app.get("/count", async (req, res) => {
  let data = await Apple.findOne();
  if (!data) data = await Apple.create({ count: 0 });
  res.json({ count: data.count });
});

app.post("/update", async (req, res) => {
  const { delta } = req.body;
  let data = await Apple.findOne();
  if (!data) data = await Apple.create({ count: 0 });
  data.count = Math.max(0, data.count + delta);
  await data.save();
  res.json({ count: data.count });
});

app.listen(3000, () => console.log("🚀 Server running on 3000"));
