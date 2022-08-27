import User from "../../schema/User";
import dbConnect from "../../utils/dbConnect";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";

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
      const { username, password } = req.body;
      const existing_user = await User.findOne({
        username,
      });
      if (!existing_user) {
        return res.status(400).json({ msg: "User doesn't exists" });
      }
      const match = await bcrypt.compare(password, existing_user.password);
      if (!match) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User doesn't exists" }] });
      }
      const token = signToken(existing_user._id);
      const serialized = serialize("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 60 * 24 * 60,
        path: "/",
        secure: false,
      });
      res.setHeader("Set-Cookie", serialized);
      return res.status(200).json({ data: existing_user });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: err.toString() });
  }
};
