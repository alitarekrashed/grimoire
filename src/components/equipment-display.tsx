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
    <div className="h-full grid grid-cols-5">
      <div className="pl-5 col-span-3">
        <EquipmentGrid onSelectedItem={handleSelectedCard}></EquipmentGrid>
      </div>
      <div className="overflow-x-auto col-span-2">
        <EquipmentCardList equipment={cards}></EquipmentCardList>
      </div>
    </div>
  )
}
