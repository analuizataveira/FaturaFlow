import { SVGProps, memo } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgComponent = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="6"
    height="12"
    viewBox="0 0 6 12"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby={titleId}
    {...props}
  >
    {title === undefined ? (
      <title id={titleId}>{'ChevronSort'}</title>
    ) : title ? (
      <title id={titleId}>{title}</title>
    ) : null}
    <path d="M3 11.9989L0 8.99895L0.966667 8.03228L3 10.0656L5.03333 8.03228L6 8.99895L3 11.9989ZM0.966667 4.03228L0 3.06561L3 0.0656128L6 3.06561L5.03333 4.03228L3 1.99895L0.966667 4.03228Z" />
  </svg>
);
const ChevronSort = memo(SvgComponent);
export default ChevronSort;
