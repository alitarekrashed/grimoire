export default function Traits({ value }: { value: string[] }) {
  return (
    <div className="text-xs my-1">
      {value.map((val) => (
        <Trait key={val} value={val}></Trait>
      ))}
    </div>
  )
}

export function Trait({ value }: { value: string }) {
  return (
    <span className="border border-slate-400 rounded bg-slate-600 p-0.5 mr-2">
      {value}
    </span>
  )
}
