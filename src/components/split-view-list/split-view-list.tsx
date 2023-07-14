'use client'

import { ReactNode, useEffect, useState } from 'react'
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

  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    let foundEntities: T[] = []
    for (const key of current.keys()) {
      const foundEntity = entities.find((value) => value.id === key)
      if (foundEntity && foundEntities.includes(foundEntity) === false) {
        foundEntities.push(foundEntity)
      }
    }
    setCards(foundEntities)
  }, [entities])

  function handleSelectedCard(items: T[]) {
    setCards((cards) => {
      let newCards = [...cards]

      items.forEach((item) => {
        let index: number = cards.indexOf(item)
        if (index === -1) {
          newCards = [item, ...cards]
        } else {
          // this shifts the selected card to the top... maybe unnecessary?
          // what if it autoscrolled to their position???
          let shiftedCards = cards.slice()
          shiftedCards.splice(index, 1)
          shiftedCards.unshift(item)
          newCards = shiftedCards
        }
      })

      const query = `?${newCards.map((val) => val.id).join('&')}`
      router.replace(`${pathname}${query}`)
      return newCards
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
