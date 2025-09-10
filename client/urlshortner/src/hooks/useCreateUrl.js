import { useState } from "react";
import axios from "axios";

export default function useCreateUrl() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const createUrl = async ({ og, exp = "never", custom = "" }) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      if (!og || typeof og !== "string") {
        throw new Error("URL is required");
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/create`,
        {
          url: og,
          expireAfter: exp,
          customCode: custom,
        },
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      if (!res.data?.data) {
        throw new Error("Invalid server response");
      }

      setData(res.data.data);
      return res.data.data;
    } catch (err) {
      console.error("API error:", err);

      let message =
        err.response?.data?.error ||
        (axios.isCancel(err) ? "Request timed out" : err.message) ||
        "Failed to create short URL";

      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createUrl, data, loading, error };
}
