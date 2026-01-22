
import PeriodePage from '@/pages/PeriodePage';

export default function Page({ params }: { params: { period: string } }) {
  // Ensure we pass a number to PeriodePage
  const periodNumber = parseInt(params.period, 10);
  
  // Basic validation/fallback could be added here if needed, 
  // but PeriodePage handles invalid data gracefully.
  return <PeriodePage period={periodNumber} />;
}
