import URL from "../models/.model.js";
import QRCode from "qrcode";
import { nanoid } from "nanoid";

const validateUrl = (string) => {
  try {
    const u = new URL(string);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const createUrl = async (req, res) => {
  try {
    const { url, customCode, expireAfter } = req.body;

    if (!url || !validateUrl(url)) {
      return res.status(400).json({ error: "Invalid or missing URL" });
    }

    // handle expiry
    let expiresAt = null;
    if (expireAfter && expireAfter !== "never") {
      const hours = parseInt(expireAfter, 10);
      if (!isNaN(hours) && hours > 0) {
        expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
      }
    }

    // generate shortCode
    let shortCode = customCode ? customCode.trim() : nanoid(6);

    // check if customCode already exists
    if (customCode) {
      const existing = await URL.findOne({ shortCode });
      if (existing) {
        return res
          .status(400)
          .json({ error: "Custom shortcode already in use" });
      }
    }

    // your base domain
    const baseUrl = "https://lnks.co";
    const shortUrl = `${baseUrl}/${shortCode}`;

    // generate QR code (as Data URL)
    const qrCode = await QRCode.toDataURL(shortUrl);

    // save to DB
    const newUrl = await URL.create({
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
