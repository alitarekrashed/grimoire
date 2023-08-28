import * as RadixSeparator from '@radix-ui/react-separator'

export function Separator({ className }: { className: string }) {
  return (
    <RadixSeparator.Root className={`w-full bg-stone-400 h-px ${className}`} />
  )
}
