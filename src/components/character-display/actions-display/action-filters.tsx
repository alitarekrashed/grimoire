import { cloneDeep } from 'lodash'
import { useState } from 'react'

type FilterState = { name: string; active: boolean }

export function ActionFilters({
  onFilter,
}: {
  onFilter: (value: string[]) => void
}) {
  const [filters, setFilters] = useState<FilterState[]>([
    { name: 'Augment', active: false },
    { name: 'Debilitate', active: false },
    { name: 'Defensive', active: false },
    { name: 'Downtime', active: false },
    { name: 'Encounter', active: false },
    { name: 'Healing', active: false },
    { name: 'Interaction', active: false },
    { name: 'Movement', active: false },
    { name: 'Offensive', active: false },
    { name: 'Support', active: false },
  ])

  return (
    <div className={`flex flex-col gap-1`}>
      <div className="flex flex-row flex-wrap gap-1">
        {filters.map((value: FilterState, index: number) => (
          <FilterBadge
            key={value.name}
            filter={value.name}
            onToggle={(value: boolean) => {
              const updated = cloneDeep(filters)
              updated[index].active = value
              setFilters(updated)
              onFilter(
                updated
                  .filter((value) => value.active)
                  .map((value) => value.name)
              )
            }}
          ></FilterBadge>
        ))}
      </div>
    </div>
  )
}

function FilterBadge({
  filter,
  onToggle,
}: {
  filter: string
  onToggle: (val: boolean) => void
}) {
  const [active, setActive] = useState<boolean>(false)

  return (
    <button
      className="flex flex-row gap-1 border p-1 rounded-md bg-stone-800 hover:bg-stone-600 data-[active=true]:bg-violet-700 hover:data-[active=true]:bg-violet-700/50"
      onClick={() => {
        const value = !active
        setActive(value)
        onToggle(value)
      }}
      data-active={active}
    >
      <span>{filter}</span>
    </button>
  )
}
