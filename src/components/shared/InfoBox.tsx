import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function InfoBox({ label }: { label: string }) {
  return (
    <Alert className="border-primary-blue pl-[16px] pr-[24px] py-[16px] bg-background [&>svg]:text-primary-blue [&>svg]:translate-y-0 items-start shadow-[0px_4px_5px_1px_#00000026]">
      <Info className="text-primary-blue" />
      <AlertDescription className="text-primary-blue text-base font-medium">
        {label}
      </AlertDescription>
    </Alert>
  );
}
