import { useState } from 'react';
import CryptoTable from '../molecules/CryptoTable';
import CryptoChart from '../molecules/CryptoChart';
import { useDebouncedValue } from '../utils/useDebouncedValue';

const CryptoDashboard = (): JSX.Element => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 500);
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <div className="max-w-screen-2xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Search Field */}
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CryptoTable searchQuery={debouncedSearch} onSelectCoin={setSelectedCoin} selectedCoin={selectedCoin} />
          </div>
          <div className="lg:col-span-1">
            <CryptoChart coinId={selectedCoin} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDashboard;
