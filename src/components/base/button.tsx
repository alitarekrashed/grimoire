import { roboto_flex } from '@/utils/fonts'
import { forwardRef, useEffect, useState } from 'react'

export const Button = forwardRef(function Button(props: any, ref) {
  const { label, onClick, disabled, className, ...otherProps } = props
  const [isDisabled, setIsDisabled] = useState<boolean>(disabled ?? false)

  useEffect(() => {
    setIsDisabled(disabled!)
  }, [disabled])

  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={`${roboto_flex.className} text-[9px] font-light px-2 border rounded-md bg-stone-800 hover:bg-stone-600 disabled:border-stone-500 disabled:text-stone-500 disabled:hover:bg-transparent ${className}`}
      tabIndex={0}
      {...otherProps}
    >
      {label}
    </button>
  )
})
