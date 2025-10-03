import { useState, useEffect, useCallback } from 'react';

export interface Crypto {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  last_updated: string;
}

const useCryptoData = (autoRefreshInterval: number = 0) => {
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptoData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1'
      );
      const data = await response.json();
      setCryptoData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCryptoData();
    if (autoRefreshInterval > 0) {
      const interval = setInterval(fetchCryptoData, autoRefreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchCryptoData, autoRefreshInterval]);

  return { cryptoData, loading, error, refreshData: fetchCryptoData };
};

export default useCryptoData;
