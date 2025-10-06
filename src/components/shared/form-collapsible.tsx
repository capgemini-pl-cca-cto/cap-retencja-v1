import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface FormCollapsibleProps {
  title: string;
  titleBold: string;
  titleBoldHiddenOnSmall?: string;
  children: ReactNode;
}

export default function FormCollapsible({
  title,
  titleBold,
  titleBoldHiddenOnSmall,
  children,
}: FormCollapsibleProps) {
  return (
    <Collapsible className="group font-light flex flex-col gap-2">
      <CollapsibleTrigger className="flex items-center gap-2">
        <ChevronRight className="transition-transform group-data-[state=open]:rotate-90" />
        <span className="whitespace-nowrap">
          {title}
          <strong className="font-medium">
            {titleBold}
            {titleBoldHiddenOnSmall && (
              <span className="max-sm:hidden">{titleBoldHiddenOnSmall}</span>
            )}
          </strong>
          ?
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}
