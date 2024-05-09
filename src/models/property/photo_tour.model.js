import mongoose, { Schema } from 'mongoose';

const photoTourSchema = new Schema(
  {
    property_id: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
    },
    type: {
      type: String,
      Enum: ['Bedroom', 'Bathroom', 'Exterior'],
    },
    photo: {
      type: [String],
    },
    sleeping_arrangement_id: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
    },
    privacy_info: {
      type: String,
    },
    facility_id: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Facility',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const PhotoTour = mongoose.model('PhotoTour', photoTourSchema);
