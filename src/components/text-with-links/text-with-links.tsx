import { FormLabel } from '../ui/form';

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
      <FormLabel className="text-base font-normal"> {description} </FormLabel>
      <a className="text-decoration-line: underline font-bold" href={linkOne}>
        {linkOneLabel}
      </a>
      <br />
      <a className="text-decoration-line: underline font-bold" href={linkTwo}>
        {linkTwoLabel}
      </a>
    </div>
  );
};
