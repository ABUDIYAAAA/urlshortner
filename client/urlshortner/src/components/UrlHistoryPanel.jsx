import React from "react";
import {
  Copy,
  Check,
  QrCode,
  ExternalLink,
  Calendar,
  Activity,
} from "lucide-react";

const UrlHistoryPanel = ({ urls, onCopy, copyStatus }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (expiresAt) => {
    if (!expiresAt) return "text-emerald-400";

    const now = new Date();
    const expiry = new Date(expiresAt);

    return expiry > now ? "text-emerald-400" : "text-red-400";
  };

  const getStatusText = (expiresAt) => {
    if (!expiresAt) return "Active";

    const now = new Date();
    const expiry = new Date(expiresAt);

    return expiry > now ? "Active" : "Inactive";
  };

  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  if (!urls || urls.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
        <p className="text-slate-400">
          No URLs shortened yet. Create your first short link above!
        </p>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-white/10 border-b border-white/10 p-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Your Shortened URLs
        </h3>
        <p className="text-slate-400 text-sm">
          {urls.length} link{urls.length !== 1 ? "s" : ""} created
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-left">
              <th className="p-4 text-slate-300 font-medium text-sm">
                Short Link
              </th>
              <th className="p-4 text-slate-300 font-medium text-sm">
                Original Link
              </th>
              <th className="p-4 text-slate-300 font-medium text-sm">
                QR Code
              </th>
              <th className="p-4 text-slate-300 font-medium text-sm">Status</th>
              <th className="p-4 text-slate-300 font-medium text-sm">Date</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url, index) => (
              <tr
                key={url.shortCode || index}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                {/* Short Link + Copy Button */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-400 font-mono text-sm truncate max-w-[150px]">
                      {url.shortUrl}
                    </span>
                    <button
                      onClick={() => onCopy(url.shortUrl)}
                      className={`p-1 rounded-lg transition-colors ${
                        copyStatus === url.shortUrl
                          ? "bg-emerald-500 text-white"
                          : "bg-white/10 text-slate-300 hover:bg-white/20"
                      }`}
                    >
                      {copyStatus === url.shortUrl ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </td>

                {/* Original Link */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {getFaviconUrl(url.originalUrl) && (
                      <img
                        src={url.originalUrl}
                        alt=""
                        className="w-4 h-4"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    )}
                    <span className="text-slate-300 text-sm truncate max-w-[200px]">
                      {url.originalUrl} {/* Display the original URL as text */}
                    </span>
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </td>

                {/* QR Code */}
                <td className="p-4">
                  <div className="bg-white p-2 rounded-lg flex items-center justify-center">
                    <img src={url.qrCode} alt="QR Code" className="w-16 h-16" />
                  </div>
                </td>

                {/* Status */}
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity
                      className={`w-3 h-3 ${getStatusColor(url.expiresAt)}`}
                    />
                    <span
                      className={`text-xs font-medium ${getStatusColor(
                        url.expiresAt
                      )}`}
                    >
                      {getStatusText(url.expiresAt)}
                    </span>
                  </div>
                </td>

                {/* Date */}
                <td className="p-4">
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    {formatDate(url.createdAt || new Date().toISOString())}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UrlHistoryPanel;
