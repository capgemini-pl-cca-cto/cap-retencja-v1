import { Alert, AlertDescription } from '../ui/alert';
import { LucideInfo } from 'lucide-react';

export type InfoBoxProps = {
  description: string;
};

export const InfoBox = ({ description }: InfoBoxProps) => {
  return (
    <div>
      <Alert variant="default">
        <LucideInfo size={20} color="#0C4F7B" />
        <AlertDescription> {description} </AlertDescription>
      </Alert>
    </div>
  );
};
