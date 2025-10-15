import { memo, SVGProps } from "react"

function SvgComponent({ fill, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 0a10 10 0 1010 10A10.012 10.012 0 0010 0zm1 15H9V8h2v7zm0-8H9V5h2v2z"
        fill={fill}
      />
    </svg>
  )
}
const Warning = memo(SvgComponent)
export default Warning
