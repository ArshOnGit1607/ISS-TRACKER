import React, { useEffect, Suspense, lazy } from 'react';
import { Navbar } from './components/layout/Navbar';
import { ChatbotWidget } from './components/ai/ChatbotWidget';
import { useISSLocation } from './hooks/useISSLocation';
import { useNews } from './hooks/useNews';
import { useAstronauts } from './hooks/useAstronauts';
import { useAppStore } from './store/useAppStore';
import { Toaster } from 'react-hot-toast';
import { Skeleton } from './components/common/Skeleton';

const ISSDashboard = lazy(() => import('./components/iss/ISSDashboard').then(module => ({ default: module.ISSDashboard })));
const NewsDashboard = lazy(() => import('./components/news/NewsDashboard').then(module => ({ default: module.NewsDashboard })));
import { ISSSpeedChart } from './components/charts/ISSSpeedChart';
import { NewsDistributionChart } from './components/charts/NewsDistributionChart';

function AnalyticsDashboard({ issPositions, newsArticles }) {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">System Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest text-xs">Telemetry visualizations and mission briefings distribution.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ISSSpeedChart positions={issPositions} />
        <NewsDistributionChart articles={newsArticles} />
      </div>
    </div>
  );
}

function App() {
  const { theme } = useAppStore();
  
  const issLocation = useISSLocation(15000);
  const astronauts = useAstronauts();
  const news = useNews();

  const combinedIssData = {
    ...issLocation,
    astronauts: astronauts.astronauts
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const FallbackLoader = () => (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Skeleton className="w-64 h-10 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-space-900 pb-20 transition-colors duration-300 text-gray-900 dark:text-white font-sans selection:bg-blue-500/30">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#151A23' : '#fff',
            color: theme === 'dark' ? '#fff' : '#111827',
            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
            backdropFilter: 'blur(8px)',
          }
        }} 
      />
      
      <Navbar />
      
      <main className="space-y-16 mt-8">
        <Suspense fallback={<FallbackLoader />}>
          <section id="tracker" className="scroll-mt-20 border-b border-gray-200/50 dark:border-white/5 pb-16">
            <ISSDashboard data={issLocation} />
          </section>
          
          <section id="news" className="scroll-mt-20 border-b border-gray-200/50 dark:border-white/5 pb-16">
            <NewsDashboard data={news} />
          </section>
          
          <section id="analytics" className="scroll-mt-20 pb-16">
            <AnalyticsDashboard 
              issPositions={issLocation.positions} 
              newsArticles={news.rawArticles} 
            />
          </section>
        </Suspense>
      </main>

      <ChatbotWidget issData={combinedIssData} newsData={news} />
    </div>
  );
}

export default App;
