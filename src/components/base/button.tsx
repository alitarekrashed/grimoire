import { useEffect, useState } from 'react'

export function Button({
  label,
  onClick,
  disabled,
}: {
  label: string
  onClick?: () => void
  disabled?: boolean
}) {
  const [isDisabled, setIsDisabled] = useState<boolean>(disabled ?? false)

  useEffect(() => {
    setIsDisabled(disabled!)
  }, [disabled])

  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className="text-[9px] font-light px-2 border rounded-md bg-stone-800 hover:bg-stone-600 disabled:border-stone-500 disabled:text-stone-500 disabled:hover:bg-transparent"
      tabIndex={0}
    >
      {label}
    </button>
  )
}
