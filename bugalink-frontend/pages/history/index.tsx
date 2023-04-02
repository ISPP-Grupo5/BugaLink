import { BackButtonText } from '@/components/buttons/Back';
import AnimatedLayout from '@/components/layouts/animated';
import HistoryTabs from '@/components/tabs/history';

export default function History() {
  return (
    <AnimatedLayout className="overflow-y-scroll bg-white">
      <div className="sticky top-0 z-10 bg-white px-4">
        <BackButtonText text={'Historial'} />
      </div>
      <HistoryTabs />
    </AnimatedLayout>
  );
}
