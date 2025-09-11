import { useState, useEffect } from "react";
import useCreateUrl from "../hooks/useCreateUrl";
import useLocalStorage from "../hooks/useLocalStorage";
import BackgroundAnimation from "../components/BackgroundAnimation";
import Header from "../components/Header";
import UrlInput from "../components/UrlInput";
import AdvancedOptions from "../components/AdvancedOptions";
import UrlHistoryPanel from "../components/UrlHistoryPanel";
import { AlertTriangle } from "lucide-react";

const Home = () => {
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expiry, setExpiry] = useState("24");
  const [customCode, setCustomCode] = useState("");
  const [copyStatus, setCopyStatus] = useState(null);
  const [localError, setLocalError] = useState(null);

  const [urlHistory, setUrlHistory] = useLocalStorage(
    "url_shortener_history",
    []
  );

  const { createUrl, data, loading, error } = useCreateUrl();

  // URL validation
  const validateUrl = (string) => {
    try {
      const u = new URL(string);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      try {
        new URL("http://" + string);
        return true;
      } catch {
        return false;
      }
    }
  };

  useEffect(() => {
    setIsValidUrl(url.trim() && validateUrl(url.trim()));
  }, [url]);

  const normalizeUrl = (rawUrl) => {
    if (!rawUrl) return "";
    if (!/^https?:\/\//i.test(rawUrl)) {
      return `https://${rawUrl}`;
    }
    return rawUrl;
  };

  const handleSubmit = async () => {
    if (loading || !isValidUrl) return;

    setLocalError(null);

    const result = await createUrl({
      og: normalizeUrl(url),
      exp: expiry,
      custom: customCode || undefined,
    });

    if (!result) {
      setLocalError("Failed to shorten URL. Please try again.");
      return;
    }

    // Success → store in history
    const urlObject = {
      shortUrl: result.shortUrl,
      shortCode: result.shortCode,
      originalUrl: normalizeUrl(url),
      qrCode: result.qrCode,
      expiresAt: result.expiresAt,
      createdAt: new Date().toISOString(),
    };

    setUrlHistory((prev) => [urlObject, ...prev.slice(0, 49)]); // keep 50 max
    setUrl("");
    setCustomCode("");
    setExpiry("24");
  };

  const copyToClipboard = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyStatus(textToCopy);
      setTimeout(() => setCopyStatus(null), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
      setLocalError("Failed to copy link to clipboard.");
    }
  };

  const handleCustomCodeChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9-_]/g, "");
    setCustomCode(value);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <BackgroundAnimation />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl space-y-8">
          <Header />

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl space-y-4">
            <UrlInput
              url={url}
              setUrl={setUrl}
              onSubmit={handleSubmit}
              isValid={isValidUrl}
              isLoading={loading}
            />

            {/* Show API error or local error */}
            {(error || localError) && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                <AlertTriangle className="w-4 h-4" />
                {error || localError}
              </div>
            )}

            <AdvancedOptions
              showAdvanced={showAdvanced}
              setShowAdvanced={setShowAdvanced}
              expiry={expiry}
              setExpiry={setExpiry}
              customCode={customCode}
              setCustomCode={setCustomCode}
              handleCustomCodeChange={handleCustomCodeChange}
            />
          </div>

          <UrlHistoryPanel
            urls={urlHistory}
            onCopy={copyToClipboard}
            copyStatus={copyStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
