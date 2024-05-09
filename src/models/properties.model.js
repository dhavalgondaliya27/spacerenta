import mongoose, { Schema } from 'mongoose';

const propertySchema = new Schema(
  {
    property_type: {
      type: String,
      required: true,
    },
    room_type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    photos: {
      type: [String],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price_per_night: {
      type: Number,
      required: true,
    },
    num_bedrooms: {
      type: Number,
      required: true,
    },
    num_bathrooms: {
      type: Number,
      required: true,
    },
    num_beds: {
      type: Number,
      required: true,
    },
    max_guests: {
      type: Number,
      required: true,
    },
    property_feature: {
      type: [String],
    },
    reservation: {
      type: String,
    },
    visibility: {
      type: String,
      required: true,
    },
    discount_id: {
      type: String,
    },
    facility_id: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Facility',
      },
    ],
    availability_calender: {
      type: Date,
    },
    booking_id: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    house_rule: {
      type: Schema.Types.ObjectId,
      ref: 'HouseRule',
    },
    guest_safety: {
      type: Schema.Types.ObjectId,
      ref: 'GuestSafety',
    }
  },
  {
    timestamps: true,
  }
);

export const Property = mongoose.model('Property', propertySchema);
