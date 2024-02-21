import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user._id;

  // Check if the user is already subscribed to the channel
  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscribers: subscriberId,
  });

  // If the subscription exists, unsubscribe; otherwise, subscribe
  if (existingSubscription) {
    // Unsubscribe
    await Subscription.findOneAndDelete({
      channel: channelId,
      subscribers: subscriberId,
    });
    res.status(200).json(new ApiResponse(200, {}, "Unsubscribed successfully"));
  } else {
    // Subscribe
    const newSubscription = await Subscription.create({
      channel: channelId,
      subscribers: subscriberId,
    });
    res
      .status(200)
      .json(new ApiResponse(200, newSubscription, "Subscribed successfully"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // Find all subscribers for the given channel
  const subscribers = await Subscription.find({ channel: channelId }).populate(
    "subscribers",
    "username fullName avatar"
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribers,
        "Channel subscribers fetched successfully"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  // Find all channels subscribed by the given user
  const subscribedChannels = await Subscription.find({
    subscribers: subscriberId,
  }).populate("channel", "username fullName avatar");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribedChannels,
        "Subscribed channels fetched successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
