const BackgroundAnimation = () => {
  return (
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
  );
};

export default BackgroundAnimation;
