import Url from "../models/url.model.js";
import QRCode from "qrcode";
import { nanoid } from "nanoid";

const validateUrl = (string) => {
  try {
    const u = new URL(string);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (error) {
    console.log("Failed with error:", error.message);
    return false;
  }
};

// Helper function to get base URL from request
const getBaseUrl = (req) => {
  const protocol = req.protocol;
  const host = req.get("host");
  return `${protocol}://${host}`;
};

const createUrl = async (req, res) => {
  try {
    const { url, customCode, expireAfter } = req.body;
    if (!url || !validateUrl(url)) {
      return res.status(400).json({ error: "Invalid or missing URL" });
    }

    let expiresAt = null;
    if (expireAfter && expireAfter !== "never") {
      const hours = parseInt(expireAfter, 10);
      if (!isNaN(hours) && hours > 0) {
        expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
      }
    }

    let shortCode = customCode ? customCode.trim() : nanoid(6);

    if (customCode) {
      const existing = await Url.findOne({ shortCode });
      if (existing) {
        return res
          .status(400)
          .json({ error: "Custom shortcode already in use" });
      }
    }

    // Use dynamic base URL from the current request
    const baseUrl = getBaseUrl(req);
    const shortUrl = `${baseUrl}/${shortCode}`;

    const qrCode = await QRCode.toDataURL(shortUrl);

    // save to DB
    const newUrl = await Url.create({
      originalUrl: url,
      shortCode,
      shortUrl,
      qrCode,
      expiresAt,
    });

    res.status(201).json({
      message: "Short URL created successfully",
      data: {
        shortUrl: newUrl.shortUrl,
        shortCode: newUrl.shortCode,
        qrCode: newUrl.qrCode,
        expiresAt: newUrl.expiresAt,
        originalUrl: newUrl.originalUrl,
        clicks: newUrl.clicks,
        createdAt: newUrl.createdAt,
      },
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    if (!shortCode) {
      return res.status(400).json({ error: "Short code is required" });
    }

    const urlDoc = await Url.findOne({ shortCode });

    if (!urlDoc) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    if (urlDoc.expiresAt && urlDoc.expiresAt < new Date()) {
      return res.status(410).json({ error: "This short URL has expired" });
    }

    await Url.findOneAndUpdate(
      { shortCode },
      {
        $inc: { clicks: 1 },
        $set: { lastAccessed: new Date() },
      },
      { new: true }
    );

    return res.redirect(301, urlDoc.originalUrl);
  } catch (error) {
    console.error("Error redirecting URL:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get URL statistics
const getUrlStats = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const urlDoc = await Url.findOne({ shortCode });

    if (!urlDoc) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.status(200).json({
      message: "URL statistics retrieved successfully",
      data: {
        shortCode: urlDoc.shortCode,
        shortUrl: urlDoc.shortUrl,
        originalUrl: urlDoc.originalUrl,
        clicks: urlDoc.clicks,
        isActive: urlDoc.isActive,
        createdAt: urlDoc.createdAt,
        expiresAt: urlDoc.expiresAt,
        status: urlDoc.status,
        lastAccessed: urlDoc.lastAccessed,
      },
    });
  } catch (error) {
    console.error("Error fetching URL stats:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export { createUrl, redirectUrl, getUrlStats };
