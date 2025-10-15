  import { SVGProps, memo } from 'react';

  interface SVGRProps {
    title?: string;
    titleId?: string;
  }

  const SvgComponent = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
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
        d="M7.56665 1.25C7.56665 1.05109 7.48763 0.860322 7.34698 0.71967C7.20633 0.579018 7.01556 0.5 6.81665 0.5C6.61774 0.5 6.42697 0.579018 6.28632 0.71967C6.14567 0.860322 6.06665 1.05109 6.06665 1.25V5.75H1.56665C1.36774 5.75 1.17697 5.82902 1.03632 5.96967C0.895668 6.11032 0.81665 6.30109 0.81665 6.5C0.81665 6.69891 0.895668 6.88968 1.03632 7.03033C1.17697 7.17098 1.36774 7.25 1.56665 7.25H6.06665V11.75C6.06665 11.9489 6.14567 12.1397 6.28632 12.2803C6.42697 12.421 6.61774 12.5 6.81665 12.5C7.01556 12.5 7.20633 12.421 7.34698 12.2803C7.48763 12.1397 7.56665 11.9489 7.56665 11.75V7.25H12.0667C12.2656 7.25 12.4563 7.17098 12.597 7.03033C12.7376 6.88968 12.8167 6.69891 12.8167 6.5C12.8167 6.30109 12.7376 6.11032 12.597 5.96967C12.4563 5.82902 12.2656 5.75 12.0667 5.75H7.56665V1.25Z"
        strokeWidth="2"
      />
    </svg>
  );

  const Plus = memo(SvgComponent);
  export default Plus;
