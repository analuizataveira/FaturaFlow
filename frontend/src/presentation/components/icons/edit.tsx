import { SVGProps, memo } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgComponent = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="18"
    height="19"
    viewBox="0 0 18 20"
    xmlns="http://www.w3.org/2000/svg"
    aria-labelledby={titleId}
    {...props}
  >
    {title === undefined ? (
      <title id={titleId}>{'Plus'}</title>
    ) : title ? (
      <title id={titleId}>{title}</title>
    ) : null}
    <path d="M0.666504 18.9998V15.6665H17.3332V18.9998H0.666504ZM2.33317 13.9998V10.4582L11.6665 1.14567C11.8193 0.992893 11.9964 0.874837 12.1978 0.791504C12.3991 0.708171 12.6109 0.666504 12.8332 0.666504C13.0554 0.666504 13.2707 0.708171 13.479 0.791504C13.6873 0.874837 13.8748 0.999837 14.0415 1.1665L15.1873 2.33317C15.354 2.48595 15.4755 2.6665 15.5519 2.87484C15.6283 3.08317 15.6665 3.29845 15.6665 3.52067C15.6665 3.729 15.6283 3.93387 15.5519 4.13525C15.4755 4.33664 15.354 4.52067 15.1873 4.68734L5.87484 13.9998H2.33317ZM12.8332 4.6665L13.9998 3.49984L12.8332 2.33317L11.6665 3.49984L12.8332 4.6665Z" />
  </svg>
);

const Edit = memo(SvgComponent);
export default Edit;
