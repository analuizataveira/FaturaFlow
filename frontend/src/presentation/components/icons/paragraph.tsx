import { SVGProps, memo } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgComponent = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby={titleId}
    {...props}
  >
    {title === undefined ? (
      <title id={titleId}>{'Plus'}</title>
    ) : title ? (
      <title id={titleId}>{title}</title>
    ) : null}
    <path
      d="M3 10H21M3 14H12"
      stroke="white"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const Paragraph = memo(SvgComponent);
export default Paragraph;
