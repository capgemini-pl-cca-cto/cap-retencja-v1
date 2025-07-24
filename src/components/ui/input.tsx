import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'dark:bg-input/30  h-[56px] w-full min-w-0 border border-primary-blue px-[16px] py-[12px] text-base outline-none  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ',
        'font-medium',
        'focus-visible:border-primary-blue focus-visible:ring-primary-blue/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
