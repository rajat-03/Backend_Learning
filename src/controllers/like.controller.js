import mongoose from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { userId } = req.user; // Assuming userId is available in req.user

  // Check if the user has already liked the video
  const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

  if (existingLike) {
    // User has already liked the video, so unlike it
    await Like.deleteOne({ _id: existingLike._id });
    return res.status(200).json(new ApiResponse(200, {}, "Video unliked successfully"));
  } else {
    // User has not liked the video, so like it
    const newLike = new Like({ video: videoId, likedBy: userId });
    await newLike.save();
    return res.status(200).json(new ApiResponse(200, {}, "Video liked successfully"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.user; // Assuming userId is available in req.user

  // Check if the user has already liked the comment
  const existingLike = await Like.findOne({ comment: commentId, likedBy: userId });

  if (existingLike) {
    // User has already liked the comment, so unlike it
    await Like.deleteOne({ _id: existingLike._id });
    return res.status(200).json(new ApiResponse(200, {}, "Comment unliked successfully"));
  } else {
    // User has not liked the comment, so like it
    const newLike = new Like({ comment: commentId, likedBy: userId });
    await newLike.save();
    return res.status(200).json(new ApiResponse(200, {}, "Comment liked successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { userId } = req.user; // Assuming userId is available in req.user

  // Check if the user has already liked the tweet
  const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId });

  if (existingLike) {
    // User has already liked the tweet, so unlike it
    await Like.deleteOne({ _id: existingLike._id });
    return res.status(200).json(new ApiResponse(200, {}, "Tweet unliked successfully"));
  } else {
    // User has not liked the tweet, so like it
    const newLike = new Like({ tweet: tweetId, likedBy: userId });
    await newLike.save();
    return res.status(200).json(new ApiResponse(200, {}, "Tweet liked successfully"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const { userId } = req.user; // Assuming userId is available in req.user

  // Find all liked videos by the user
  const likedVideos = await Like.find({ likedBy: userId }).populate("video");

  return res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos
};
