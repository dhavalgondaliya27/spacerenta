import mongoose, { Schema } from 'mongoose';

const houseRuleSchema = new Schema(
  {
    property_id: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
    },
    pets_allowed: {
      type: Boolean,
      default: false,
    },
    max_pets_number: {
      type: Number,
      default: 0,
    },
    event_allowed: {
      type: Boolean,
      default: false,
    },
    smoking_allowed: {
      type: Boolean,
      default: false,
    },
    photography_allowed: {
      type: Boolean,
      default: false,
    },
    check_in_start_time: {
      type: String,
      default: '00:00',
    },
    check_in_end_time: {
      type: String,
      default: '00:00',
    },
    check_out_time: {
      type: String,
      default: '00:00',
    },
    additional_rules: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const HouseRule = mongoose.model('HouseRule', houseRuleSchema);
