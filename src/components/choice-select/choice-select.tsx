import * as Select from '@radix-ui/react-select'
import React, { Ref } from 'react'
import { FaChevronDown, FaCheck } from 'react-icons/fa'
import classnames from 'classnames'
import { roboto_condensed } from '@/utils/fonts'

export function ChoiceSelect({
  title,
  options,
}: {
  title: string
  options: string[]
}) {
  return (
    <Select.Root>
      <Select.Trigger className="inline-flex h-9 hover:bg-stone-600 rounded-md border border-stone-300 w-44 items-end pl-1 relative focus:shadow">
        <Select.Value />
        <Select.Icon asChild>
          <FaChevronDown className="absolute right-2 top-3" />
        </Select.Icon>
        <span className="text-stone-300 absolute top-0 left-1 text-[9px]">
          {title}
        </span>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className={`${roboto_condensed.className} overflow-hidden bg-stone-800 rounded-md border border-stone-300 z-[100]`}
        >
          <Select.Viewport className="p-1">
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

const SelectItem = React.forwardRef(
  (
    {
      children,
      className,
      value,
      ...props
    }: {
      children: React.ReactNode
      className?: string
      value: any
    },
    forwardedRef: Ref
  ) => {
    return (
      <Select.Item
        className={classnames(
          'rounded-md flex items-center pl-6 relative select-none data-[highlighted]:bg-stone-600',
          className
        )}
        value={value}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-0 w-6 inline-flex items-center justify-center">
          <FaCheck size="12px" />
        </Select.ItemIndicator>
      </Select.Item>
    )
  }
)
