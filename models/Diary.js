const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "Title is required"],
    },
    content: {
      type: String,
      require: [true, "Content is required"],
      minlength: [10, "Content must be at least 10 character long"],
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Provide a User"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Diary", diarySchema);
