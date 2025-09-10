import { Zap } from "lucide-react";

const UrlInput = ({ url, setUrl, onSubmit, isValid, isLoading, error }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isValid && !isLoading) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-col sm:flex-row rounded-2xl overflow-hidden shadow-lg border border-white/20 bg-white/5 backdrop-blur-sm w-full">
        {/* Input */}
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your URL here..."
          aria-label="URL input field"
          className="flex-1 px-6 py-4 bg-transparent text-white placeholder-slate-400 focus:outline-none text-lg w-full"
          disabled={isLoading}
        />

        {/* Button */}
        <button
          onClick={onSubmit}
          disabled={!isValid || isLoading}
          className={`px-8 py-4 font-semibold transition-all flex items-center justify-center gap-2 w-full sm:w-auto ${
            isValid && !isLoading
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

      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-sm font-medium px-2">{error}</p>
      )}
    </div>
  );
};

export default UrlInput;
