import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { userModel } from "../models/user-model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // Register user logic here
  // get user details from frontend
  // validation - not empty
  // check if already user exists - email, username
  // check if files are uploaded - check for avatar
  // upload them to cloudinary, avatar
  // create user in database
  // remove password and refresh token from response
  // check for user creation
  // send response

  const { fullName, username, email, password } = req.body;

  if ([fullName, username, email, password].some((field) => !field)) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) throw new ApiError(400, "User already exists");

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const cover = await uploadOnCloudinary(coverLocalPath);

  if (!avatar) throw new ApiError(400, "Avatar is required");

  const user = await userModel.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    cover: cover?.url || "",
  });

  const createdUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");
  if (!createdUser) throw new ApiError(500, "User not created");

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created"));
});
export { registerUser };
