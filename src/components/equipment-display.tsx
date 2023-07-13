'use client'

import { Equipment } from '@/models/equipment'
import { useState } from 'react'
import EquipmentCardList from './equipment-card-list'
import EquipmentGrid from './equipment-grid'

export default function EquipmentDisplay() {
  const [cards, setCards] = useState<Equipment[]>([])

  function handleSelectedCard(item: Equipment) {
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
        <EquipmentGrid onSelectedItem={handleSelectedCard}></EquipmentGrid>
      </div>
      <div className="bg-neutral-800 p-3 rounded overflow-x-auto col-span-2 shadow-slate-200 drop-shadow-md">
        <EquipmentCardList equipment={cards}></EquipmentCardList>
      </div>
    </div>
  )
}
