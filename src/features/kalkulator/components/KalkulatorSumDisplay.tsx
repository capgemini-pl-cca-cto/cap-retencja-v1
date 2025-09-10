import { FormItem, FormLabel } from '@/components/ui/form';

interface KalkulatorSumDisplayProps {
  p1: number;
  p2: number;
  p3: number;
  p4: number;
}

export default function KalkulatorSumDisplay({
  p1,
  p2,
  p3,
  p4,
}: KalkulatorSumDisplayProps) {
  const sum = p1 + p2 + p3 + p4;
  const formatNumber = (value: number): string => {
    if (value === 0) return '0,00';
    return value.toFixed(2).replace('.', ',');
  };

  return (
    <FormItem className="flex justify-between">
      <FormLabel className="font-bold">
        Suma powierzchni P1, P2, P3, P4 [m2]
      </FormLabel>
      <div className="w-[285px] h-[56px] text-right bg-[#DFF5F5] text-[#0C4F7B] border-transparent px-[16px] py-[12px] text-base flex items-center justify-end font-bold">
        {formatNumber(sum)}
      </div>
    </FormItem>
  );
}
