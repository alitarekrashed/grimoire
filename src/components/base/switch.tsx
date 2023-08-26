import * as RadixSwitch from '@radix-ui/react-switch'

export function Switch({
  label,
  id,
  checked,
  onChecked,
}: {
  label: string
  id: string
  checked?: boolean
  onChecked: (checked: boolean) => void
}) {
  return (
    <form>
      <div className="flex items-center">
        <label className="pr-2" htmlFor={id}>
          {label}
        </label>
        <RadixSwitch.Root
          checked={checked}
          onCheckedChange={onChecked}
          className="w-11 h-6 rounded-full border bg-stone-600 data-[state=checked]:bg-stone-950 hover:bg-stone-700 hover:data-[state=checked]:bg-stone-700"
          id={id}
        >
          <RadixSwitch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-5" />
        </RadixSwitch.Root>
      </div>
    </form>
  )
}
