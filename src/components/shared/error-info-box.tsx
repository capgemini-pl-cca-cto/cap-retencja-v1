import { Alert, AlertDescription } from '@/components/ui/alert';
import { LucideCircleAlert } from 'lucide-react';

export default function ErrorInfoBox({ label }: { label: string }) {
  return (
    <Alert className="border-destructive pl-[16px] pr-[24px] py-[16px] bg-background [&>svg]:text-destructive [&>svg]:translate-y-0 items-start shadow-[0px_4px_5px_1px_#00000026]">
      <LucideCircleAlert className="text-destructive" />
      <AlertDescription className="text-destructive text-base font-medium">
        {label}
      </AlertDescription>
    </Alert>
  );
}
