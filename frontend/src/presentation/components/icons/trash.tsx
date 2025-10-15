import { SVGProps, memo } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgComponent = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="14"
    height="16"
    viewBox="0 0 14 16"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby={titleId}
    {...props}
  >
    {title === undefined ? (
      <title id={titleId}>{'Plus'}</title>
    ) : title ? (
      <title id={titleId}>{title}</title>
    ) : null}
    <path d="M2.8335 15.5C2.37516 15.5 1.9828 15.3368 1.65641 15.0104C1.33002 14.684 1.16683 14.2917 1.16683 13.8333V3H0.333496V1.33333H4.50016V0.5H9.50016V1.33333H13.6668V3H12.8335V13.8333C12.8335 14.2917 12.6703 14.684 12.3439 15.0104C12.0175 15.3368 11.6252 15.5 11.1668 15.5H2.8335ZM4.50016 12.1667H6.16683V4.66667H4.50016V12.1667ZM7.8335 12.1667H9.50016V4.66667H7.8335V12.1667Z " />
  </svg>
);

const Trash = memo(SvgComponent);
export default Trash;
