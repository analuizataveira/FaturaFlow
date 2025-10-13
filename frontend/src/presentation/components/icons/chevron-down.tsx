
import { SVGProps, memo } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgComponent = ({ titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="10"
    height="7"
    viewBox="0 0 10 7"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby={titleId}
    {...props}
  >
    <path d="M5 3.99999L1.16667 0.166656L0 1.33332L5 6.33332L10 1.33332L8.83333 0.166656L5 3.99999Z" />
  </svg>
);
const ChevronDown = memo(SvgComponent);
export default ChevronDown;
