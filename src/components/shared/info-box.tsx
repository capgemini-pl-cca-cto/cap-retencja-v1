import { Alert, AlertDescription } from '@/components/ui/alert';

export default function InfoBox({ label }: { label: string }) {
  return (
    <Alert className="border-primary-blue pl-[16px] pr-[24px] py-[16px] bg-background [&>svg]:text-primary-blue [&>svg]:translate-y-0.5 items-start shadow-[0px_4px_5px_1px_#00000026]">
      <svg
        className="text-primary-blue !w-5 !h-5"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          transform="translate(0.000000,80.000000) scale(0.100000,-0.100000)"
          fill="currentColor"
          stroke="none"
        >
          <path d="M305 786 c-73 -18 -131 -51 -186 -106 -156 -156 -156 -404 1 -560 156 -157 404 -157 560 0 157 156 157 404 1 560 -101 101 -239 140 -376 106z m125 -201 c15 -18 10 -45 -12 -59 -35 -22 -74 27 -48 59 16 19 44 19 60 0z m10 -265 l0 -120 -40 0 -40 0 0 120 0 120 40 0 40 0 0 -120z" />
        </g>
      </svg>
      <AlertDescription className="text-primary-blue text-base font-medium">
        {label}
      </AlertDescription>
    </Alert>
  );
}
