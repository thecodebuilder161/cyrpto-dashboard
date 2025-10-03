
const Header = (): JSX.Element => {
  return (
    <header className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="container px-4 py-5 flex justify-between items-center">
        <h1 className="text-white text-3xl font-extrabold tracking-wide">
          Crypto <span className="text-blue-500">Dashboard</span>
        </h1>
      </div>
    </header>

  );
};

export default Header;
