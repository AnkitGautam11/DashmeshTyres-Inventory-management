import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  user_type: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
});

export default mongoose.models.users || mongoose.model("users", UserSchema);
