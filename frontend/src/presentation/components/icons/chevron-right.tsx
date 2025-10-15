
import { SVGProps, memo } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgComponent = ({ titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="7"
    height="10"
    viewBox="0 0 7 10"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby={titleId}
    {...props}
  >
    <path d="M4.74023 5L0.802734 1.0625L1.86523 0L6.86523 5L1.86523 10L0.802734 8.9375L4.74023 5Z" />
  </svg>
);
const ChevronRight = memo(SvgComponent);
export default ChevronRight;
