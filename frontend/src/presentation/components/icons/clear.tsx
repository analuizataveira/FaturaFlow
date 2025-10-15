import { SVGProps, memo } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgComponent = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="14"
    height="12"
    viewBox="0 0 14 12"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby={titleId}
    {...props}
  >
    {title === undefined ? (
      <title id={titleId}>{'Clear'}</title>
    ) : title ? (
      <title id={titleId}>{title}</title>
    ) : null}
    <path d="M10.4998 10H13.6664V11.3333H9.16642L10.4998 10ZM2.16642 11.3333L0.749754 9.91667C0.494199 9.66111 0.363643 9.34444 0.358087 8.96667C0.352532 8.58889 0.477532 8.26667 0.733087 8L8.06642 0.4C8.32198 0.133333 8.63587 0 9.00809 0C9.38031 0 9.6942 0.127778 9.94975 0.383333L13.2664 3.7C13.522 3.95556 13.6498 4.27222 13.6498 4.65C13.6498 5.02778 13.522 5.34444 13.2664 5.6L7.66642 11.3333H2.16642Z" />
  </svg>
);
const Clear = memo(SvgComponent);
export default Clear;