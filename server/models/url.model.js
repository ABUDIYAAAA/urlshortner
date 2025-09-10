import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: [true, "Original URL is required"],
    trim: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  qrCode: {
    type: String,
    default: null,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  lastAccessed: {
    type: Date,
  },
});

urlSchema.virtual("status").get(function () {
  if (!this.isActive) return "inactive";
  if (this.expiresAt && this.expiresAt < Date.now()) return "expired";
  return "active";
});

const Url = mongoose.model("Url", urlSchema);
export default Url;
