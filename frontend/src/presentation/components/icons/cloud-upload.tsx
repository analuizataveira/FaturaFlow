import { SVGProps, memo } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const SvgComponent = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    width="38"
    height="34"
    viewBox="0 0 38 34"
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
      d="M11.2916 29.7231C9.18579 29.5745 7.18488 28.8183 5.5746 27.5625C3.96432 26.3066 2.82701 24.6154 2.32507 22.7302C1.82313 20.845 1.98222 18.8623 2.77963 17.0651C3.57704 15.268 4.97199 13.7483 6.76529 12.7231C7.14687 9.98903 8.59957 7.47646 10.8515 5.65555C13.1035 3.83464 16.0003 2.8302 19 2.8302C21.9996 2.8302 24.8965 3.83464 27.1484 5.65555C29.4004 7.47646 30.8531 9.98903 31.2346 12.7231C33.0279 13.7483 34.4229 15.268 35.2203 17.0651C36.0177 18.8623 36.1768 20.845 35.6749 22.7302C35.1729 24.6154 34.0356 26.3066 32.4253 27.5625C30.815 28.8183 28.8141 29.5745 26.7083 29.7231V29.75H11.2916V29.7231ZM20.5416 18.4167H25.1666L19 11.3333L12.8333 18.4167H17.4583V24.0833H20.5416V18.4167Z"
      fill="#1E77CC"
    />
  </svg>
);

const CloudUpload = memo(SvgComponent);
export default CloudUpload;
