// Import React for JSX support (required for some build/test setups)
import React from 'react';
// Import React hooks for state and lifecycle management
import { useState, useEffect } from 'react';
// Custom hook to fetch cryptocurrency data
import useCryptoData from '../hooks/useCryptoData';

// Number of items to show per page in the table
const ITEMS_PER_PAGE = 10;

// Props definition for the CryptoTable component
interface CryptoTableProps {
  searchQuery: string; // The current search string
  onSelectCoin: (coinId: string) => void; // Callback when a coin row is clicked
  selectedCoin: string; // The currently selected coin's id
}

// Main CryptoTable component
const CryptoTable = ({ searchQuery, onSelectCoin, selectedCoin }: CryptoTableProps): JSX.Element => {
  // Fetch crypto data with auto-refresh every 60 seconds (60000 ms)
  const { cryptoData, loading, error, refreshData } = useCryptoData(60000);
  // State for current page in pagination
  const [currentPage, setCurrentPage] = useState(1);
  // State for user's favorite coins, loaded from localStorage
  const [favorites, setFavorites] = useState<string[]>(
    JSON.parse(localStorage.getItem('favorites') || '[]')
  );
  // State to toggle showing only favorites
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  // State for sorting key (market cap, price, or 24h change)
  const [sortKey, setSortKey] = useState<'price' | 'market_cap' | 'change'>('market_cap');

  // Persist favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggle a coin as favorite/unfavorite
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  // Filter data by search query and favorites toggle
  const filteredData = cryptoData.filter((crypto) => {
    const matchesSearch =
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const isFavorite = favorites.includes(crypto.id);
    return matchesSearch && (!showFavoritesOnly || isFavorite);
  });

  // Sort filtered data by selected sort key
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortKey === 'price') return b.current_price - a.current_price;
    if (sortKey === 'change') return b.price_change_percentage_24h - a.price_change_percentage_24h;
    return b.market_cap - a.market_cap;
  });

  // Calculate total pages for pagination
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  // Paginate sorted data for current page
  const paginatedData = sortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Show loading, error, or no data messages as appropriate
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  if (!loading && !error && paginatedData.length === 0) {
    return <div className="text-center py-10 text-gray-500">No data found.</div>;
  }

  // Render the main table UI
  return (
    <div className="border p-6 bg-white text-gray-900 shadow-md rounded-lg min-h-[600px]">
      {/* Header with title and refresh button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Top Cryptocurrencies</h2>
        <button
          onClick={refreshData}
          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          disabled={loading}
        >
          {/* Show spinner when loading */}
          {loading && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          )}
          Refresh
        </button>
      </div>

      {/* Controls for favorites filter and sorting */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <label className="mr-2">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
            />{' '}
            Show only favorites
          </label>
        </div>
        <div>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as any)}
            className="border p-1 rounded"
          >
            <option value="market_cap">Sort by Market Cap</option>
            <option value="price">Sort by Price</option>
            <option value="change">Sort by 24h Change</option>
          </select>
        </div>
      </div>

      {/* Main crypto table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Fav</th>
              <th className="border p-2 text-left">Logo</th>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Symbol</th>
              <th className="border p-2 text-left">Price (USD)</th>
              <th className="border p-2 text-left">24h %</th>
              <th className="border p-2 text-left">Market Cap</th>
              <th className="border p-2 text-left">Volume</th>
              <th className="border p-2 text-left">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {/* Render each crypto row */}
            {paginatedData.map((crypto) => (
                <tr
                  key={crypto.id}
                  className={`hover:bg-blue-50 transition cursor-pointer ${selectedCoin === crypto.id ? 'bg-blue-100' : ''}`}
                  onClick={() => onSelectCoin(crypto.id)}
                >
                {/* Favorite star toggle */}
                <td className="p-2 text-center">
                  <button onClick={e => { e.stopPropagation(); toggleFavorite(crypto.id); }} className="text-xl">
                    {favorites.includes(crypto.id) ? '⭐' : '☆'}
                  </button>
                </td>
                {/* Coin logo */}
                <td className="p-2">
                  <img src={crypto.image} alt={crypto.name} className="w-6 h-6 rounded-full" />
                </td>
                {/* Coin name */}
                <td className="p-2 font-medium truncate max-w-[150px]">{crypto.name}</td>
                {/* Coin symbol (uppercase for style) */}
                <td className="p-2 uppercase">{crypto.symbol}</td>
                {/* Current price formatted as USD */}
                <td className="p-2">${crypto.current_price.toLocaleString()}</td>
                {/* 24h price change, colored green/red */}
                <td className={`p-2 font-semibold ${crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-500'}`}> {crypto.price_change_percentage_24h.toFixed(2)}%</td>
                {/* Market cap formatted as USD */}
                <td className="p-2">${crypto.market_cap.toLocaleString()}</td>
                {/* 24h volume formatted as USD */}
                <td className="p-2">${crypto.total_volume.toLocaleString()}</td>
                {/* Last updated timestamp, formatted */}
                <td className="p-2 text-xs text-gray-600">{new Date(crypto.last_updated).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Export the CryptoTable component as default
export default CryptoTable;