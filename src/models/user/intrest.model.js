import mongoose, { Schema } from "mongoose";

const intrestSchema = new Schema(
  {
    intrest_name: {
      type: String,
      required: true,
    }
  },
  {
     timestamps: true,
  }
);

export const Intrest = mongoose.model("Intrest", intrestSchema);
