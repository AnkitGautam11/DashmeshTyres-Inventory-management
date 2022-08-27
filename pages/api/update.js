import User from "../../schema/User";
import dbConnect from "../../utils/dbConnect";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";
import Tyre from "../../schema/Tyre";

const signToken = (id) => {
  return jwt.sign(
    { exp: Math.floor(Date.now() / 1000) + 1 * 24 * 60 * 60, id: id },
    process.env.JWT_SECRET
  );
};

//eslint-disable-next-line
export default async (req, res) => {
  try {
    await dbConnect();
    if (req.method === "POST") {
      await dbConnect();
      const { cookies } = req;
      const token = cookies.token;
      if (!token) {
        return res.status(400).json({ msg: "Authentication Required" });
      }
      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.id);
      if (!user) {
        return res.status(400).json({ msg: "Invalid User" });
      }
      const { tyre_data } = req.body;
      let tyre = await Tyre.findOne({ t_id: tyre_data.t_id });
      if (!tyre) {
        return res.status(404).json({ msg: "No tyre Found" });
      }
      tyre.sell_price = tyre_data.sell_price;
      tyre.cost_price = tyre_data.cost_price;
      tyre.sell_date = tyre_data.sell_date;
      tyre.buy_price = tyre_data.buy_price;
      tyre.buy_profit = tyre_data.cost_price - tyre_data.buy_price;
      tyre.sell_profit =
        tyre_data.status === "IN STOCK"
          ? 0
          : tyre_data.sell_price - tyre_data.cost_price;
      tyre.purchase_date = tyre_data.purchase_date;
      tyre.status = tyre_data.status;
      await tyre.save();
    }
    res.json({ data: "Done" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: err.toString() });
  }
};
