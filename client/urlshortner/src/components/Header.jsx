const Header = () => {
  return (
    <div className="text-center space-y-4">
      <div className="inline-flex items-center gap-3 mb-4"></div>
      <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
        URL Shortener
      </h1>
      <p className="text-slate-400 text-lg">
        Transform your long URLs into powerful short links
      </p>
    </div>
  );
};

export default Header;
