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

    const baseUrl = "https://lnks.co";
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
      },
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export { createUrl };
