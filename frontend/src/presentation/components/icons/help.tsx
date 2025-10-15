import { SVGProps, memo } from "react"

function SvgComponent({fill, ...props}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 0a10 10 0 1010 10A10.011 10.011 0 0010 0zm1 15H9v-2h2v2zm.447-4.605a.804.804 0 00-.447.723V12H9v-.882a2.795 2.795 0 011.553-2.513.804.804 0 00.447-.723.828.828 0 00-.81-.882h-.38a.81.81 0 00-.81.809 1 1 0 11-2 0A2.812 2.812 0 019.81 5h.38a2.854 2.854 0 011.257 5.395z"
        fill={fill}
      />
    </svg>
  )
}
const Help = memo(SvgComponent)
export default Help
