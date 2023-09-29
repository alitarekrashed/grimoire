import { useState } from 'react'

export function ActionFilters() {
  const filters = [
    'Augment',
    'Debilitate',
    'Defensive',
    'Downtime',
    'Encounter',
    'Healing',
    'Interaction',
    'Movement',
    'Offensive',
    'Support',
  ]

  return (
    <div className={`flex flex-col gap-1`}>
      <div className="flex flex-row flex-wrap gap-1">
        {filters.map((value: string) => (
          <FilterBadge key={value} filter={value}></FilterBadge>
        ))}
      </div>
    </div>
  )
}

function FilterBadge({ filter }: { filter: string }) {
  const [active, setActive] = useState<boolean>(false)

  return (
    <button
      className="flex flex-row gap-1 border p-1 rounded-md bg-stone-800 hover:bg-stone-600 data-[active=true]:bg-violet-700 hover:data-[active=true]:bg-violet-700/50"
      onClick={() => setActive(!active)}
      data-active={active}
    >
      <span>{filter}</span>
    </button>
  )
}
