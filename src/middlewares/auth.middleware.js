import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

// Middleware function to verify JWT token
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Retrieve JWT token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // If token is not provided, throw Unauthorized error
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify the JWT token using the access token secret
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user by decoded token's _id and exclude sensitive information
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    // If user is not found, throw Invalid Access Token error
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // Attach user object to request for further processing
    req.user = user;

    // Call next middleware
    next();
  } catch (error) {
    // If any error occurs during token verification, throw error with appropriate message
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
