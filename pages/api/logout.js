import User from "../../schema/User";
import dbConnect from "../../utils/dbConnect";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";

//eslint-disable-next-line
export default async (req, res) => {
  try {
    await dbConnect();
    const serialized = serialize("token", "notoken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 1 * 60 * 24 * 60,
      path: "/",
    });
    res.setHeader("Set-Cookie", serialized);

    return res.status(200).json({ data: "User Logged Out" });
  } catch (err) {
    return res.status(400).json({ msg: err.toString() });
  }
};
