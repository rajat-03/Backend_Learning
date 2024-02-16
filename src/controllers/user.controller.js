import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // things need to do in this method to create user

  //get user details from frontend
  //validation - not empty
  //check if user already exists: username , email
  //check for images, check for avatar
  //upload them to cloudinary, avatar
  //create user object - create entry in db
  // remove password and refresh token field from response
  // return response

  //get user details from frontend
  const { email, fullname, username, password } = req.body;
  console.log("email: ", email);

  /*
  //validation - not empty
  if(fullname === ""){
    throw new ApiError(400,"fullname is required");
    //we have to do the same for all the field or we can use some()
  }
  */
  //validation
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
    //agar field hai to usko trim kro phir check kro (=== " ") empty to nhi
  ) {
    throw new ApiError(400, "All field required");
  }

  //check if user already exists: username , email
  const existingUser = User.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    throw new ApiError(409, "User with email or username already exist");
  }

  //check for images, check for avatar
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, " Avatar file is required!");
  }

  //upload them to cloudinary, avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, " Avatar file is required!");
  }

  //create user object - create entry in db
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
    email,
    password,
  });

  // remove password and refresh token field from response
  const createdUser = User.findById(user._id).select("-password -refreshToken");

  //check user is created or not
  if (!createdUser) {
    throw new ApiError(400, " Something went wrong while registering user");
  }

  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
