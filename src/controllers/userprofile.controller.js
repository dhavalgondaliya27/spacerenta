import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { Userprofile } from '../models/userprofile.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Intrest } from '../models/intrest.model.js';

const createUserprofile = asyncHandler(async (req, res) => {
    const user = req.user;
  
    const {
      description,
      is_host,
      school,
      work,
      location,
      language,
      show_DOB,
      favorite_song,
      obsessions,
      funfact,
      useless_skill,
      biography_title,
      time_spent,
      pets,
      about_you,
      intrest,
    } = req.body;
  
    let intrestIds = [];
    if (Array.isArray(intrest)) {
      // If intrest is an array of strings, find the corresponding ObjectIds
      for (let i = 0; i < intrest.length; i++) {
        const intrestid = await Intrest.findOne({ intrest_name: intrest[i] });
        if (intrestid) {
          intrestIds.push(intrestid._id);
        }
        else{
            return res.status(404).json(new ApiError(404, 'Intrests not found'));
        }
      }
    } else {
      // If intrest is a single string, find the corresponding ObjectId
      const intrestid = await Intrest.findOne({ intrest_name: intrest });
      if (intrestid) {
        intrestIds.push(intrestid._id);
      }
      else{
        return res.status(404).json(new ApiError(404, 'Intrests not found'));
      }
    }
  
    if (intrestIds.length === 0) {
      return res.status(404).json(new ApiError(404, 'Intrests not found'));
    }
  
    const newUserprofile = await Userprofile.create({
      firstName: user.firstName,
      description,
      is_host,
      school,
      work,
      location,
      language,
      show_DOB,
      favorite_song,
      obsessions,
      funfact,
      useless_skill,
      biography_title,
      time_spent,
      pets,
      about_you,
      user_id: user._id,
      intrest: intrestIds,
    });
  
    const createdUserprofile = await Userprofile.findById(newUserprofile._id);
    if (!createdUserprofile) {
      return res.status(404).json(new ApiError(404, 'Userprofile not found'));
    }
    // Respond with the created userprofile
    res.status(201).json(new ApiResponse(201, createdUserprofile, 'Userprofile created'));
});
  
const updateUserprofile = asyncHandler(async (req, res) => {
    const userprofile_id = req.params.id
    const {
      description,
      is_host,
      school,
      work,
      location,
      language,
      show_DOB,
      favorite_song,
      obsessions,
      funfact,
      useless_skill,
      biography_title,
      time_spent,
      pets,
      about_you,
      intrest,
    } = req.body;
  
    let intrestIds = [];
    if (Array.isArray(intrest)) {
      // If intrest is an array of strings, find the corresponding ObjectIds
      for (let i = 0; i < intrest.length; i++) {
        const intrestid = await Intrest.findOne({ intrest_name: intrest[i] });
        if (intrestid) {
          intrestIds.push(intrestid._id);
        }
        else{
            return res.status(404).json(new ApiError(404, 'Intrests not found'));
        }
      }
    } else {
      // If intrest is a single string, find the corresponding ObjectId
      const intrestid = await Intrest.findOne({ intrest_name: intrest });
      if (intrestid) {
        intrestIds.push(intrestid._id);
      }
      else{
        return res.status(404).json(new ApiError(404, 'Intrests not found'));
      }
    }
  
    if (intrestIds.length === 0) {
      return res.status(404).json(new ApiError(404, 'Intrests not found'));
    }
    console.log(intrestIds);
    const updatedUserprofile = await Userprofile.findByIdAndUpdate(userprofile_id, {
      description,
      is_host,
      school,
      work,
      location,
      language,
      show_DOB,
      favorite_song,
      obsessions,
      funfact,
      useless_skill,
      biography_title,
      time_spent,
      pets,
      about_you,
      intrest: intrestIds,
    }, { new: true });
  
    if (!updatedUserprofile) {
      return res.status(404).json(new ApiError(404, 'Userprofile not found'));
    }
  
    res.status(200).json(new ApiResponse(200, updatedUserprofile, 'Userprofile updated'));
});

const addIntrest = asyncHandler(async (req, res) => {
    const intrestNames = 
    [
    "Adrenaline sports", "American football", "Animals", "Anime", "Archery", "Architecture", "Art", "Aviation", "Badminton", "Baseball", "Basketball", "Basque pelota", "Billiards", "Board games", "Bobsledding", "Bocce ball", "Bowling", "Boxing", "Bridge", "Building things", "Camping", "Canoeing", "Card Games", "Cars", "Charreria", "Cheerleading", "Chess", "Climbing", "Comedy", "Cooking", "Crafting", "Cricket", "Cultural heritage", "Curling", "Cycling", "Dance", "Darts", "Design", "Diving", "Dodgeball", "Equestrian sports", "Fantasy sports", "Fashion", "Fencing", "Figure skating", "Films", "Fishing", "Food", "Football", "Gardening", "Golf", "Gymnastics", "Hair", "Handball", "Hiking", "History", "Hockey", "Home improvement", "Horse racing", "Ice hockey", "Judo", "Karate", "Kayaking", "Kickboxing", "Kung fu", "Lacrosse", "Live music", "Live sports", "Luge", "Make-up", "Motor sports", "Museums", "Netball", "Outdoors", "Padel", "Pentathlon", "Photography", "Pickleball", "Playing music", "Podcasts", "Poker", "Polo", "Puzzles", "Racquetball", "Reading", "Rodeo", "Roller derby", "Roller skating", "Rowing", "Rugby", "Running", "Sailing", "Self-care", "Shooting sports", "Shopping", "Singing", "Skateboarding", "Skiing", "Snowboarding", "Social activism", "Spa", "Squash", "Sumo wrestling", "Surfing", "Sustainability", "Swimming", "Table tennis", "Taekwondo", "Tai chi", "Technology", "Tennis", "Theatre", "Track & field", "Travel", "TV", "Ultimate frisbee", "Video games", "Volleyball", "Volunteering", "Walking", "Water polo", "Water sports", "Weight lifting", "Wine", "Wrestling", "Writing", "Yoga"
    ]    
    const intrest = await Intrest.insertMany(
    intrestNames.map(name => ({ intrest_name: name}))
  );

  res.json(intrest);
});

export { createUserprofile, addIntrest, updateUserprofile };