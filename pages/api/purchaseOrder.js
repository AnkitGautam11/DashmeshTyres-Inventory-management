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
      const { location, tyre_data, date } = req.body;
      for (let i = 0; i < tyre_data.length; i++) {
        const tyre = new Tyre({
          t_id: tyre_data[i].id,
          purchase_date: date,
          location: location,
          cost_price: tyre_data[i].cost_price,
          buy_price: tyre_data[i].buy_price,
          buy_profit: tyre_data[i].cost_price - tyre_data[i].buy_price,
          status: "IN STOCK",
          sell_date: 0,
          sell_price: 0,
          sell_profit: 0,
        });
        await tyre.save();
      }
    }
    res.json({ data: "Done" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: err.toString() });
  }
};
