  
import { SVGProps, memo } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgComponent = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby={titleId}
    {...props}
  >
    {title === undefined ? (
      <title id={titleId}>{'ArrowDown'}</title>
    ) : title ? (
      <title id={titleId}>{title}</title>
    ) : null}
    <path d="M8.24698 11.2926L12.5334 6.8723C12.8009 6.59648 12.6388 6.06918 12.2865 6.06918H3.71358C3.3613 6.06918 3.19917 6.59648 3.46664 6.8723L7.7531 11.2926C7.8952 11.4391 8.10488 11.4391 8.24698 11.2926Z" />
  </svg>
);
const ArrowDown = memo(SvgComponent);
export default ArrowDown;
