const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");

const app=express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://niteshkumarsingh1500_db_user:bmGJLSXNqghFKT9W@cluster0.i5fv4ad.mongodb.net/inventory");

const Item=mongoose.model("Item",new mongoose.Schema({
  name:String,count:Number
}));

app.post("/create",async(req,res)=>{
  await Item.updateOne({name:req.body.name},{name:req.body.name,count:0},{upsert:true});
  res.send({ok:1});
});

app.post("/update",async(req,res)=>{
  const {name,pending}=req.body;
  const i=await Item.findOne({name})||{count:0};
  const c=Math.max(0,i.count+pending);
  await Item.updateOne({name},{count:c},{upsert:true});
  res.send({count:c});
});

app.delete("/delete/:name",async(req,res)=>{
  await Item.deleteOne({name:req.params.name});
  res.send({ok:1});
});

app.listen(3000,()=>console.log("🚀 Server 3000"));
