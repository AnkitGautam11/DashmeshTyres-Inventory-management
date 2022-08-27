import User from "../../schema/User";
import dbConnect from "../../utils/dbConnect";
import jwt from "jsonwebtoken";

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
    return res.status(200).json({ data: user });
  } catch (err) {
    return res.status(400).json({ msg: err.toString() });
  }
};
