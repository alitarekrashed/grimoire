import { useState } from 'react'
import { GiTriorb } from 'react-icons/gi'

export function SpellSlot({
  initial,
  onClick,
}: {
  initial: boolean
  onClick: (checked: boolean) => void
}) {
  const [checked, setChecked] = useState<boolean>(initial)

  return (
    <button
      className="data-[checked=true]:text-stone-300/50 data-[checked=true]:hover:text-stone-200/75 transition-transform duration-100 hover:scale-125"
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
