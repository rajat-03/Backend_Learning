import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Query comments with pagination
  const comments = await Comment.find({ video: videoId })
    .populate("owner") // Optionally populate the owner field
    .sort({ createdAt: -1 }) // Sort comments by createdAt field in descending order
    .limit((limit, 10));

  // Count total number of comments for the video
  const totalCount = await Comment.countDocuments({ video: videoId });

  // Calculate total pages based on total count and limit
  const totalPages = Math.ceil(totalCount / parseInt(limit, 10));

  return res.status(200).json({
    comments,
    currentPage:page,
    totalPages,
    totalCount,
  });
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;
  const ownerId = req.user._id;

  const comment = await Comment.create({
    content: content,
    owner: ownerId,
    video: videoId,
  });

  if (!comment) {
    throw new ApiError(400, "Failed to publish comment");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: content,
      },
    },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError(400, "Failed to update comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  // If the comment is not found, throw an error
  if (!deletedComment) {
    throw new ApiError(404, "Comment not found");
  }

  // Return the deleted comment in the response
  res
    .status(200)
    .json(new ApiResponse(200, deletedComment, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
