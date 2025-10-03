import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

type ChartData = {
    time: string;
    price: number;
};
  

interface Props {
  coinId: string;
}

const CryptoLineChart = ({ coinId }: Props): JSX.Element => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
        );
        const data = await response.json();

        const formatted: ChartData[] = data.prices.map(([timestamp, price]: [number, number]) => ({
          time: new Date(timestamp).toLocaleDateString(),
          price: parseFloat(price.toFixed(2)),
        }));

        setChartData(formatted);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchChartData();
  }, [coinId]);

  if (loading) return <div className="text-center">Loading chart...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="border p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        7-Day Price Trend ({coinId})
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#4f46e5" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CryptoLineChart;
