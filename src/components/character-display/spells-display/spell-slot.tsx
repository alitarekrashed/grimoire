import { useEffect, useState } from 'react'
import { GiTriorb } from 'react-icons/gi'

export function SpellSlot({
  initial,
  onClick,
}: {
  initial: boolean
  onClick: (checked: boolean) => void
}) {
  const [checked, setChecked] = useState<boolean>(initial)

  useEffect(() => {
    setChecked(initial)
  }, [initial])

  return (
    <button
      className="rounded-full p-0.5 text-stone-800 bg-emerald-300 shadow-sm shadow-emerald-300/50 data-[checked=true]:text-stone-300/50 data-[checked=true]:hover:text-stone-200/75 data-[checked=true]:bg-transparent data-[checked=true]:shadow-none transition-transform duration-100 hover:scale-125"
      data-checked={checked}
      onClick={() => {
        onClick(!checked)
        setChecked(!checked)
      }}
    >
      <GiTriorb />
    </button>
  )
}
