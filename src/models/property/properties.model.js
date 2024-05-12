import mongoose, { Schema } from 'mongoose';

const propertySchema = new Schema(
  {
    photo_tour_id: {
      type: Schema.Types.ObjectId,
        ref: 'PhotoTour',
    },
    title: {
      type: String,
      required: true,
    },
    property_type: {
      type: String,
      required: true,
    },
    room_type: {
      type: String,
      required: true,
    },
    max_guests: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    facility_id: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Facility',
      },
    ],
    location: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    co_hosts_id: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
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
    property_feature: {
      type: [String],
    },
    house_rule: {
      type: Schema.Types.ObjectId,
      ref: 'HouseRule',
    },
    guest_safety: {
      type: Schema.Types.ObjectId,
      ref: 'GuestSafety',
    },
    reservation: {
      type: String,
    },
    visibility: {
      type: String,
      required: true,
    },
    booking_id: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    directions: {
      type: String,
    },
    checkin_method_type: {
      type: String,
    },
    checkin_method_details: {
      type: String,
    },
    wifi_network_name: {
      type: String,
    },
    wifi_network_password: {
      type: String,
    },
    house_manual_details: {
      type: String,
    },
    interaction_preferences:{
      type: String,
    },
    discount_id: {
      type: String,
    },
    availability_calender: {
      type: Date,
    },
    // checkout_instructions: {
    //   type: String,
    // }

  },
  {
    timestamps: true,
  }
);

export const Property = mongoose.model('Property', propertySchema);
