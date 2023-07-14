'use client'

import { ReactNode, useEffect, useState } from 'react'
import CardDisplayList from '../card-display-list/card-display-list'
import SelectableGrid from '../selectable-grid/selectable-grid'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

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

  useEffect(() => {
    const query = `?${cards.map((val) => val.id).join('&')}`
    router.replace(`${pathname}${query}`)
  }, [cards])

  function handleSelectedCard(item: T) {
    setCards((cards) => {
      let newCards = [...cards]

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

      return newCards
    })
  }

  function handleClosed(item: T) {
    setCards((cards) => {
      let index = cards.indexOf(item)
      if (index > -1) {
        const newCards = cards.slice()
        newCards.splice(index, 1)
        return newCards
      }
      return cards
    })
  }

  const buildCardWithClosedHandler: (entity: T) => ReactNode = (entity: T) => {
    let component: ReactNode = buildCard(entity)
    return React.cloneElement(component as React.ReactElement<any>, {
        onRemoved: handleClosed,
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
              {buildCardWithClosedHandler(value)}
            </div>
          ))}
        ></CardDisplayList>
      </div>
    </div>
  )
}
