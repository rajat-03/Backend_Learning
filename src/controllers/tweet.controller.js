import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const ownerId = req.user._id; // Assuming the currently logged-in user's ID is attached to req.user

  if (!content) {
    throw new ApiError(400, "Content of tweet is required");
  }
  // Create a new tweet
  const tweet = await Tweet.create({
    owner: ownerId,
    content: content,
  });

  if (!tweet) {
    throw new ApiError(404, "Failed to create tweet");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;

  const tweets = await Tweet.find({ owner: userId });
  if (!tweets) {
    throw new ApiError(400, "Tweet not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content: content,
      },
    },
    { new: true }
  );

  if (!updatedTweet) {
    throw new ApiError(400, "Failed to update tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId} = req.params

  const deletedTweet = await Tweet.findByIdAndDelete(tweetId)
  if (!deletedTweet) {
    throw new ApiError(400, "Tweet not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedTweet, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
