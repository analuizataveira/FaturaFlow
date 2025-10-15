import { memo, SVGProps } from "react"

function SvgComponent({fill, ...props}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={100}
      height={100}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.4 11.1a3.75 3.75 0 00-5.3 5.3l72.5 72.5a3.75 3.75 0 105.3-5.3l-8.725-8.725a50.145 50.145 0 0016.5-21.9 8.255 8.255 0 000-5.925A50.02 50.02 0 0049.995 15a49.78 49.78 0 00-23.72 5.97L16.4 11.1zm22.36 22.35l5.46 5.46a12.5 12.5 0 0116.87 16.865l5.455 5.46A20 20 0 0038.76 33.45z"
        fill={fill}
      />
      <path
        d="M53.74 69.65l12.615 12.615A49.937 49.937 0 0150.005 85c-21.29 0-39.47-13.3-46.685-32.05a8.255 8.255 0 010-5.93A50.035 50.035 0 0114.195 30.1L30.35 46.26a20 20 0 0023.39 23.39z"
        fill={fill}
      />
    </svg>
  )
}
const EyeClosed = memo(SvgComponent)
export default EyeClosed
