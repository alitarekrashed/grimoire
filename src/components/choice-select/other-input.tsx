import { BlockIndicator } from '../indicators/indicator'

export function OtherInput({
  value,
  title,
  onChange,
}: {
  value: string
  title?: string
  onChange: (value: string) => void
}) {
  return (
    <div className="mt-1 flex flex-col gap-1 w-full">
      <div className="relative h-9">
        <span className="text-stone-300 absolute top-0 text-[9px] pl-1.5">
          Other: {title}
        </span>
        <input
          className="absolute bottom-0 bg-transparent rounded-md h-full w-full pt-4 pl-1 border border-stone-300"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
          }}
        ></input>
      </div>
      {!value && <BlockIndicator message={`Please select a ${title}`} />}
    </div>
  )
}
