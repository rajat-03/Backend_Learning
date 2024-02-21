import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // Get the channel ID from the logged-in user
  const channelId = req.user._id;

  try {
    // Get total video views
    const totalViews = await Video.aggregate([
      {
        $match: { owner: mongoose.Types.ObjectId(channelId) },
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    // Get total subscribers
    const totalSubscribers = await Subscription.countDocuments({
      channel: channelId,
    });

    // Get total videos
    const totalVideos = await Video.countDocuments({ owner: channelId });

    // Get total likes on videos
    const totalLikes = await Like.countDocuments({
      video: { $in: await Video.find({ owner: channelId }).distinct("_id") },
    });

    // Prepare the response
    const channelStats = {
      totalViews: totalViews.length ? totalViews[0].totalViews : 0,
      totalSubscribers,
      totalVideos,
      totalLikes,
    };

    // Send the response
    res.status(200).json(new ApiResponse(200, channelStats, "Channel stats retrieved successfully"));
  } catch (error) {
    // Handle errors
    throw new ApiError(500, "Internal Server Error");
  }
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // Get the channel ID from the logged-in user
  const channelId = req.user._id;

  try {
    // Get all videos uploaded by the channel
    const videos = await Video.find({ owner: channelId });

    // Send the response
    res.status(200).json(new ApiResponse(200, videos, "Channel videos retrieved successfully"));
  } catch (error) {
    // Handle errors
    throw new ApiError(500, "Internal Server Error");
  }
});

export {
  getChannelStats,
  getChannelVideos
};
