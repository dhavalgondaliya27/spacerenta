import mongoose, { Schema } from 'mongoose';

const guestSafetySchema = new Schema(
  {
    property_id: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
    },
    question: {
      type: String,
    },
    answer: {
      type: Boolean,
    },
    details: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const GuestSafety = mongoose.model('GuestSafety', guestSafetySchema);
