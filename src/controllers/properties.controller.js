import { Property } from '../models/property/properties.model.js';
import { Facility } from '../models/property/facilities.model.js';
import { User } from '../models/user/user.model.js';
import { HouseRule } from '../models/property/house_rule.model.js';
import { PhotoTour } from '../models/property/photo_tour.model.js';
import { GuestSafety } from '../models/property/guest_safety.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { SleepingArrangement } from '../models/property/sleeping_arrangement.model.js';


const createProperty = asyncHandler(async (req, res) => {
  const {
    property_type,
    room_type,
    title,
    description,
    location,
    price_per_night,
    num_bedrooms,
    num_bathrooms,
    num_beds,
    max_guests,
    property_feature,
    reservation,
    visibility,
    facility_names, // Array of facility names
  } = req.body;

  // Check if any required field is empty
  if (
    [
      property_type,
      room_type,
      title,
      description,
      location,
      price_per_night,
      num_bedrooms,
      num_bathrooms,
      num_beds,
      max_guests,
      visibility,
    ].some(field => field === undefined || field.trim() === '')
  ) {
    return res.status(400).json(new ApiError(400, null, 'All fields are required'));
  }

  // Handle facility names to IDs mapping
  let facilityIds = [];
  if (facility_names && Array.isArray(facility_names)) {
    // Query facilities matching the provided names
    const facilities = await Facility.find({ facility_name: { $in: facility_names } });
    // Collect the IDs of matching facilities
    facilityIds = facilities.map(facility => facility._id);
  }

  let propertyImageUrls = [];

  if (req.files) {
    const files = req.files;
    for (const file of files) {
      const propertyImageLocalPath = file.path;
      const propertyImage = await uploadOnCloudinary(propertyImageLocalPath);
      propertyImageUrls.push(propertyImage.url);
    }
  }
  console.log(propertyImageUrls);
  // Create a new photo tour for the property with type "Exterior"
  const photoTour = await PhotoTour.create({
    type: 'Exterior',
    photo: propertyImageUrls,
  });

  if (!photoTour) {
    return res.status(500).json(new ApiError(500, null, 'Photo tour not created'));
  }

  // Create a new property
  const property = await Property.create({
    property_type,
    room_type,
    title,
    description,
    location,
    price_per_night,
    num_bedrooms,
    num_bathrooms,
    num_beds,
    max_guests,
    property_feature,
    reservation,
    visibility,
    facility_id: facilityIds, // Update facility_id with collected IDs
    user_id: req.user._id,
    photo_tour_id: photoTour._id,
  });

  if (!property) {
    return res.status(500).json(new ApiError(500, null, 'Property not created'));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: { properties: property._id },
    },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json(new ApiError(404, 'User not found'));
  }

  // Respond with the created property
  res.status(201).json(new ApiResponse(201, property, 'Property created'));
});

// Controller for updating a property
const updateProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    property_type,
    room_type,
    title,
    description,
    location,
    price_per_night,
    num_bedrooms,
    num_bathrooms,
    num_beds,
    max_guests,
    property_feature,
    reservation,
    visibility,
  } = req.body;

  const updatedFields = {
    property_type,
    room_type,
    title,
    description,
    location,
    price_per_night,
    num_bedrooms,
    num_bathrooms,
    num_beds,
    max_guests,
    property_feature,
    reservation,
    visibility,
  };

  // Update the property
  const property = await Property.findByIdAndUpdate(id, updatedFields, { new: true });

  if (!property) {
    return res.status(500).json(new ApiError(500, null, 'Property not updated'));
  }

  // Respond with the updated property
  res.status(200).json(new ApiResponse(200, property, 'Property updated successfully'));
});

//show all properties
const showProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({});
  if (!properties) {
    return res.status(404).json(new ApiError(404, null, 'Properties not found'));
  }
  res.status(200).json(new ApiResponse(200, properties, 'Properties found'));
});


const showOwnProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ user_id: req.user._id });
  if (!properties) {
    return res.status(404).json(new ApiError(404, null, 'Properties not found'));
  }
  res.status(200).json(new ApiResponse(200, properties, 'Properties found'));
});

// Controller to create a new house rule
const createHouseRule = asyncHandler(async (req, res) => {
  const property_id = req.params.id;
  const {
    pets_allowed,
    max_pets_number,
    event_allowed,
    smoking_allowed,
    photography_allowed,
    check_in_start_time,
    check_in_end_time,
    check_out_time,
    additional_rules,
  } = req.body;

  const houseRule_exist = await HouseRule.find({ property_id });
  console.log(houseRule_exist);
  // Create a new house rule
  if (houseRule_exist.length > 0) {
    const updatedHouseRule = await HouseRule.findByIdAndUpdate(
      houseRule_exist[0]._id,
      {
        pets_allowed,
        max_pets_number,
        event_allowed,
        smoking_allowed,
        photography_allowed,
        check_in_start_time,
        check_in_end_time,
        check_out_time,
        additional_rules,
      },
      { new: true }
    );

    if (!updatedHouseRule) {
      return res.status(500).json(new ApiError(500, null, 'House rule not updated'));
    }

    // Respond with the updated house rule
    res.status(200).json(new ApiResponse(200, updatedHouseRule, 'House rule updated'));
  } else {
    const houseRule = await HouseRule.create({
      property_id,
      pets_allowed,
      max_pets_number,
      event_allowed,
      smoking_allowed,
      photography_allowed,
      check_in_start_time,
      check_in_end_time,
      check_out_time,
      additional_rules,
    });

    if (!houseRule) {
      return res.status(500).json(new ApiError(500, null, 'House rule not created'));
    }
    if (houseRule) {
      const property = await Property.findById(property_id);
      property.house_rule = houseRule._id;
      await property.save();
    }

    // Respond with the created house rule
    res.status(201).json(new ApiResponse(201, houseRule, 'House rule created'));
  }
});

const createGuestSafety = asyncHandler(async (req, res) => {
  const property_id = req.params.id;
  const { question, answer, details } = req.body;

  try {
    // Check if there is an existing safety entry for the property
    const existingSafety = await GuestSafety.findOne({ property_id });

    if (existingSafety) {
      // If safety information already exists, update it
      const updatedSafety = await GuestSafety.findByIdAndUpdate(
        existingSafety._id,
        {
          question,
          answer,
          details,
        },
        { new: true }
      );

      if (!updatedSafety) {
        return res
          .status(500)
          .json(new ApiError(500, null, 'Failed to update guest safety information'));
      }

      return res
        .status(200)
        .json(new ApiResponse(200, updatedSafety, 'Guest safety information updated'));
    }

    // Create a new safety entry
    const newSafety = await GuestSafety.create({
      property_id,
      question,
      answer,
      details,
    });

    if (!newSafety) {
      return res
        .status(500)
        .json(new ApiError(500, null, 'Failed to create guest safety information'));
    }

    // Update property with the newly created safety entry
    const property = await Property.findById(property_id);
    if (!property) {
      return res.status(404).json(new ApiError(404, null, 'Property not found'));
    }
    property.guest_safety = newSafety._id;
    await property.save();

    // Respond with the created safety entry
    return res
      .status(201)
      .json(new ApiResponse(201, newSafety, 'Guest safety information created'));
  } catch (error) {
    console.error('Error creating or updating guest safety information:', error);
    return res.status(500).json(new ApiError(500, null, 'Internal server error'));
  }
});

const photoTourforBathroom = asyncHandler(async (req, res) => {
  const property_id = req.params.id;
  const {
    facility_names, // Array of facility names
  } = req.body;

  // Check if photo tour exists for the property

  let propertyImageUrls = [];

  if (req.files) {
    const files = req.files;
    for (const file of files) {
      const propertyImageLocalPath = file.path;
      const propertyImage = await uploadOnCloudinary(propertyImageLocalPath);
      propertyImageUrls.push(propertyImage.url);
    }
  }
  console.log(propertyImageUrls);

  let facilityIds = [];
  if (facility_names && Array.isArray(facility_names)) {
    // Query facilities matching the provided names
    const facilities = await Facility.find({ facility_name: { $in: facility_names } });
    // Collect the IDs of matching facilities
    facilityIds = facilities.map(facility => facility._id);
  }

  let photoTour = await PhotoTour.findOne({ property_id, type: 'Bathroom' });
  if (photoTour) {
    // Update existing photo tour
    photoTour = await PhotoTour.findByIdAndUpdate(
      photoTour._id,
      {
        type: 'Bathroom',
        photo: propertyImageUrls,
        facility_id: facilityIds,
      },
      { new: true }
    );
  } else {
    // Create new photo tour
    photoTour = await PhotoTour.create({
      property_id,
      type: 'Bathroom',
      photo: propertyImageUrls,
      facility_id: facilityIds,
    });
  }

  // Respond with the created or updated photo tour
  res.status(201).json(new ApiResponse(201, photoTour, 'Photo tour created/updated'));
});

const photoTourforBedroom = asyncHandler(async (req, res) => {
  const property_id = req.params.id;
  const {
    facility_names, // Array of facility names
    single,
    double,
    queen,
    king,
    small_double,
    bunk_bed,
    sofa_bed,
    sofa,
    floor_mattress,
    airbed,
    cot,
    toddler_bed,
    hammock,
    water_bed,
  } = req.body;

  // Check if photo tour exists for the property

  let propertyImageUrls = [];

  if (req.files) {
    const files = req.files;
    for (const file of files) {
      const propertyImageLocalPath = file.path;
      const propertyImage = await uploadOnCloudinary(propertyImageLocalPath);
      propertyImageUrls.push(propertyImage.url);
    }
  }
  console.log(propertyImageUrls);

  let facilityIds = [];
  if (facility_names && Array.isArray(facility_names)) {
    // Query facilities matching the provided names
    const facilities = await Facility.find({ facility_name: { $in: facility_names } });
    // Collect the IDs of matching facilities
    facilityIds = facilities.map(facility => facility._id);
  }

  let photoTour = await PhotoTour.findOne({ property_id, type: 'Bedroom' });
  if (photoTour) {
    // Update existing photo tour
    photoTour = await PhotoTour.findByIdAndUpdate(
      photoTour._id,
      {
        type: 'Bedroom',
        photo: propertyImageUrls,
        facility_id: facilityIds,
      },
      { new: true }
    );
  } else {
    // Create new photo tour
    photoTour = await PhotoTour.create({
      property_id,
      type: 'Bedroom',
      photo: propertyImageUrls,
      facility_id: facilityIds,
    });
  }

  let sleeping_arrangement = await SleepingArrangement.findOne({ photo_tour_id: photoTour._id });
  if (sleeping_arrangement) {
    await SleepingArrangement.findByIdAndUpdate(sleeping_arrangement._id, {
      single,
      double,
      queen,
      king,
      small_double,
      bunk_bed,
      sofa_bed,
      sofa,
      floor_mattress,
      airbed,
      cot,
      toddler_bed,
      hammock,
      water_bed,
    });
  } else {
    await SleepingArrangement.create({
      photo_tour_id: photoTour._id,
      single,
      double,
      queen,
      king,
      small_double,
      bunk_bed,
      sofa_bed,
      sofa,
      floor_mattress,
      airbed,
      cot,
      toddler_bed,
      hammock,
      water_bed,
    });
  }

  // Respond with the created or updated photo tour
  res.status(201).json(new ApiResponse(201, photoTour, 'Photo tour created/updated'));
});

// add facility names
// For Admin side
const addFacility = asyncHandler(async (req, res) => {
  const { facility_name, type } = req.body;
  console.log(req.body);
  if (
    facility_name === undefined ||
    facility_name.trim() === '' ||
    type === undefined ||
    type.trim() === ''
  ) {
    return res.status(400).json(new ApiError(400, null, 'All fields are required'));
  }

  // Check if facility with the same name and type already exists
  const existingFacility = await Facility.findOne({ facility_name, type });
  if (existingFacility) {
    return res
      .status(400)
      .json(new ApiError(400, null, 'Facility with this name and type already exists'));
  }

  const facility = await Facility.create({
    facility_name,
    type,
  });

  if (!facility) {
    return res.status(500).json(new ApiError(500, null, 'Facility not created'));
  }

  // Respond with the created property
  res.status(201).json(new ApiResponse(201, facility, 'Facility created'));
});

const getFacilityByType = asyncHandler(async (req, res) => {
  const { type } = req.body;
  const facilities = await Facility.find({ type });
  if (!facilities || facilities.length === 0) {
    return res.status(404).json(new ApiError(404, null, 'No facilities found'));
  }
  res.status(200).json(new ApiResponse(200, facilities, 'Facilities found'));
});

const deleteProperty = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the property by ID
  const property = await Property.findById(id);

  if (!property) {
    return res.status(404).json(new ApiError(404, null, 'Property not found'));
  }

  // Check if the user is authorized to delete the property
  if (property.user_id.toString() !== req.user._id.toString()) {
    return res.status(403).json(new ApiError(403, null, 'Unauthorized to delete this property'));
  }

  // Delete associated house rule, guest safety, photo tours, sleeping arrangement, etc.
  await HouseRule.deleteOne({ property_id: id });
  await GuestSafety.deleteOne({ property_id: id });

  await PhotoTour.deleteMany({ _id: property.photo_tour_id });
  await SleepingArrangement.deleteOne({ photo_tour_id: id });

  // Delete the property itself
  await Property.deleteOne({ _id: id });

  // Remove property reference from user's properties list
  await User.findByIdAndUpdate(req.user._id, { $pull: { properties: id } });

  res.status(200).json(new ApiResponse(200, null, 'Property deleted successfully'));
});



//add all facilities
// const addFacility = asyncHandler(async (req, res) => {
//     const facilityNames =
//   ["Breakfast", "Cleaning available during stay", "Long-term stays allowed", "Luggage drop-off allowed"]
//     const facilities = await Facility.insertMany(
//     facilityNames.map(name => ({ facility_name: name, type: 'Services' }))
//   );

//   res.json(facilities);
// });

export {
  createProperty,
  updateProperty,
  showProperties,
  addFacility,
  showOwnProperties,
  createHouseRule,
  createGuestSafety,
  photoTourforBathroom,
  photoTourforBedroom,
  getFacilityByType,
  deleteProperty,
};
