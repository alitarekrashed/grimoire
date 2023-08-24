import { FaExclamationTriangle } from 'react-icons/fa'

export function Indicator() {
  return <FaExclamationTriangle className="text-amber-500" />
}

export function OptionInlineIndicator() {
  return (
    <span className="right-5 absolute">
      <Indicator />
    </span>
  )
}
