'use client'

import { EntityModel } from '@/models/entity-model'
import { CardFactoryService } from '@/utils/services/card-factory.service'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import CardDisplayList from '../card-display-list/card-display-list'
import SelectableGrid from '../selectable-grid/selectable-grid'

export default function SplitViewDisplay<T extends EntityModel>({
  columnDefs,
  entities,
  gridSize,
}: {
  columnDefs: any[]
  entities: T[]
  gridSize?: 'small' | 'medium'
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

  function handleRemoved(item: T) {
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

  return (
    <div className="h-full grid grid-cols-5 gap-x-4">
      <div
        className={`bg-neutral-800 p-3 rounded ${
          gridSize === 'small' ? 'col-span-1' : 'col-span-3'
        } shadow-stone-200 drop-shadow-md`}
      >
        <SelectableGrid
          rowData={entities}
          onSelectedItem={handleSelectedCard}
          columnDefs={columnDefs}
        ></SelectableGrid>
      </div>
      <div
        className={`h-full bg-neutral-800 p-3 rounded overflow-y-scroll ${
          gridSize === 'small' ? 'col-span-4' : 'col-span-2'
        } shadow-stone-200 drop-shadow-md`}
      >
        <CardDisplayList
          children={cards.map((value) => (
            <div key={value.id} className="pb-4">
              {CardFactoryService<T>({
                card: value,
                onRemoved: handleRemoved,
                contentTextSizeClassName: 'sm',
                collapsible: true,
              })}
            </div>
          ))}
        ></CardDisplayList>
      </div>
    </div>
  )
}
