import { useEffect, useState } from 'react'

export function RefocusButton({
  disabled,
  onClick,
}: {
  disabled?: boolean
  onClick: () => void
}) {
  const [isDisabled, setIsDisabled] = useState<boolean>(disabled ?? false)

  useEffect(() => {
    setIsDisabled(disabled!)
  }, [disabled])

  return (
    <button
      disabled={isDisabled}
      className="text-[9px] font-light rounded-md border px-1 hover:bg-stone-300/40 disabled:border-stone-500 disabled:text-stone-500 disabled:hover:bg-transparent"
      onClick={onClick}
    >
      REFOCUS
    </button>
  )
}
