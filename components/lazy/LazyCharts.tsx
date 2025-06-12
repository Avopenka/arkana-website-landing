'use client';

import dynamic from 'next/dynamic';

// Loading fallback for chart components
const ChartLoadingFallback = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
    <div className="space-y-3 w-full max-w-sm">
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-32 bg-gray-100 rounded animate-pulse"></div>
      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
    </div>
  </div>
);

// Lazy load Chart.js components with auto-registration
export const LazyBarChartJS = dynamic(
  () => import('react-chartjs-2').then(async (mod) => {
    const { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } = await import('chart.js');
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
    return { default: mod.Bar };
  }),
  {
    ssr: false,
    loading: () => <ChartLoadingFallback />
  }
);

export const LazyDoughnutChart = dynamic(
  () => import('react-chartjs-2').then(async (mod) => {
    const { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } = await import('chart.js');
    ChartJS.register(ArcElement, Title, Tooltip, Legend);
    return { default: mod.Doughnut };
  }),
  {
    ssr: false,
    loading: () => <ChartLoadingFallback />
  }
);