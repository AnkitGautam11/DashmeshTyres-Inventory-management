import User from "../../../schema/User";
import dbConnect from "../../../utils/dbConnect";
import jwt from "jsonwebtoken";
import Tyre from "../../../schema/Tyre";

//eslint-disable-next-line
export default async (req, res) => {
  try {
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
    const { id } = req.query;
    const result = await Tyre.findOne({ t_id: id });
    if (!result) {
      return res.status(404).json({ msg: "Not Purchased" });
    }
    if (result.status === "SOLD") {
      return res.status(404).json({ msg: "Already Sold" });
    }
    res.json({ data: { ...result._doc, id: result.t_id } });
  } catch (err) {
    return res.status(400).json({ msg: err.toString() });
  }
};
