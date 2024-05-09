import mongoose, { Schema } from "mongoose";

const userprofileSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    profileImage: {
      type: String,
    },
    firstName: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    is_host: {
      type: Boolean,
      default: false
    },
    school: {
      type: String
    },
    work: {
      type: String
    },
    location: {
        type: String
    },
    language: {
      type: String,
    },
    show_DOB: {
      type: Boolean,
      default: false
    },
    favorite_song: {
      type: String,
    },
    obsessions: {
      type: String,
    },
    funfact: {
      type: String,
    },
    useless_skill: {
      type: String,
    },
    biography_title: {
      type: String,
    },
    time_spent: {
      type: String,
    },
    pets: {
      type: String,
    },
    about_you: {
      type: String
    },
    intrest: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Intrest',
      }
    ],

  },
  {
    timestamps: true,
  }
);

export const Userprofile = mongoose.model("Userprofile", userprofileSchema);
