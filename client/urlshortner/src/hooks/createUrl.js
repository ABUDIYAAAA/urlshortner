import { useState } from "react";
import axios from "axios";

export default function useCreateUrl() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const createUrl = async ({ og, exp = "never", custom = "" }) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/shorten`, {
        url: og,
        expireAfter: exp,
        customCode: custom || undefined,
      });

      setData(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || "Failed to create short URL"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createUrl, data, loading, error };
}
