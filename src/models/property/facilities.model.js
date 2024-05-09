import mongoose, { Schema } from "mongoose";

const facilitySchema = new Schema(
  {
    facility_name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    }
  },
  {
     timestamps: true,
  }
);

export const Facility = mongoose.model("Facility", facilitySchema);
