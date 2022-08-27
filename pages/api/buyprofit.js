import User from "../../schema/User";
import dbConnect from "../../utils/dbConnect";
import jwt from "jsonwebtoken";
import Tyre from "../../schema/Tyre";

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
      let { from_date, to_date } = req.body;
      const data = await Tyre.find({})
        .where("purchase_date")
        .gt(from_date - 1)
        .lt(to_date + 1);
      let result = 0;
      for (let i = 0; i < data.length; i++) {
        result += data[i].buy_profit;
      }
      res.json({ data: result });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: err.toString() });
  }
};
