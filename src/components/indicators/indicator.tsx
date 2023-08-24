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

export function BlockIndicator({ message }: { message: string }) {
  return (
    <div className="inline-flex items-center gap-2 w-full rounded-md border border-amber-700">
      <span className="border-r p-2 border-r-amber-700">
        <Indicator />
      </span>
      <span className="text-xs">{message}</span>
    </div>
  )
}
