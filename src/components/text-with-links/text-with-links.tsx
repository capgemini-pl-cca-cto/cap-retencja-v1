import { Label } from '../ui/label';

export type TextWithLinksProps = {
  description: string;
  linkOne: string;
  linkOneLabel: string;
  linkTwo?: string;
  linkTwoLabel?: string;
};

export const TextWithLinks = ({
  description,
  linkOne,
  linkOneLabel,
  linkTwo,
  linkTwoLabel,
}: TextWithLinksProps) => {
  return (
    <div>
      <Label className="text-base font-normal text-primary-blue">
        {description}
      </Label>
      <a
        className="text-decoration-line: underline font-bold text-primary-blue"
        href={linkOne}
      >
        {linkOneLabel}
      </a>
      <br />
      <a
        className="text-decoration-line: underline font-bold text-primary-blue"
        href={linkTwo}
      >
        {linkTwoLabel}
      </a>
    </div>
  );
};
