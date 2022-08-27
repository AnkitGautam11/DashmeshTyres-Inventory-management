import User from "../../schema/User";
import dbConnect from "../../utils/dbConnect";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//eslint-disable-next-line
export default async (req, res) => {
  try {
    /* await dbConnect();
    const data = [
      { username: "dashmesh", password: "2222", type: "USER" },
      { username: "admin", password: "password", type: "ADMIN" },
    ];
    const salt = await bcrypt.genSalt(10);
    for (let i = 0; i < data.length; i++) {
      let user = new User({
        user_type: data[i].type,
        username: data[i].username,
        password: await bcrypt.hash(data[i].password, salt),
      });
      await user.save();
    } */
    return res.status(200).json({ data: "done" });
  } catch (err) {
    return res.status(400).json({ msg: err.toString() });
  }
};
