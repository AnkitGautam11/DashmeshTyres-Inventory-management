import mongoose from "mongoose";

const TyreSchema = new mongoose.Schema({
  t_id: {
    type: String,
  },
  purchase_date: {
    type: Number,
  },
  location: {
    type: String,
  },
  cost_price: {
    type: Number,
  },
  buy_price: {
    type: Number,
  },
  buy_profit: {
    type: Number,
  },
  status: {
    type: String,
  },
  sell_date: {
    type: Number,
  },
  sell_price: {
    type: Number,
  },
  sell_profit: {
    type: Number,
  },
});

export default mongoose.models.tyres || mongoose.model("tyres", TyreSchema);
