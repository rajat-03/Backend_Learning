import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { upload } from "../middlewares/multer.middlware.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
  // Construct the query object
  const filter = {};
  if (query) {
    // Add query filter if provided
    filter.$or = [
      { title: { $regex: query, $options: "i" } }, // Case-insensitive search by title
      { description: { $regex: query, $options: "i" } }, // Case-insensitive search by description
    ];
  }

  if (userId) {
    // Add user ID filter if provided
    filter.owner = userId;
  }

  // Construct the sort object
  const sort = {};
  if (sortBy) {
    // Add sorting criteria if provided
    sort[sortBy] = sortType === "desc" ? -1 : 1; // 1 for ascending, -1 for descending
  }

  // Execute the query to fetch videos
  const videos = await Video.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);

  // Get total count of videos (for pagination)
  const totalCount = await Video.countDocuments(filter);

  // Calculate total pages based on total count and limit
  const totalPages = Math.ceil(totalCount / limit);

  // Return paginated list of videos in the response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos,
        currentPage: page,
        totalPages,
        totalCount,
      },
      "Videos fetched successfully"
    )
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and Description required");
  }

  // Check if video file exists
  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  // Proceed with video upload
  const uploadedVideo = await uploadOnCloudinary(videoLocalPath);
  if (!uploadedVideo) {
    throw new ApiError(400, "Error in video upload on cloudinary");
  }

  // Proceed with thumbnail upload
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }
  const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!uploadedThumbnail) {
    throw new ApiError(400, "Error in thumbnail upload on cloudinary");
  }

  // Set ownerId to the currently logged-in user's _id
  const ownerId = req.user._id;

  // Create video object
  const video = await Video.create({
    videoFile: uploadedVideo.url,
    thumbnail: uploadedThumbnail.url,
    title,
    description,
    isPublished: true,
    views: 1,
    duration: uploadedVideo.duration,
    owner: ownerId,
  });

  // Check if video is created successfully
  if (!video) {
    throw new ApiError(
      400,
      "Something went wrong while registering video in db"
    );
  }

  // Return success response
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video file uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // Attempt to find the video by its ID in the database
  const video = await Video.findById(videoId);

  // If the video is not found, throw an error
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // If the video is found, return it in the response
  res.status(200).json(new ApiResponse(200, video, "Video found"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  const { newTitle, newDescription } = req.body;
  if (!newTitle || !newDescription) {
    throw new ApiError(400, "Title and Description required");
  }

  const thumbnailLocalPath = req.file?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }
  const newThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!newThumbnail) {
    throw new ApiError(400, "Error in upload on cloudnary");
  }
  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: newTitle,
        description: newDescription,
        thumbnail: newThumbnail.url,
      },
    },
    { new: true }
  );

  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  const video = await Video.findByIdAndDelete(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
