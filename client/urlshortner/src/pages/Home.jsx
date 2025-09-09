import React, { useState, useEffect } from "react";
import { Copy, Check, ChevronDown, Link, Zap } from "lucide-react";
import useCreateUrl from "../hooks/createUrl";
const URLShortener = () => {
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expiry, setExpiry] = useState("24");
  const [customCode, setCustomCode] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { createUrl, data, loading, error } = useCreateUrl();
  // URL validation
  const validateUrl = (string) => {
    try {
      const u = new URL(string);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      try {
        new URL("https://" + string);
        return true;
      } catch {
        return false;
      }
    }
  };

  useEffect(() => {
    setIsValidUrl(url.trim() && validateUrl(url.trim()));
  }, [url]);

  const handleSubmit = async () => {
    if (!isValidUrl) return;

    setIsLoading(true);
    try {
      const result = await createUrl({
        og: url,
        exp: expiry,
        custom: customCode || undefined,
      });

      console.log("API response:", result);

      if (result?.shortUrl) {
        setShortenedUrl(result.shortUrl);
        setShowResults(true);
      }
    } catch (err) {
      console.error("Error creating URL:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleCustomCodeChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9-_]/g, "");
    setCustomCode(value);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-500/15 to-cyan-500/15 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-r from-emerald-500/25 to-teal-500/25 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        {/* Subtle animated lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="line-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5">
                <animate
                  attributeName="stop-opacity"
                  values="0.5;0.8;0.5"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3">
                <animate
                  attributeName="stop-opacity"
                  values="0.3;0.6;0.3"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          </defs>
          <path
            d="M0,200 Q400,50 800,200 T1600,200"
            stroke="url(#line-gradient)"
            strokeWidth="2"
            fill="none"
          >
            <animate
              attributeName="d"
              values="M0,200 Q400,50 800,200 T1600,200;M0,250 Q400,100 800,250 T1600,250;M0,200 Q400,50 800,200 T1600,200"
              dur="8s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-3 mb-4"></div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              URL Shortener
            </h1>
            <p className="text-slate-400 text-lg">
              Transform your long URLs into powerful short links
            </p>
          </div>

          {/* Main Input Card */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
            {/* Input */}
            <div className="flex rounded-2xl overflow-hidden shadow-lg border border-white/20 bg-white/5 backdrop-blur-sm">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your URL here..."
                className="flex-1 px-6 py-4 bg-transparent text-white placeholder-slate-400 focus:outline-none text-lg"
              />
              <button
                onClick={handleSubmit}
                disabled={!isValidUrl || isLoading}
                className={`px-8 py-4 font-semibold transition-all flex items-center gap-2 ${
                  isValidUrl && !isLoading
                    ? "bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white shadow-lg transform hover:scale-105"
                    : "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Shortening...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Shorten
                  </>
                )}
              </button>
            </div>

            {/* Advanced Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mt-6 group"
            >
              Advanced Options
              <ChevronDown
                className={`w-4 h-4 transition-all duration-300 group-hover:scale-110 ${
                  showAdvanced ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Advanced Panel */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                showAdvanced ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0"
              }`}
            >
              <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-3 text-slate-300">
                      Expire After
                    </label>
                    <select
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50 transition-colors backdrop-blur-sm"
                    >
                      <option value="24" className="bg-slate-800">
                        24 hours
                      </option>
                      <option value="168" className="bg-slate-800">
                        1 week
                      </option>
                      <option value="720" className="bg-slate-800">
                        1 month
                      </option>
                      <option value="8760" className="bg-slate-800">
                        1 year
                      </option>
                      <option value="never" className="bg-slate-800">
                        Never
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-3 text-slate-300">
                      Custom Short Code
                    </label>
                    <input
                      type="text"
                      value={customCode}
                      onChange={handleCustomCodeChange}
                      placeholder="e.g., my-awesome-link"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-pink-500/50 transition-colors backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {showResults && (
            <div
              className={`backdrop-blur-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6 shadow-2xl transition-all duration-500 ${
                showResults
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-8"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-400 mb-1">
                    Your shortened URL:
                  </p>
                  <p className="text-xl font-medium text-emerald-400 truncate">
                    {shortenedUrl}
                  </p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
                    copyStatus
                      ? "bg-emerald-500 text-white shadow-lg"
                      : "bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
                >
                  {copyStatus ? (
                    <>
                      <Check className="w-4 h-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default URLShortener;
