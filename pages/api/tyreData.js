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
    const result = await Tyre.find({});
    res.json({ data: result });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: err.toString() });
  }
};
