import { Property } from '../models/properties.model.js';
import { Facility } from '../models/facilities.model.js';
import { User } from '../models/user.model.js';
import { HouseRule } from '../models/house_rule.model.js';
import { GuestSafety } from '../models/guest_safety.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// Controller for creating properties for a user

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
  console.log(facility_names);
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

  let propertieImageUrls = [];
  if (req.files) {
    const files = req.files;
    console.log(files);
    for (const file of files) {
      const propertieImageLocalPath = file.path;
      const propertieimage = await uploadOnCloudinary(propertieImageLocalPath);
      propertieImageUrls.push(propertieimage.url);
    }
  }
 
  // Create a new property
  const property = await Property.create({
    property_type,
    room_type,
    title,
    description,
    photos: propertieImageUrls,
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
  });

  if (!property) {
    return res.status(500).json(new ApiError(500, null, 'Property not created'));
  }
   console.log(property._id);
  const updatedUser = await User.findByIdAndUpdate(req.user._id, {
      $push: { proparties: property._id },
  }, { new: true });

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
      const updatedSafety = await GuestSafety.findByIdAndUpdate(existingSafety._id, {
        question,
        answer,
        details,
      }, { new: true });

      if (!updatedSafety) {
        return res.status(500).json(new ApiError(500, null, 'Failed to update guest safety information'));
      }

      return res.status(200).json(new ApiResponse(200, updatedSafety, 'Guest safety information updated'));
    }

    // Create a new safety entry
    const newSafety = await GuestSafety.create({
      property_id,
      question,
      answer,
      details,
    });

    if (!newSafety) {
      return res.status(500).json(new ApiError(500, null, 'Failed to create guest safety information'));
    }

    // Update property with the newly created safety entry
    const property = await Property.findById(property_id);
    if (!property) {
      return res.status(404).json(new ApiError(404, null, 'Property not found'));
    }
    property.guest_safety = newSafety._id;
    await property.save();

    // Respond with the created safety entry
    return res.status(201).json(new ApiResponse(201, newSafety, 'Guest safety information created'));
  } catch (error) {
    console.error('Error creating or updating guest safety information:', error);
    return res.status(500).json(new ApiError(500, null, 'Internal server error'));
  }
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
  createGuestSafety
};
