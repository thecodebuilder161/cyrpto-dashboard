import DashboardTemplate from '../templates/DashboardTemplate';
import '../index.css';

const Home = (): JSX.Element => {
  return (
    <div className="mx-auto min-h-screen text-white">
      <DashboardTemplate />
    </div>
  );
};

export default Home;
