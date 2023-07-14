'use client'

import { ReactNode, useState } from 'react'
import CardDisplayList from '../card-display-list/card-display-list'
import SelectableGrid from '../selectable-grid/selectable-grid'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

//TODO this should become id instead of name
export default function SplitViewDisplay<T extends { id: string }>({
  columnDefs,
  entities,
  buildCard,
  gridSize,
}: {
  columnDefs: any[]
  entities: T[]
  buildCard: (entity: T) => ReactNode
  gridSize?: number
}) {
  const [cards, setCards] = useState<T[]>([])

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const current = new URLSearchParams(Array.from(searchParams.entries()))
  for (const key of current.keys()) {
    const foundEntity = entities.find((value) => value.id === key)
    if (foundEntity && cards.includes(foundEntity) === false) {
      console.log(foundEntity)
      handleSelectedCard(foundEntity)
    }
  }

  function handleSelectedCard(item: T) {
    setCards((cards) => {
      let index: number = cards.indexOf(item)

      let updatedIds = cards.concat([item]).map((val) => val.id)
      const query = `?${updatedIds.join('&')}`
      router.push(`${pathname}${query}`)

      if (index === -1) {
        return [item, ...cards]
      } else {
        // this shifts the selected card to the top... maybe unnecessary?
        // what if it autoscrolled to their position???
        let shiftedCards = cards.slice()
        shiftedCards.splice(index, 1)
        shiftedCards.unshift(item)
        return shiftedCards
      }
    })
  }

  let columnsForGrid = gridSize && gridSize <= 5 ? gridSize : 3
  let columnsForCardsDisplay = 5 - columnsForGrid

  return (
    <div className="h-full grid grid-cols-5 gap-x-4">
      <div
        className={`bg-neutral-800 p-3 rounded col-span-${columnsForGrid} shadow-slate-200 drop-shadow-md`}
      >
        <SelectableGrid
          rowData={entities}
          onSelectedItem={handleSelectedCard}
          columnDefs={columnDefs}
        ></SelectableGrid>
      </div>
      <div
        className={`h-full bg-neutral-800 p-3 rounded overflow-y-scroll col-span-${columnsForCardsDisplay} shadow-slate-200 drop-shadow-md`}
      >
        <CardDisplayList
          children={cards.map((value) => (
            <div key={value.id} className="pb-4">
              {buildCard(value)}
            </div>
          ))}
        ></CardDisplayList>
      </div>
    </div>
  )
}
