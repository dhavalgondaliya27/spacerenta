import mongoose, { Schema } from 'mongoose';

const sleepingArrangementSchema = new Schema(
  {
    photo_tour_id: {
      type: Schema.Types.ObjectId,
      ref: 'PhotoTour',
    },
    single: {
      type: Number,
    },
    double: {
      type: Number,
    },
    queen: {
      type: Number,
    },
    king: {
      type: Number,
    },
    small_double: {
      type: Number,
    },
    bunk_bed: {
      type: Number,
    },
    sofa_bed: {
      type: Number,
    },
    sofa: {
      type: Number,
    },
    floor_mattress: {
      type: Number,
    },
    airbed: {
      type: Number,
    },
    cot: {
      type: Number,
    },
    toddler_bed: {
      type: Number,
    },
    hammock: {
      type: Number,
    },
    water_bed: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const SleepingArrangement = mongoose.model('SleepingArrangement', sleepingArrangementSchema);
