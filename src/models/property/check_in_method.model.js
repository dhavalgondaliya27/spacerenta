import mongoose, { Schema } from 'mongoose';

const guestSafetySchema = new Schema(
  {
    property_id: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
    },
    type: {
      type: String,
      Enum: ['Safety', 'Health', 'Hygiene', 'Cleanliness'],
    },
    details: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

export const GuestSafety = mongoose.model('GuestSafety', guestSafetySchema);
