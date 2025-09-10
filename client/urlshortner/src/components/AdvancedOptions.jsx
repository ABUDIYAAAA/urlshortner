import { ChevronDown } from "lucide-react";

const AdvancedOptions = ({
  showAdvanced,
  setShowAdvanced,
  expiry,
  setExpiry,
  customCode,
  setCustomCode,
  handleCustomCodeChange,
}) => {
  return (
    <>
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
    </>
  );
};

export default AdvancedOptions;
