'use client'

import Condition from '@/models/condition'
import { useEffect, useState } from 'react'
import CardDisplayList from '../card-display-list/card-display-list'
import SelectableGrid from '../selectable-grid/selectable-grid'
import ConditionCard from './condition-card'

export default function ConditionsDisplay() {
  const [conditions, setConditions] = useState([])
  const [cards, setCards] = useState<Condition[]>([])
  const [columnDefs, setColumnDefs] = useState([
    { field: 'name', filter: true, flex: 1 },
  ])

  useEffect(() => {
    fetch('http://localhost:3000/api/conditions', {
      cache: 'no-store',
    })
      .then((result) => result.json())
      .then((conditions) => {
        setConditions(conditions)
      })
  }, [])

  // TODO should extract the display component
  function handleSelectedCard(item: Condition) {
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
          rowData={conditions}
          onSelectedItem={handleSelectedCard}
          columnDefs={columnDefs}
        ></SelectableGrid>
      </div>
      <div className="h-full bg-neutral-800 p-3 rounded overflow-y-scroll col-span-2 shadow-slate-200 drop-shadow-md">
        <CardDisplayList
          children={cards.map((value) => (
            <div key={value.name} className="pb-4">
              <ConditionCard value={value}></ConditionCard>
            </div>
          ))}
        ></CardDisplayList>
      </div>
    </div>
  )
}
