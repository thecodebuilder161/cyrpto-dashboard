import Header from '../organisms/Header';
import CryptoDashboard from '../organisms/CryptoDashboard';

function DashboardTemplate(): JSX.Element {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="px-4 py-12 w-full">
          <CryptoDashboard />
        </main>
      </div>
    );
  }
  

export default DashboardTemplate;
