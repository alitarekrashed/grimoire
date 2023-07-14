'use client'

import { ReactNode, useState } from 'react'
import CardDisplayList from '../card-display-list/card-display-list'
import SelectableGrid from '../selectable-grid/selectable-grid'

//TODO this should become id instead of name
export default function SplitViewDisplay<T extends { name: string }>({
  columnDefs,
  entities,
  buildCard,
}: {
  columnDefs: any[]
  entities: T[]
  buildCard: (entity: T) => ReactNode
}) {
  const [cards, setCards] = useState<T[]>([])

  function handleSelectedCard(item: T) {
    setCards((cards) => {
      let index: number = cards.indexOf(item)
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

  return (
    <div className="h-full grid grid-cols-5 gap-x-4">
      <div className="bg-neutral-800 p-3 rounded col-span-3 shadow-slate-200 drop-shadow-md">
        <SelectableGrid
          rowData={entities}
          onSelectedItem={handleSelectedCard}
          columnDefs={columnDefs}
        ></SelectableGrid>
      </div>
      <div className="h-full bg-neutral-800 p-3 rounded overflow-y-scroll col-span-2 shadow-slate-200 drop-shadow-md">
        <CardDisplayList
          children={cards.map((value) => (
            <div key={value.name} className="pb-4">
              {buildCard(value)}
            </div>
          ))}
        ></CardDisplayList>
      </div>
    </div>
  )
}
