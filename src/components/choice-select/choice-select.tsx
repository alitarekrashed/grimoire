import * as Select from '@radix-ui/react-select'
import React, { Ref, useState } from 'react'
import { FaChevronDown, FaCheck } from 'react-icons/fa'
import classnames from 'classnames'
import { roboto_condensed } from '@/utils/fonts'
import {
  BlockIndicator,
  Indicator,
  OptionInlineIndicator,
} from '../indicators/indicator'

export function ChoiceSelect({
  title,
  options,
  value,
  onChange,
}: {
  value: string
  title: string
  options: string[]
  onChange: (value: string) => void
}) {
  const [currentValue, setCurrentValue] = useState<string>(value)

  return (
    <div className="flex flex-col gap-1">
      <Select.Root
        value={currentValue}
        onValueChange={(val) => {
          setCurrentValue(val)
          onChange(val)
        }}
      >
        <Select.Trigger className="flex h-9 hover:bg-stone-600 rounded-md border border-stone-300 w-full items-end pl-1 relative focus:shadow">
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
      {!currentValue && <BlockIndicator message={`Please select a ${title}`} />}
    </div>
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
