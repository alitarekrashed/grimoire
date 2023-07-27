'use client'

import { EntityModel } from '@/models/db/entity-model'
import { CardFactory } from '@/utils/services/card-factory'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { RefObject, useEffect, useRef, useState } from 'react'
import CardDisplayList from '../card-display-list/card-display-list'
import SelectableGrid from '../selectable-grid/selectable-grid'
import React from 'react'

export default function SplitViewDisplay<T extends EntityModel>({
  columnDefs,
  entities,
  gridSize,
}: {
  columnDefs: any[]
  entities: T[]
  gridSize?: 'small' | 'medium'
}) {
  const [cards, setCards] = useState<CardWithRef<T>[]>([])

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    let foundEntities: CardWithRef[] = []
    for (const key of current.keys()) {
      const foundEntity = entities.find((value) => value._id === key)
      if (
        foundEntity &&
        foundEntities
          .map((entity) => entity.value._id)
          .includes(foundEntity._id) === false
      ) {
        foundEntities.push({
          value: foundEntity,
          reference: React.createRef<HTMLDivElement>(),
        })
      }
    }
    setCards(foundEntities)
  }, [entities, searchParams])

  useEffect(() => {
    const query = `?${cards
      .map((card) => card.value)
      .map((val) => val._id)
      .join('&')}`
    router.replace(`${pathname}${query}`)
  }, [cards, pathname, router])

  function handleSelectedCard(item: T) {
    setCards((cards) => {
      let newCards = [...cards]

      let index: number = cards.map((card) => card.value).indexOf(item)
      if (index === -1) {
        newCards = [
          { value: item, reference: React.createRef<HTMLDivElement>() },
          ...cards,
        ]
      } else {
        newCards[index].reference.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        })
      }

      return newCards
    })
  }

  function handleRemoved(item: T) {
    setCards((cards) => {
      let index: number = cards.map((card) => card.value).indexOf(item)
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
          cards={cards.map((card) => (
            <div key={card.value._id.toString()} className="pb-4">
              {CardFactory<T>({
                reference: card.reference,
                card: card.value,
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

interface CardWithRef<T extends EntityModel> {
  value: T
  reference: RefObject<HTMLDivElement>
}
