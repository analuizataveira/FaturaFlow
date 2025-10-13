import { SVGProps, memo } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgComponent = ({ titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width={30}
    height={30}
    viewBox="0 0 30 30"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby={titleId}
    {...props}
  >
    <path
      d="M15 27.5c6.887 0 12.5-5.613 12.5-12.5S21.887 2.5 15 2.5 2.5 8.113 2.5 15 8.113 27.5 15 27.5zm-2.238-16.25a.943.943 0 010-1.325.927.927 0 01.663-.275c.237 0 .475.088.662.275l4.413 4.412a.943.943 0 010 1.325l-4.412 4.413a.943.943 0 01-1.325 0 .943.943 0 010-1.325l3.75-3.75-3.75-3.75z"
      fill="#CC0808"
    />
  </svg>
);
const ChevronSideBar = memo(SvgComponent);
export default ChevronSideBar;
