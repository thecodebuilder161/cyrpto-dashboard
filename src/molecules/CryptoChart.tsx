import CryptoLineChart from '../atoms/CryptoLineChart';

interface CryptoChartProps {
  coinId: string;
}

const CryptoChart = ({ coinId }: CryptoChartProps): JSX.Element => {
  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Market Trends</h2>
      <div className="h-[300px]">
        <CryptoLineChart coinId={coinId} />
      </div>
    </div>
  );
};

export default CryptoChart;
